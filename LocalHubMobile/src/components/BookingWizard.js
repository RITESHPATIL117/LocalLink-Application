import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Modal, TextInput, 
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, 
  Platform, ScrollView, Pressable 
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';
import leadService from '../services/leadService';
import { setLeadCaptured, clearCredentials } from '../store/authSlice';

const SLOTS = [
  { id: 'morning', label: 'Morning', time: '09:00 AM - 12:00 PM', icon: 'sunny-outline' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 04:00 PM', icon: 'partly-sunny-outline' },
  { id: 'evening', label: 'Evening', time: '04:00 PM - 08:00 PM', icon: 'moon-outline' },
];

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI (GPay, PhonePe, etc.)', icon: 'qr-code-outline' },
  { id: 'Card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'Pay After Service', label: 'Pay After Service', icon: 'cash-outline' },
];

const BookingWizard = ({ visible, onClose, onSuccess, business, category, isRFQ }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isAuthenticated, user, temporaryLeadInfo } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1); // 1: Info, 2: Schedule, 3: Payment
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[2]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Refs for keyboard navigation
  const phoneRef = React.useRef(null);
  const messageRef = React.useRef(null);

  useEffect(() => {
    if (visible) {
      setStep(1);
      if (isAuthenticated && user) {
        setName(user.name || '');
        phoneRef.current?.focus(); // Focus phone if name is pre-filled
        setPhone(user.phone || '');
        setAddress(user.address || '');
      } else if (temporaryLeadInfo) {
        setName(temporaryLeadInfo.name || '');
        setPhone(temporaryLeadInfo.phone || '');
      }
    }
  }, [visible, isAuthenticated, user, temporaryLeadInfo]);

  const nextStep = () => {
    if (step === 1 && (!name.trim() || !phone.trim())) {
      Toast.show({ type: 'error', text1: 'Required Info', text2: 'Please provide name and phone.' });
      return;
    }

    // Skip schedule/payment for RFQ
    if (isRFQ && step === 1) {
       handleSubmit();
       return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(step + 1);
  };

  const prevStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(step - 1);
  };

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Please enable location permissions.' });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverse.length > 0) {
        const addr = reverse[0];
        const formatted = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
        setAddress(formatted);
        Toast.show({ type: 'success', text1: 'Location Found', text2: 'Address updated from GPS.' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Location Error', text2: 'Could not fetch your location.' });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Hard guard: Never allow a direct booking (non-RFQ) to proceed if not authenticated
    if (!isRFQ && !isAuthenticated) {
      dispatch(clearCredentials());
      Toast.show({ type: 'error', text1: 'Login Required', text2: 'Please log in to book this service.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        business_id: business?.id || null,
        category_id: category?.id || business?.category_id || null,
        user_id: user?.id || null,
        customer_name: name,
        customer_phone: phone,
        message: message || (isRFQ ? `RFQ broadcast for ${business?.category || 'service'}` : `Booking request for ${business?.name || 'service'}`),
        address: address,
        booking_date: selectedDate,
        booking_time: selectedSlot.label + " (" + selectedSlot.time + ")",
        payment_method: selectedPayment.id,
        payment_status: selectedPayment.id === 'Pay After Service' ? 'Pending' : 'Paid',
        amount: 499.00 // Example base price
      };

      let result;
      // CRITICAL FIX: Explicitly check if it should be an RFQ based on props or business_id null
      const effectivelyRFQ = isRFQ || !payload.business_id;

      if (effectivelyRFQ) {
        console.log(`[DEBUG] Routing to RFQ/Broadcast. Business ID: ${payload.business_id}`);
        result = await leadService.broadcastRFQ(payload);
      } else {
        console.log(`[DEBUG] Routing to Direct Lead. Business ID: ${payload.business_id}`);
        result = await leadService.sendLead(payload);
      }
      
      if (result.error) throw new Error(result.error);

      dispatch(setLeadCaptured({ name, phone }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess(result);
      onClose();

      // Navigate to Requests screen for logged-in users to see their new booking
      if (!isRFQ && isAuthenticated) {
        navigation.navigate('RequestsTab');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      const serverMessage = error.response?.data?.message || error.message;
      
      // Handle the 401 (Session Expired/Desync) specifically
      if (error.response?.status === 401 || error.message?.includes('401')) {
        dispatch(clearCredentials());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Toast.show({
          type: 'error',
          text1: 'Login Required',
          text2: 'Session expired. Please log in to complete your booking.'
        });
        // Stay on step 3, but the render guard will now switch to renderAuthRequired()
      } else {
        Toast.show({ 
          type: 'error', 
          text1: isRFQ ? 'Broadcast Failed' : 'Booking Failed', 
          text2: serverMessage || 'Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
        <Text style={styles.stepTitle}>Your Details</Text>
        <Text style={styles.stepSubtitle}>Tell us where to provide the service</Text>
        
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              ref={phoneRef}
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => messageRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="chatbox-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              ref={messageRef}
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Brief Requirements (Optional)"
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={[styles.inputWrapper, { height: 120, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Full Service Address"
                value={address}
                onChangeText={setAddress}
                multiline
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.locationSmallBtn} onPress={fetchLocation} disabled={locationLoading}>
                {locationLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Ionicons name="navigate" size={14} color={colors.primary} />
                    <Text style={styles.locationSmallText}>Use GPS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={nextStep} activeOpacity={0.88}>
          <Text style={styles.primaryBtnText}>Choose Schedule</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
        <Text style={styles.stepTitle}>Pick a Slot</Text>
        <Text style={styles.stepSubtitle}>When should the expert arrive?</Text>
        
        <Text style={styles.sectionLabel}>Select Date</Text>
        <View style={styles.dateRow}>
          {['Today', 'Tomorrow', 'Day After'].map((d, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const active = selectedDate === dateStr;
            return (
              <TouchableOpacity 
                key={d} 
                style={[styles.dateChip, active && styles.activeChip]} 
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[styles.dateLabel, active && styles.activeChipText]}>{d}</Text>
                <Text style={[styles.dateSubtext, active && styles.activeChipText]}>
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Available Slots</Text>
        {SLOTS.map(slot => {
          const active = selectedSlot.id === slot.id;
          return (
            <TouchableOpacity 
              key={slot.id} 
              style={[styles.slotCard, active && styles.activeSlotCard]} 
              onPress={() => setSelectedSlot(slot)}
            >
              <View style={[styles.slotIcon, active && { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name={slot.icon} size={24} color={active ? colors.primary : '#6B7280'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.slotLabel, active && { color: colors.primary }]}>{slot.label}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>
              {active && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footerActions}>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={prevStep} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={nextStep} activeOpacity={0.88}>
            <Text style={styles.primaryBtnText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
        <Text style={styles.stepTitle}>Checkout</Text>
        <Text style={styles.stepSubtitle}>Secure your booking now</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{business?.name || 'Selected Service'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Scheduled For</Text>
            <Text style={styles.summaryValue}>{selectedDate} at {selectedSlot.label}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10, marginTop: 5 }]}>
            <Text style={[styles.summaryLabel, { fontWeight: '900', color: '#111827' }]}>Total Amount</Text>
            <Text style={[styles.summaryValue, { fontWeight: '900', color: colors.primary, fontSize: 18 }]}>₹499</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select Payment Mode</Text>
        {PAYMENT_METHODS.map(method => {
          const active = selectedPayment.id === method.id;
          return (
            <TouchableOpacity 
              key={method.id} 
              style={[styles.payOption, active && styles.activePayOption]} 
              onPress={() => setSelectedPayment(method)}
            >
              <Ionicons name={method.icon} size={20} color={active ? colors.primary : '#6B7280'} />
              <Text style={[styles.payLabel, active && { color: colors.primary }]}>{method.label}</Text>
              {active && <Ionicons name="radio-button-on" size={20} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footerActions}>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={prevStep} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {selectedPayment.id === 'Pay After Service' ? 'Confirm Booking' : 'Pay & Book'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAuthRequired = () => (
    <View style={styles.authContainer}>
      <View style={styles.authIconCircle}>
        <Ionicons name="lock-closed" size={48} color={colors.primary} />
      </View>
      <Text style={styles.authTitle}>Login Required</Text>
      <Text style={styles.authSubtitle}>
        To ensure a secure and personalized service experience, please log in or create an account to book this service.
      </Text>
      
      <TouchableOpacity 
        style={styles.authPrimaryBtn} 
        onPress={() => {
          onClose();
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.authPrimaryBtnText}>Sign In / Register</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.authSecondaryBtn} onPress={onClose}>
        <Text style={styles.authSecondaryBtnText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View style={[styles.card, (!isRFQ && !isAuthenticated) && { height: 450 }]}>
            <View style={styles.header}>
              <View style={styles.progressRow}>
                {(isRFQ || isAuthenticated) && [1, 2, 3].map(i => (
                  <View key={i} style={[styles.dot, i <= step && { backgroundColor: colors.primary, width: 24 }]} />
                ))}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {(!isRFQ && !isAuthenticated) ? renderAuthRequired() : (
              <>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    height: 600,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  progressRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' },
  closeBtn: { padding: 4 },
  stepContainer: { flex: 1, position: 'relative' },
  stepScroll: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  stepSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16, fontWeight: '500' },
  form: { gap: 12, paddingBottom: 120 }, // Gap for absolute footer
  footerActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFF',
    paddingBottom: 4, // Extra space at bottom
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 56, fontSize: 16, color: '#111827', fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  dateRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  dateChip: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateLabel: { fontSize: 13, fontWeight: '800', color: '#111827' },
  dateSubtext: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  activeChipText: { color: '#FFF' },
  slotCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6', gap: 14 },
  activeSlotCard: { borderColor: colors.primary, backgroundColor: `${colors.primary}08` },
  slotIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  slotLabel: { fontSize: 15, fontWeight: '800', color: '#111827' },
  slotTime: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  locationSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  locationSmallText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 6,
  },
  summaryCard: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 20, gap: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  summaryValue: { fontSize: 14, color: '#111827', fontWeight: '800' },
  payOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6', gap: 12 },
  activePayOption: { borderColor: colors.primary, backgroundColor: `${colors.primary}05` },
  payLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#374151' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  primaryBtn: { flex: 2, backgroundColor: colors.primary, height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  secondaryBtn: { flex: 1, backgroundColor: '#F3F4F6', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: '#4B5563', fontSize: 16, fontWeight: '800' },
  
  // Auth Required Styles
  authContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  authIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  authTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center' },
  authSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  authPrimaryBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.primary, 
    paddingHorizontal: 28, 
    paddingVertical: 16, 
    borderRadius: 20, 
    gap: 10,
    width: '100%',
    justifyContent: 'center'
  },
  authPrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  authSecondaryBtn: { marginTop: 20, paddingVertical: 10 },
  authSecondaryBtnText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
});

export default BookingWizard;
