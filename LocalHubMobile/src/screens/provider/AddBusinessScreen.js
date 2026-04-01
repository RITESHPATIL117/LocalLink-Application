import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  useWindowDimensions, Switch, ActivityIndicator, Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';
import InputField from '../../components/InputField';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import categoryService from '../../services/categoryService';
import * as Haptics from 'expo-haptics';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as ImagePicker from 'expo-image-picker';

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Home Services', 'Beauty & Wellness', 'Education & Tutoring',
  'Healthcare', 'Restaurants & Food', 'Automotive', 'Events & Entertainment',
  'IT & Tech Support', 'Construction & Repair', 'Fitness & Sports',
  'Legal & Finance', 'Retail & Shopping', 'Travel & Hospitality', 'Other',
];

const PACKAGES = [
  {
    id: 'free', name: 'Free', price: '₹0/mo', color: '#1E293B',
    features: ['Basic Profile', 'Photo Gallery', 'Max 2 Photos'],
  },
  {
    id: 'silver', name: 'Silver', price: '₹499/mo', color: '#94A3B8',
    features: ['Verified Badge', 'Top 5 in Search', 'Lead Generation', 'Max 10 Photos'],
  },
  {
    id: 'gold', name: 'Gold', price: '₹999/mo', color: '#F59E0B',
    features: ['Gold Badge', 'Top 3 in Search', 'Premium Support', 'Analytics', 'Max 30 Photos'],
  },
  {
    id: 'diamond', name: 'Diamond', price: '₹1499/mo', color: colors.primary,
    features: ['Diamond Badge', '#1 in Search', 'Dedicated Manager', 'No Ads on Profile', 'Unlimited Photos'],
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TOTAL_STEPS = 4;

const INITIAL_DATA = {
  profileImage: null,
  name: '', tagline: '', category: '', customCategory: '', subCategory: '', description: '',
  yearEstablished: '', employees: '',
  phone: '', phone2: '', email: '', website: '',
  address: '', city: '', state: '', pinCode: '', landmark: '',
  instagram: '', facebook: '',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  openTime: '09:00 AM', closeTime: '07:00 PM',
  services: '', serviceAreas: '', priceRange: 'Moderate',
  gst: '', licenseNo: '',
  homeVisit: false, onlineBooking: true, emiOption: false, freeQuote: true, certified: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SectionTitle = ({ step, title, subtitle }) => (
  <AnimatedFadeIn duration={600} style={sectionStyles.header}>
    <View style={sectionStyles.stepBadge}>
      <LinearGradient colors={[colors.primary, '#E65C00']} style={StyleSheet.absoluteFill} borderRadius={12} />
      <Text style={sectionStyles.stepNum}>{step}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={sectionStyles.title}>{title}</Text>
      {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  </AnimatedFadeIn>
);

const sectionStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 28, gap: 16 },
  stepBadge: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  stepNum: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '600' },
});

const ProgressBar = ({ step }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const isDone = i < step - 1;
        const isActive = i === step - 1;
        return (
          <View key={i} style={styles.progressTrack}>
            <LinearGradient
              colors={isDone ? [colors.primary, '#E65C00'] : isActive ? [colors.primary, colors.primary] : ['#E2E8F0', '#E2E8F0']}
              start={{x:0, y:0}} end={{x:1, y:1}}
              style={[
                styles.progressFill,
                { width: isDone ? '100%' : isActive ? '50%' : '0%' }
              ]}
            />
          </View>
        );
      })}
      <Text style={styles.progressLabel}>{Math.round((step/TOTAL_STEPS)*100)}% Complete</Text>
    </View>
  );
};

// ─── Step Components ─────────────────────────────────────────────────────────

const PhotoPicker = ({ label, value, onPick, isRequired, error }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'We need camera roll permissions to add photos.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images || ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} {isRequired && <Text style={{ color: '#EF4444' }}>*</Text>}</Text>
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={[styles.profilePicker, error && styles.inputError]} 
        onPress={pickImage}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.profileImagePreview} />
        ) : (
          <View style={styles.profilePickerPlaceholder}>
            <Ionicons name="camera-outline" size={32} color={colors.primary} />
            <Text style={styles.profilePickerText}>Tap to upload profile photo</Text>
          </View>
        )}
        {value && (
          <View style={styles.profilePickerEdit}>
            <Ionicons name="pencil" size={14} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const StepBasicInfo = ({ data, onChange, errors, refs }) => {
  const [showCats, setShowCats] = useState(false);

  return (
    <View>
      <SectionTitle step={1} title="Basic Information" subtitle="Tell customers who you are and what you do." />

      <AnimatedFadeIn delay={100} duration={500}>
        <PhotoPicker 
          label="Business Profile Photo"
          value={data.profileImage}
          onPick={uri => onChange('profileImage', uri)}
          isRequired
          error={errors.profileImage}
        />

        <InputField variant='light'
          label="Business Name"
          placeholder="e.g. SuperFast Plumbing Services"
          value={data.name}
          onChangeText={v => onChange('name', v)}
          error={errors.name}
          icon="briefcase-outline"
          isRequired
          ref={refs.name}
          returnKeyType="next"
          onSubmitEditing={() => refs.tagline.current?.focus()}
        />

        <InputField variant='light'
          label="Tagline / Short Description"
          placeholder="e.g. Fast, reliable home services 24/7"
          value={data.tagline}
          onChangeText={v => onChange('tagline', v)}
          error={errors.tagline}
          icon="create-outline"
          ref={refs.tagline}
          returnKeyType="next"
          onSubmitEditing={() => setShowCats(true)}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category <Text style={{ color: '#EF4444' }}>*</Text></Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.premiumInput, errors.category && styles.inputError]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCats(!showCats);
            }}
          >
            <Ionicons name="grid-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ flex: 1, color: data.category ? '#1E293B' : '#94A3B8', fontSize: 16, fontWeight: '600' }}>
              {data.category || 'Select a category'}
            </Text>
            <Ionicons name={showCats ? 'chevron-up' : 'chevron-down'} size={20} color="#94A3B8" />
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          
          {showCats && (
            <AnimatedFadeIn duration={300} style={styles.dropdown}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.dropdownItem, data.category === cat && styles.dropdownItemActive]}
                  onPress={() => { 
                    onChange('category', cat); 
                    setShowCats(false); 
                    if (cat !== 'Other') refs.subCategory.current?.focus(); 
                  }}
                >
                  <Text style={[styles.dropdownItemText, data.category === cat && { color: colors.secondary, fontWeight: '700' }]}>
                    {cat}
                  </Text>
                  {data.category === cat && <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />}
                </TouchableOpacity>
              ))}
            </AnimatedFadeIn>
          )}
        </View>

        {data.category === 'Other' && (
          <InputField variant='light'
            label="Propose New Category"
            placeholder="e.g. Pet Grooming, Solar Repair"
            value={data.customCategory}
            onChangeText={v => onChange('customCategory', v)}
            error={errors.customCategory}
            icon="bulb-outline"
            ref={refs.customCategory}
            returnKeyType="next"
            onSubmitEditing={() => refs.subCategory.current?.focus()}
          />
        )}

        <InputField variant='light'
          label="Sub-Category / Service Type"
          placeholder="e.g. Pipe Repair, AC Installation"
          value={data.subCategory}
          onChangeText={v => onChange('subCategory', v)}
          error={errors.subCategory}
          icon="pricetag-outline"
          ref={refs.subCategory}
          returnKeyType="next"
          onSubmitEditing={() => refs.description.current?.focus()}
        />

        <InputField variant='light'
          label="About Your Business"
          placeholder="Describe your services..."
          value={data.description}
          onChangeText={v => onChange('description', v)}
          error={errors.description}
          multiline
          numberOfLines={4}
          height={120}
          isRequired
          ref={refs.description}
        />

        <View style={styles.rowFields}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField variant='light'
              label="Year Est."
              placeholder="2018"
              value={data.yearEstablished}
              onChangeText={v => onChange('yearEstablished', v)}
              keyboardType="numeric"
              maxLength={4}
              ref={refs.year}
              returnKeyType="next"
              onSubmitEditing={() => refs.employees.current?.focus()}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputField variant='light'
              label="Employees"
              placeholder="e.g. 5-10"
              value={data.employees}
              onChangeText={v => onChange('employees', v)}
              ref={refs.employees}
              returnKeyType="done"
            />
          </View>
        </View>
      </AnimatedFadeIn>
    </View>
  );
};

const StepContact = ({ data, onChange, errors, refs }) => (
  <View>
    <SectionTitle step={2} title="Contact & Location" subtitle="How can customers find and reach you?" />

    <AnimatedFadeIn duration={500}>
      <InputField variant='light'
        label="Primary Phone"
        placeholder="+91 9876543210"
        value={data.phone}
        onChangeText={v => onChange('phone', v)}
        error={errors.phone}
        icon="call-outline"
        keyboardType="phone-pad"
        isRequired
        ref={refs.phone}
        returnKeyType="next"
        onSubmitEditing={() => refs.phone2.current?.focus()}
      />

      <InputField variant='light'
        label="Alternate Phone"
        placeholder="+91 9876543210 (optional)"
        value={data.phone2}
        onChangeText={v => onChange('phone2', v)}
        icon="call-outline"
        keyboardType="phone-pad"
        ref={refs.phone2}
        returnKeyType="next"
        onSubmitEditing={() => refs.email.current?.focus()}
      />

      <InputField variant='light'
        label="Email Address"
        placeholder="business@email.com"
        value={data.email}
        onChangeText={v => onChange('email', v)}
        error={errors.email}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        ref={refs.email}
        returnKeyType="next"
        onSubmitEditing={() => refs.website.current?.focus()}
      />

      <InputField variant='light'
        label="Website"
        placeholder="https://yourwebsite.com"
        value={data.website}
        onChangeText={v => onChange('website', v)}
        icon="globe-outline"
        keyboardType="url"
        autoCapitalize="none"
        ref={refs.website}
        returnKeyType="next"
        onSubmitEditing={() => refs.address.current?.focus()}
      />

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>OFFICE / SHOP ADDRESS</Text>
      </View>

      <InputField variant='light'
        label="Street Address"
        placeholder="House/Flat No., Street Name"
        value={data.address}
        onChangeText={v => onChange('address', v)}
        error={errors.address}
        icon="location-outline"
        isRequired
        ref={refs.address}
        returnKeyType="next"
        onSubmitEditing={() => refs.city.current?.focus()}
      />

      <View style={styles.rowFields}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <InputField variant='light'
            label="City"
            placeholder="City"
            value={data.city}
            onChangeText={v => onChange('city', v)}
            error={errors.city}
            isRequired
            ref={refs.city}
            returnKeyType="next"
            onSubmitEditing={() => refs.state.current?.focus()}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <InputField variant='light'
            label="State"
            placeholder="State"
            value={data.state}
            onChangeText={v => onChange('state', v)}
            ref={refs.state}
            returnKeyType="next"
            onSubmitEditing={() => refs.pinCode.current?.focus()}
          />
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <InputField variant='light'
            label="PIN Code"
            placeholder="e.g. 416001"
            value={data.pinCode}
            onChangeText={v => onChange('pinCode', v)}
            error={errors.pinCode}
            keyboardType="numeric"
            maxLength={6}
            ref={refs.pinCode}
            returnKeyType="next"
            onSubmitEditing={() => refs.landmark.current?.focus()}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <InputField variant='light'
            label="Landmark"
            placeholder="Landmark"
            value={data.landmark}
            onChangeText={v => onChange('landmark', v)}
            ref={refs.landmark}
            returnKeyType="next"
            onSubmitEditing={() => refs.instagram.current?.focus()}
          />
        </View>
      </View>

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>SOCIAL PROFILES</Text>
      </View>

      <InputField variant='light'
        label="Instagram"
        placeholder="@yourhandle"
        value={data.instagram}
        onChangeText={v => onChange('instagram', v)}
        icon="logo-instagram"
        autoCapitalize="none"
        ref={refs.instagram}
        returnKeyType="next"
        onSubmitEditing={() => refs.facebook.current?.focus()}
      />

      <InputField variant='light'
        label="Facebook"
        placeholder="facebook.com/yourpage"
        value={data.facebook}
        onChangeText={v => onChange('facebook', v)}
        icon="logo-facebook"
        autoCapitalize="none"
        ref={refs.facebook}
        returnKeyType="done"
      />
    </AnimatedFadeIn>
  </View>
);

const StepOperations = ({ data, onChange, refs, images, setImages }) => {
  const toggleDay = (day) => {
    Haptics.selectionAsync();
    const current = data.workingDays || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    onChange('workingDays', updated);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'We need camera roll permissions to add photos.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images || ImagePicker.MediaType.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(a => a.uri)]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <View>
      <SectionTitle step={3} title="Operations & Details" subtitle="Help customers know when and how you work." />

      <AnimatedFadeIn duration={500}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Gallery / Portfolio</Text>
          <Text style={styles.subLabel}>Showcase your shop, previous work, and products</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImages}>
              <LinearGradient colors={['#F1F5F9', '#E2E8F0']} style={styles.photoGradient}>
                <Ionicons name="camera" size={32} color={colors.primary} />
                <Text style={styles.addPhotoText}>Add Photos</Text>
              </LinearGradient>
            </TouchableOpacity>

            {images.map((img, idx) => (
              <View key={idx} style={styles.photoWrapper}>
                 <Image source={{ uri: img }} style={styles.photoPreview} />
                 <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removeImage(idx)}>
                   <Ionicons name="close-circle" size={24} color="#EF4444" />
                 </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Working Days</Text>
          <View style={styles.daysRow}>
            {DAYS.map(day => {
              const active = (data.workingDays || []).includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.7}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField variant='light'
              label="Opens At"
              placeholder="09:00 AM"
              value={data.openTime}
              onChangeText={v => onChange('openTime', v)}
              icon="time-outline"
              ref={refs.openTime}
              returnKeyType="next"
              onSubmitEditing={() => refs.closeTime.current?.focus()}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputField variant='light'
              label="Closes At"
              placeholder="08:00 PM"
              value={data.closeTime}
              onChangeText={v => onChange('closeTime', v)}
              icon="time-outline"
              ref={refs.closeTime}
              returnKeyType="next"
              onSubmitEditing={() => refs.services.current?.focus()}
            />
          </View>
        </View>

        <InputField variant='light'
          label="Services Offered"
          placeholder="e.g. Pipe Repair, AC Install"
          value={data.services}
          onChangeText={v => onChange('services', v)}
          icon="list-outline"
          ref={refs.services}
          returnKeyType="next"
          onSubmitEditing={() => refs.serviceAreas.current?.focus()}
        />

        <InputField variant='light'
          label="Service Areas"
          placeholder="e.g. Sangli, Miraj"
          value={data.serviceAreas}
          onChangeText={v => onChange('serviceAreas', v)}
          icon="map-outline"
          ref={refs.serviceAreas}
          returnKeyType="next"
          onSubmitEditing={() => refs.gst.current?.focus()}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price Range</Text>
          <View style={styles.priceRangeRow}>
            {['Budget', 'Moderate', 'Premium', 'Luxury'].map(tier => (
              <TouchableOpacity
                key={tier}
                activeOpacity={0.7}
                style={[styles.tierChip, data.priceRange === tier && styles.tierChipActive]}
                onPress={() => onChange('priceRange', tier)}
              >
                <Text style={[styles.tierChipText, data.priceRange === tier && styles.tierChipTextActive]}>{tier}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionDividerText}>LEGAL & AMENITIES</Text>
        </View>

        <InputField variant='light'
          label="GST Number"
          placeholder="GSTIN"
          value={data.gst}
          onChangeText={v => onChange('gst', v.toUpperCase())}
          icon="document-text-outline"
          ref={refs.gst}
          returnKeyType="next"
          onSubmitEditing={() => refs.licenseNo.current?.focus()}
        />

        <InputField variant='light'
          label="License No."
          placeholder="Business License"
          value={data.licenseNo}
          onChangeText={v => onChange('licenseNo', v)}
          icon="ribbon-outline"
          ref={refs.licenseNo}
          returnKeyType="done"
        />

        <View style={{ marginTop: 10 }}>
          {[
            { key: 'homeVisit', label: 'Home Visits Available', icon: 'home-outline' },
            { key: 'certified', label: 'Certified Business', icon: 'shield-checkmark-outline' },
            { key: 'freeQuote', label: 'Free Quotes Offered', icon: 'document-text-outline' },
          ].map(item => (
            <View key={item.key} style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Ionicons name={item.icon} size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={styles.toggleLabel}>{item.label}</Text>
              </View>
              <Switch
                value={!!data[item.key]}
                onValueChange={v => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onChange(item.key, v);
                }}
                trackColor={{ false: '#E2E8F0', true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>
      </AnimatedFadeIn>
    </View>
  );
};

const StepPackage = ({ selectedPkg, onSelect }) => (
  <View>
    <SectionTitle step={4} title="Choose a Plan" subtitle="Select the best plan for your growth." />
    <AnimatedFadeIn duration={600}>
      {PACKAGES.map(pkg => {
        const active = selectedPkg === pkg.id;
        return (
          <TouchableOpacity
            key={pkg.id}
            style={[styles.pkgCard, active && { borderColor: pkg.color, borderWidth: 2 }]}
            onPress={() => onSelect(pkg.id)}
            activeOpacity={0.8}
          >
            <View style={styles.pkgHeader}>
              <View style={[styles.pkgColorDot, { backgroundColor: pkg.color }]} />
              <Text style={styles.pkgName}>{pkg.name}</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.pkgPrice}>{pkg.price}</Text>
            </View>
            <View style={styles.pkgFeatures}>
              {pkg.features.map((f, i) => (
                <View key={i} style={styles.pkgFeatureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={active ? pkg.color : '#10B981'} />
                  <Text style={styles.pkgFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </AnimatedFadeIn>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const AddBusinessScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { business = null } = route.params || {};
  const isEdit = !!business;

  const [step, setStep] = useState(1);
  const [data, setData] = useState(isEdit ? { ...INITIAL_DATA, ...business } : INITIAL_DATA);
  const [images, setImages] = useState(business?.images || []);
  const [selectedPkg, setSelectedPkg] = useState(business?.package || 'free');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const refs = {
    name: useRef(), tagline: useRef(), subCategory: useRef(), description: useRef(),
    year: useRef(), employees: useRef(),
    phone: useRef(), phone2: useRef(), email: useRef(), website: useRef(),
    address: useRef(), city: useRef(), state: useRef(), pinCode: useRef(), landmark: useRef(),
    instagram: useRef(), facebook: useRef(),
    openTime: useRef(), closeTime: useRef(), services: useRef(), serviceAreas: useRef(),
    gst: useRef(), licenseNo: useRef(),
  };

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateStep = () => {
    const newErrors = {};
      if (step === 1) {
      if (!data.name?.trim()) newErrors.name = 'Name is required';
      if (!data.category) newErrors.category = 'Category is required';
      if (!data.description?.trim()) newErrors.description = 'Description is required';
      if (!data.profileImage) newErrors.profileImage = 'Profile Photo is required for listing';
    }
    if (step === 2) {
      if (!data.phone?.trim()) newErrors.phone = 'Phone is required';
      if (!data.address?.trim()) newErrors.address = 'Address is required';
      if (!data.city?.trim()) newErrors.city = 'City is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'info', text1: 'Required Fields', text2: 'Please fill all mandatory fields.' });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // If Other category, propose it to admin
      if (data.category === 'Other' && data.customCategory) {
        await categoryService.suggestCategory(data.customCategory);
      }

      // If Other category, use the custom proposed category as subCategory for now
      // and keep category as 'Other' (or send it to backend as special flag)
      // Sequential Images: profileImage is main, gallery is additional
      const payload = { 
        ...data, 
        categoryName: data.category, // Backend expects categoryName for resolution
        package: selectedPkg,
        image_url: data.profileImage, // Main Profile Photo
        images: images,               // Gallery / Portfolio
        subcategory: data.category === 'Other' ? data.customCategory : data.subCategory
      };

      if (isEdit) await businessOwnerService.updateBusiness(business.id, payload);
      else await businessOwnerService.addBusiness(payload);

      Toast.show({ type: 'success', text1: isEdit ? 'Business Updated' : 'Business Published!' });
      navigation.goBack();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed', text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBasicInfo data={data} onChange={onChange} errors={errors} refs={refs} />;
      case 2: return <StepContact data={data} onChange={onChange} errors={errors} refs={refs} />;
      case 3: return <StepOperations data={data} onChange={onChange} refs={refs} images={images} setImages={setImages} />;
      case 4: return <StepPackage selectedPkg={selectedPkg} onSelect={setSelectedPkg} />;
      default: return null;
    }
  };

  const STEP_TITLES = ['Core Info', 'Contact', 'Operations', 'Plan'];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={step > 1 ? back : () => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.headerTitle}>{isEdit ? 'Edit Business' : 'Add Business'}</Text>
            <Text style={styles.headerSub}>{STEP_TITLES[step-1]}</Text>
          </View>
          <View style={styles.stepIndicator}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={StyleSheet.absoluteFill} borderRadius={12} />
            <Text style={styles.stepIndicatorText}>{step}/{TOTAL_STEPS}</Text>
          </View>
        </View>

        <ProgressBar step={step} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.glassCard}>{renderStep()}</View>
          </ScrollView>

          {/* Fixed Footer above Keyboard */}
          <View style={styles.footer}>
            <View style={styles.footerInner}>
              {step > 1 && (
                <TouchableOpacity style={styles.backFooterBtn} onPress={back}>
                  <Ionicons name="chevron-back" size={20} color="#64748B" />
                  <Text style={styles.backFooterText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.nextBtn} onPress={step < TOTAL_STEPS ? next : handleSubmit} disabled={submitting}>
                <LinearGradient colors={step < 4 ? [colors.primary, colors.primary] : ['#F59E0B', '#D97706']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.gradientBtn}>
                  {submitting ? <ActivityIndicator color="#FFF" /> : (
                    <>
                      <Text style={styles.nextBtnText}>
                        {step < TOTAL_STEPS ? 'Next Step' : 'Launch Listing'}
                      </Text>
                      <Ionicons name={step < TOTAL_STEPS ? 'arrow-forward' : 'rocket'} size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSub: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },
  stepIndicator: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  stepIndicatorText: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  progressContainer: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 14, gap: 10, alignItems: 'center' },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: '#64748B', marginLeft: 8, fontWeight: '900', textTransform: 'uppercase' },

  scrollContent: { padding: 20, paddingBottom: 120 },
  glassCard: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },

  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '800', color: '#475569', marginBottom: 10, marginLeft: 4 },
  premiumInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 18, borderWidth: 1.5, borderColor: '#F1F5F9', paddingHorizontal: 16, height: 58 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6, fontWeight: '700' },
  inputError: { borderColor: '#EF4444' },

  dropdown: { backgroundColor: '#FFF', borderRadius: 24, marginTop: 10, padding: 6, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.12, shadowRadius: 30, elevation: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16 },
  dropdownItemActive: { backgroundColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 15, color: '#475569', fontWeight: '600' },

  rowFields: { flexDirection: 'row', gap: 16 },
  sectionDivider: { marginTop: 28, marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#F1F5F9', position: 'relative' },
  sectionDividerText: { position: 'absolute', top: -10, left: 10, backgroundColor: '#FFF', paddingHorizontal: 10, fontSize: 11, color: colors.primary, fontWeight: '900', letterSpacing: 1 },

  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dayChip: { width: 80, alignItems: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9' },
  dayChipActive: { backgroundColor: `${colors.primary}10`, borderColor: colors.primary },
  dayChipText: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
  dayChipTextActive: { color: colors.primary },

  priceRangeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tierChip: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9' },
  tierChipActive: { backgroundColor: `${colors.primary}10`, borderColor: colors.primary },
  tierChipText: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
  tierChipTextActive: { color: colors.primary },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center' },
  toggleLabel: { fontSize: 15, color: '#475569', fontWeight: '700' },

  pkgCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  pkgHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pkgColorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  pkgName: { fontSize: 20, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  pkgPrice: { fontSize: 18, fontWeight: '900', color: '#64748B' },
  pkgFeatures: { gap: 12 },
  pkgFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pkgFeatureText: { fontSize: 14, color: '#64748B', fontWeight: '600' },

  footer: { paddingHorizontal: 24, paddingBottom: 20, backgroundColor: 'transparent' },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backFooterBtn: { flexDirection: 'row', alignItems: 'center', height: 60, paddingHorizontal: 10 },
  backFooterText: { fontSize: 16, color: '#64748B', fontWeight: '800', marginLeft: 4 },
  nextBtn: { flex: 1, borderRadius: 20, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, gap: 10 },
  nextBtnText: { fontSize: 18, fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Photo Styles
  subLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 16, marginLeft: 4, fontWeight: '600' },
  photoList: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  addPhotoBtn: { width: 120, height: 120, borderRadius: 20, overflow: 'hidden', marginRight: 12 },
  photoGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 20 },
  addPhotoText: { fontSize: 11, fontWeight: '800', color: colors.primary, marginTop: 8, textTransform: 'uppercase' },
  photoWrapper: { position: 'relative', width: 120, height: 120, marginRight: 12 },
  photoPreview: { width: '100%', height: '100%', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  removePhotoBtn: { position: 'absolute', top: -10, right: -10, backgroundColor: '#FFF', borderRadius: 12, elevation: 5 },

  // New Profile Picker Styles
  profilePicker: {
    height: 200,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profilePickerPlaceholder: {
    alignItems: 'center',
  },
  profilePickerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 12,
  },
  profilePickerEdit: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
});

export default AddBusinessScreen;
