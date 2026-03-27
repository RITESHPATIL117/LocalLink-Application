import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Dimensions, Switch, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';

const { width } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Home Services', 'Beauty & Wellness', 'Education & Tutoring',
  'Healthcare', 'Restaurants & Food', 'Automotive', 'Events & Entertainment',
  'IT & Tech Support', 'Construction & Repair', 'Fitness & Sports',
  'Legal & Finance', 'Retail & Shopping', 'Travel & Hospitality', 'Other',
];

const PACKAGES = [
  {
    id: 'free', name: 'Free', price: '₹0/mo', color: '#6B7280',
    features: ['Basic Profile', 'Photo Gallery', 'Max 2 Photos'],
  },
  {
    id: 'silver', name: 'Silver', price: '₹499/mo', color: '#9CA3AF',
    features: ['Verified Badge', 'Top 5 in Search', 'Lead Generation', 'Max 10 Photos'],
  },
  {
    id: 'gold', name: 'Gold', price: '₹999/mo', color: '#F59E0B',
    features: ['Gold Badge', 'Top 3 in Search', 'Premium Support', 'Analytics', 'Max 30 Photos'],
  },
  {
    id: 'diamond', name: 'Diamond', price: '₹1499/mo', color: '#3B82F6',
    features: ['Diamond Badge', '#1 in Search', 'Dedicated Manager', 'No Ads on Profile', 'Unlimited Photos'],
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TOTAL_STEPS = 4;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SectionTitle = ({ step, title, subtitle }) => (
  <View style={sectionStyles.header}>
    <View style={sectionStyles.stepBadge}>
      <Text style={sectionStyles.stepNum}>{step}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={sectionStyles.title}>{title}</Text>
      {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const sectionStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 14 },
  stepBadge: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  stepNum: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2, fontWeight: '500' },
});

const Field = ({ label, required, error, children }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}
    </Text>
    {children}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const InputBox = ({ icon, error, ...props }) => (
  <View style={[styles.inputWrapper, error && styles.inputError]}>
    {icon && <Ionicons name={icon} size={18} color="#9CA3AF" style={{ marginRight: 10 }} />}
    <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...props} />
  </View>
);

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

const StepBasicInfo = ({ data, onChange, errors }) => {
  const [showCats, setShowCats] = useState(false);

  return (
    <View>
      <SectionTitle step={1} title="Basic Information" subtitle="Tell customers who you are and what you do." />

      <Field label="Business Name" required error={errors.name}>
        <InputBox
          icon="briefcase-outline"
          placeholder="e.g. SuperFast Plumbing Services"
          value={data.name}
          onChangeText={v => onChange('name', v)}
          error={errors.name}
        />
      </Field>

      <Field label="Tagline / Short Description" error={errors.tagline}>
        <InputBox
          icon="create-outline"
          placeholder="e.g. Fast, reliable home services 24/7"
          value={data.tagline}
          onChangeText={v => onChange('tagline', v)}
        />
      </Field>

      <Field label="Category" required error={errors.category}>
        <TouchableOpacity
          style={[styles.inputWrapper, errors.category && styles.inputError]}
          onPress={() => setShowCats(!showCats)}
        >
          <Ionicons name="grid-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <Text style={[styles.input, { color: data.category ? '#111827' : '#9CA3AF' }]}>
            {data.category || 'Select a category'}
          </Text>
          <Ionicons name={showCats ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
        </TouchableOpacity>
        {showCats && (
          <View style={styles.dropdown}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.dropdownItem, data.category === cat && styles.dropdownItemActive]}
                onPress={() => { onChange('category', cat); setShowCats(false); }}
              >
                <Text style={[styles.dropdownItemText, data.category === cat && { color: colors.primary, fontWeight: '700' }]}>
                  {cat}
                </Text>
                {data.category === cat && <Ionicons name="checkmark" size={16} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Field>

      <Field label="Sub-Category / Service Type" error={errors.subCategory}>
        <InputBox
          icon="pricetag-outline"
          placeholder="e.g. Pipe Repair, AC Installation"
          value={data.subCategory}
          onChangeText={v => onChange('subCategory', v)}
        />
      </Field>

      <Field label="About Your Business" required error={errors.description}>
        <View style={[styles.inputWrapper, styles.textareaWrapper, errors.description && styles.inputError]}>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe your services, experience, what makes you unique..."
            placeholderTextColor="#9CA3AF"
            value={data.description}
            onChangeText={v => onChange('description', v)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        <Text style={styles.charCount}>{(data.description || '').length}/500</Text>
      </Field>

      <Field label="Year Established">
        <InputBox
          icon="calendar-outline"
          placeholder="e.g. 2018"
          value={data.yearEstablished}
          onChangeText={v => onChange('yearEstablished', v)}
          keyboardType="numeric"
          maxLength={4}
        />
      </Field>

      <Field label="Number of Employees">
        <InputBox
          icon="people-outline"
          placeholder="e.g. 5-10"
          value={data.employees}
          onChangeText={v => onChange('employees', v)}
        />
      </Field>
    </View>
  );
};

// ─── Step 2: Contact & Location ───────────────────────────────────────────────

const StepContact = ({ data, onChange, errors }) => (
  <View>
    <SectionTitle step={2} title="Contact & Location" subtitle="How can customers find and reach you?" />

    <Field label="Primary Phone" required error={errors.phone}>
      <InputBox
        icon="call-outline"
        placeholder="+91 9876543210"
        value={data.phone}
        onChangeText={v => onChange('phone', v)}
        keyboardType="phone-pad"
        error={errors.phone}
      />
    </Field>

    <Field label="Alternate Phone">
      <InputBox
        icon="call-outline"
        placeholder="+91 9876543210 (optional)"
        value={data.phone2}
        onChangeText={v => onChange('phone2', v)}
        keyboardType="phone-pad"
      />
    </Field>

    <Field label="Email Address" error={errors.email}>
      <InputBox
        icon="mail-outline"
        placeholder="business@email.com"
        value={data.email}
        onChangeText={v => onChange('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
    </Field>

    <Field label="Website">
      <InputBox
        icon="globe-outline"
        placeholder="https://yourwebsite.com"
        value={data.website}
        onChangeText={v => onChange('website', v)}
        keyboardType="url"
        autoCapitalize="none"
      />
    </Field>

    <View style={styles.sectionDivider}>
      <Text style={styles.sectionDividerText}>ADDRESS</Text>
    </View>

    <Field label="Street Address" required error={errors.address}>
      <InputBox
        icon="location-outline"
        placeholder="House/Flat No., Street Name"
        value={data.address}
        onChangeText={v => onChange('address', v)}
        error={errors.address}
      />
    </Field>

    <View style={styles.rowFields}>
      <Field label="City" required error={errors.city} style={{ flex: 1, marginRight: 8 }}>
        <InputBox
          placeholder="City"
          value={data.city}
          onChangeText={v => onChange('city', v)}
          error={errors.city}
        />
      </Field>
      <Field label="State" style={{ flex: 1, marginLeft: 8 }}>
        <InputBox
          placeholder="State"
          value={data.state}
          onChangeText={v => onChange('state', v)}
        />
      </Field>
    </View>

    <View style={styles.rowFields}>
      <Field label="PIN Code" error={errors.pinCode} style={{ flex: 1, marginRight: 8 }}>
        <InputBox
          placeholder="e.g. 416001"
          value={data.pinCode}
          onChangeText={v => onChange('pinCode', v)}
          keyboardType="numeric"
          maxLength={6}
          error={errors.pinCode}
        />
      </Field>
      <Field label="Area / Landmark" style={{ flex: 1, marginLeft: 8 }}>
        <InputBox
          placeholder="Landmark"
          value={data.landmark}
          onChangeText={v => onChange('landmark', v)}
        />
      </Field>
    </View>

    <View style={styles.sectionDivider}>
      <Text style={styles.sectionDividerText}>SOCIAL MEDIA</Text>
    </View>

    <Field label="Instagram">
      <InputBox
        icon="logo-instagram"
        placeholder="@yourhandle"
        value={data.instagram}
        onChangeText={v => onChange('instagram', v)}
        autoCapitalize="none"
      />
    </Field>

    <Field label="Facebook">
      <InputBox
        icon="logo-facebook"
        placeholder="facebook.com/yourpage"
        value={data.facebook}
        onChangeText={v => onChange('facebook', v)}
        autoCapitalize="none"
      />
    </Field>
  </View>
);

// ─── Step 3: Operations ───────────────────────────────────────────────────────

const StepOperations = ({ data, onChange }) => {
  const toggleDay = (day) => {
    const current = data.workingDays || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    onChange('workingDays', updated);
  };

  return (
    <View>
      <SectionTitle step={3} title="Operations & Details" subtitle="Help customers know when and how you work." />

      <Field label="Working Days">
        <View style={styles.daysRow}>
          {DAYS.map(day => {
            const active = (data.workingDays || []).includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, active && styles.dayChipActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Field>

      <View style={styles.rowFields}>
        <Field label="Opens At" style={{ flex: 1, marginRight: 8 }}>
          <InputBox
            icon="time-outline"
            placeholder="e.g. 09:00 AM"
            value={data.openTime}
            onChangeText={v => onChange('openTime', v)}
          />
        </Field>
        <Field label="Closes At" style={{ flex: 1, marginLeft: 8 }}>
          <InputBox
            icon="time-outline"
            placeholder="e.g. 08:00 PM"
            value={data.closeTime}
            onChangeText={v => onChange('closeTime', v)}
          />
        </Field>
      </View>

      <Field label="Services Offered">
        <InputBox
          icon="list-outline"
          placeholder="e.g. Pipe Repair, AC Install, Bathroom Fitting"
          value={data.services}
          onChangeText={v => onChange('services', v)}
        />
        <Text style={styles.hintText}>Separate multiple services with commas</Text>
      </Field>

      <Field label="Service Areas / Cities Covered">
        <InputBox
          icon="map-outline"
          placeholder="e.g. Sangli, Miraj, Kupwad"
          value={data.serviceAreas}
          onChangeText={v => onChange('serviceAreas', v)}
        />
      </Field>

      <Field label="Price Range">
        <View style={styles.priceRangeRow}>
          {['Budget', 'Moderate', 'Premium', 'Luxury'].map(tier => (
            <TouchableOpacity
              key={tier}
              style={[styles.tierChip, data.priceRange === tier && styles.tierChipActive]}
              onPress={() => onChange('priceRange', tier)}
            >
              <Text style={[styles.tierChipText, data.priceRange === tier && styles.tierChipTextActive]}>
                {tier}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>REGISTRATION & LEGAL</Text>
      </View>

      <Field label="GST Number">
        <InputBox
          icon="document-text-outline"
          placeholder="e.g. 27AAAPZ1234A1Z5"
          value={data.gst}
          onChangeText={v => onChange('gst', v.toUpperCase())}
          autoCapitalize="characters"
          maxLength={15}
        />
      </Field>

      <Field label="Business Registration / License No.">
        <InputBox
          icon="ribbon-outline"
          placeholder="Optional license or MSME number"
          value={data.licenseNo}
          onChangeText={v => onChange('licenseNo', v)}
        />
      </Field>

      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>AMENITIES & FEATURES</Text>
      </View>

      {[
        { key: 'homeVisit', label: 'Offers Home Visits / On-site Service', icon: 'home-outline' },
        { key: 'onlineBooking', label: 'Accepts Online Bookings', icon: 'calendar-outline' },
        { key: 'emiOption', label: 'EMI / Installment Option Available', icon: 'card-outline' },
        { key: 'freeQuote', label: 'Offers Free Quote / Consultation', icon: 'chatbubble-ellipses-outline' },
        { key: 'certified', label: 'Certified / Licensed Professional', icon: 'shield-checkmark-outline' },
      ].map(item => (
        <View key={item.key} style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <View style={styles.toggleIcon}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.toggleLabel}>{item.label}</Text>
          </View>
          <Switch
            value={!!data[item.key]}
            onValueChange={v => onChange(item.key, v)}
            trackColor={{ false: '#E5E7EB', true: `${colors.primary}50` }}
            thumbColor={data[item.key] ? colors.primary : '#9CA3AF'}
          />
        </View>
      ))}
    </View>
  );
};

// ─── Step 4: Package ──────────────────────────────────────────────────────────

const StepPackage = ({ selectedPkg, onSelect }) => (
  <View>
    <SectionTitle step={4} title="Choose a Plan" subtitle="Select the plan that best fits your business growth needs." />

    {PACKAGES.map(pkg => {
      const active = selectedPkg === pkg.id;
      return (
        <TouchableOpacity
          key={pkg.id}
          style={[styles.pkgCard, active && { borderColor: pkg.color, borderWidth: 2 }]}
          onPress={() => onSelect(pkg.id)}
          activeOpacity={0.85}
        >
          {active && (
            <LinearGradient
              colors={[`${pkg.color}18`, `${pkg.color}05`]}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
          )}
          <View style={styles.pkgHeader}>
            <View style={[styles.pkgColorDot, { backgroundColor: pkg.color }]} />
            <Text style={[styles.pkgName, active && { color: pkg.color }]}>{pkg.name}</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.pkgPrice, active && { color: pkg.color }]}>{pkg.price}</Text>
            {active && (
              <View style={[styles.pkgCheck, { backgroundColor: pkg.color }]}>
                <Ionicons name="checkmark" size={14} color="#FFF" />
              </View>
            )}
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
  </View>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ step }) => (
  <View style={styles.progressContainer}>
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <View key={i} style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            i < step ? styles.progressDone : i === step - 1 ? styles.progressActive : styles.progressPending,
          ]}
        />
      </View>
    ))}
    <Text style={styles.progressLabel}>Step {step} of {TOTAL_STEPS}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const INITIAL_DATA = {
  name: '', tagline: '', category: '', subCategory: '', description: '',
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

const AddBusinessScreen = ({ navigation, route }) => {
  const { business = null } = route.params || {};
  const isEdit = !!business;

  const [step, setStep] = useState(1);
  const [data, setData] = useState(isEdit ? { ...INITIAL_DATA, ...business } : INITIAL_DATA);
  const [selectedPkg, setSelectedPkg] = useState(business?.package || 'free');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!data.name?.trim()) newErrors.name = 'Business name is required';
      else if (data.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
      if (!data.category) newErrors.category = 'Please select a category';
      if (!data.description?.trim()) newErrors.description = 'Please describe your business';
      else if (data.description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    }

    if (step === 2) {
      if (!data.phone?.trim()) newErrors.phone = 'Phone number is required';
      else if (data.phone.replace(/\s/g, '').length < 10) newErrors.phone = 'Enter a valid 10-digit phone number';
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Enter a valid email';
      if (!data.address?.trim()) newErrors.address = 'Address is required';
      if (!data.city?.trim()) newErrors.city = 'City is required';
      if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) newErrors.pinCode = 'Enter a valid 6-digit PIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...data, package: selectedPkg };
      console.log('Submitting business:', payload.name);
      
      let result;
      if (isEdit) {
        result = await businessOwnerService.updateBusiness(business.id, payload);
      } else {
        result = await businessOwnerService.addBusiness(payload);
      }

      if (result && result.data) {
        Toast.show({
          type: 'success',
          text1: isEdit ? '✅ Listing Updated' : '🎉 Listing Submitted!',
          text2: isEdit
            ? 'Your business has been updated successfully.'
            : "Your listing is now active in your dashboard.",
        });
        navigation.goBack();
      } else {
        throw new Error('Failed to save listing data');
      }
    } catch (e) {
      console.error('Submit Error:', e);
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: e.message || 'Please check your connection' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBasicInfo data={data} onChange={onChange} errors={errors} />;
      case 2: return <StepContact data={data} onChange={onChange} errors={errors} />;
      case 3: return <StepOperations data={data} onChange={onChange} />;
      case 4: return <StepPackage selectedPkg={selectedPkg} onSelect={setSelectedPkg} />;
      default: return null;
    }
  };

  const STEP_TITLES = ['Basic Info', 'Contact', 'Operations', 'Plan'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={step > 1 ? back : () => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>{isEdit ? 'Edit Listing' : 'Add New Business'}</Text>
          <Text style={styles.headerSub}>{STEP_TITLES[step - 1]}</Text>
        </View>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step}/{TOTAL_STEPS}</Text>
        </View>
      </View>

      {/* Progress */}
      <ProgressBar step={step} />

      {/* Content */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backFooterBtn} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="#6B7280" />
            <Text style={styles.backFooterText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, step < 4 && { backgroundColor: '#111827' }, submitting && { opacity: 0.7 }]}
          onPress={step < TOTAL_STEPS ? next : handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {step < TOTAL_STEPS ? 'Continue' : isEdit ? 'Save Changes' : 'Submit for Review'}
              </Text>
              <Ionicons name={step < TOTAL_STEPS ? 'arrow-forward' : 'checkmark-circle'} size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 6, borderRadius: 10, backgroundColor: '#F3F4F6' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 1 },
  stepIndicator: { backgroundColor: `${colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  stepText: { fontSize: 13, fontWeight: '800', color: colors.primary },

  progressContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', alignItems: 'center', gap: 6 },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#F3F4F6', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressDone: { backgroundColor: colors.primary, width: '100%' },
  progressActive: { backgroundColor: colors.primary, width: '60%' },
  progressPending: { backgroundColor: '#E5E7EB', width: '100%' },
  progressLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginLeft: 4 },

  scrollContent: { padding: 20, paddingBottom: 40 },

  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: 0.2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  input: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  inputError: { borderColor: '#EF4444', borderWidth: 1.5 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 5, fontWeight: '600', marginLeft: 2 },
  textareaWrapper: { height: 'auto', paddingVertical: 12, alignItems: 'flex-start' },
  textarea: { minHeight: 100, lineHeight: 22 },
  charCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 4, fontWeight: '600' },
  hintText: { fontSize: 12, color: '#9CA3AF', marginTop: 5, fontWeight: '500' },

  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropdownItemActive: { backgroundColor: `${colors.primary}08` },
  dropdownItemText: { fontSize: 14, color: '#374151', fontWeight: '500' },

  sectionDivider: { marginTop: 8, marginBottom: 20 },
  sectionDividerText: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.5 },

  rowFields: { flexDirection: 'row', gap: 12 },

  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  dayChipActive: { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
  dayChipText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  dayChipTextActive: { color: colors.primary },

  priceRangeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tierChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  tierChipActive: { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
  tierChipText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tierChipTextActive: { color: colors.primary },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  toggleIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#374151', flex: 1 },

  pkgCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    marginBottom: 16, borderWidth: 1.5, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  pkgHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  pkgColorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  pkgName: { fontSize: 18, fontWeight: '900', color: '#111827' },
  pkgPrice: { fontSize: 16, fontWeight: '800', color: '#374151', marginRight: 8 },
  pkgCheck: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  pkgFeatures: { gap: 10 },
  pkgFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pkgFeatureText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },

  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    alignItems: 'center',
  },
  backFooterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 14,
    borderRadius: 14, backgroundColor: '#F3F4F6',
  },
  backFooterText: { fontWeight: '700', color: '#6B7280', fontSize: 15 },
  nextBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14,
    shadowColor: colors.primary, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  nextBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
});

export default AddBusinessScreen;
