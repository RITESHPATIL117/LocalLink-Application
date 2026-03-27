import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  Image, Modal, Pressable, Animated, useWindowDimensions, Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import leadService from '../../services/leadService';
// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Pending:   { color: '#F59E0B', bg: '#FFFBEB', icon: 'time' },
  Accepted:  { color: '#10B981', bg: '#ECFDF5', icon: 'checkmark-circle' },
  Completed: { color: '#3B82F6', bg: '#EFF6FF', icon: 'ribbon' },
  Cancelled: { color: '#EF4444', bg: '#FEF2F2', icon: 'close-circle' },
};

const FILTERS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

const PAYMENT_METHODS = [
  { id: 'upi',    label: 'UPI / GPay',     icon: 'qr-code-outline' },
  { id: 'card',   label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'cash',   label: 'Cash on Delivery',  icon: 'cash-outline' },
  { id: 'later',  label: 'Pay After Service',  icon: 'time-outline' },
];

// ─── Booking Detail Modal ─────────────────────────────────────────────────────

const BookingModal = ({ item, visible, onClose, onConfirm, onCancel }) => {
  const [step, setStep] = useState('detail'); // 'detail' | 'payment' | 'success'
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    if (!selectedPayment) {
      Toast.show({ type: 'error', text1: 'Select Payment', text2: 'Please choose a payment method first.' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API call
    setLoading(false);
    setStep('success');
    onConfirm(item.id, selectedPayment);
  };

  const reset = () => { setStep('detail'); setSelectedPayment(null); onClose(); };

  if (!item) return null;
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={reset}>
      <Pressable style={styles.modalOverlay} onPress={reset}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {step === 'detail' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Business Banner */}
              <Image source={{ uri: item.image }} style={styles.modalBanner} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.modalBannerOverlay} />
              <View style={styles.modalBannerText}>
                <Text style={styles.modalBizName}>{item.businessName}</Text>
                <View style={[styles.modalStatusBadge, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon} size={12} color={cfg.color} />
                  <Text style={[styles.modalStatusText, { color: cfg.color }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.modalBody}>
                {/* Service Details */}
                <Text style={styles.modalSectionTitle}>Service Details</Text>
                <View style={styles.detailGrid}>
                  <DetailRow icon="briefcase-outline" label="Service" value={item.service} />
                  <DetailRow icon="person-outline"   label="Provider" value={item.providerName} />
                  <DetailRow icon="calendar-outline" label="Date"     value={item.date} />
                  <DetailRow icon="time-outline"     label="Time"     value={item.time} />
                  <DetailRow icon="location-outline" label="Address"  value={item.address} />
                  <DetailRow icon="pricetag-outline" label="Price"    value={item.price} highlight />
                </View>

                {/* Request Description */}
                <Text style={styles.modalSectionTitle}>Your Request</Text>
                <View style={styles.descBox}>
                  <Text style={styles.descText}>{item.description}</Text>
                </View>

                {/* Contact Provider */}
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Linking.openURL(`tel:${item.providerPhone}`)}
                >
                  <Ionicons name="call" size={20} color="#FFF" />
                  <Text style={styles.callBtnText}>Call Provider</Text>
                </TouchableOpacity>

                {/* Actions */}
                {item.status === 'Accepted' && (
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => setStep('payment')}
                  >
                    <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
                    <Text style={styles.confirmBtnText}>Confirm Booking & Pay</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'Pending' && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { onCancel(item.id); reset(); }}>
                    <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                    <Text style={styles.cancelBtnText}>Cancel Request</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'Completed' && !item.rating && (
                  <TouchableOpacity style={styles.rateBtn} onPress={reset}>
                    <Ionicons name="star-outline" size={20} color="#F59E0B" />
                    <Text style={styles.rateBtnText}>Leave a Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}

          {step === 'payment' && (
            <View style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>Choose Payment Method</Text>
              <Text style={styles.paySubtitle}>Total: <Text style={{ color: colors.primary, fontWeight: '900' }}>{item.price}</Text></Text>

              {PAYMENT_METHODS.map(method => {
                const active = selectedPayment === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[styles.payOption, active && styles.payOptionActive]}
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <View style={[styles.payIcon, active && { backgroundColor: `${colors.primary}20` }]}>
                      <Ionicons name={method.icon} size={22} color={active ? colors.primary : '#6B7280'} />
                    </View>
                    <Text style={[styles.payLabel, active && { color: colors.primary }]}>{method.label}</Text>
                    {active && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}

              {selectedPayment === 'later' && (
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                  <Text style={styles.infoText}>Pay after the service is complete. Cash payment to the provider directly.</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.confirmBtn, { marginTop: 24 }, loading && { opacity: 0.7 }]}
                onPress={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : (
                  <>
                    <Ionicons name="shield-checkmark-outline" size={22} color="#FFF" />
                    <Text style={styles.confirmBtnText}>
                      {selectedPayment === 'later' ? 'Confirm — Pay After Service' : 'Confirm & Pay'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }} onPress={() => setStep('detail')}>
                <Text style={{ color: '#6B7280', fontWeight: '700' }}>← Go Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'success' && (
            <View style={[styles.modalBody, { alignItems: 'center', paddingVertical: 40 }]}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Booking Confirmed!</Text>
              <Text style={styles.successDesc}>
                {selectedPayment === 'later'
                  ? "Your booking is confirmed. You'll pay the provider after the service."
                  : "Your booking is confirmed. The provider has been notified."}
              </Text>
              <View style={styles.successDetail}>
                <Text style={styles.successDetailText}>📅 {item.date} at {item.time}</Text>
                <Text style={styles.successDetailText}>📍 {item.address}</Text>
                {selectedPayment === 'later' && (
                  <Text style={[styles.successDetailText, { color: '#F59E0B', fontWeight: '700' }]}>
                    💵 Pay After Service
                  </Text>
                )}
              </View>
              <TouchableOpacity style={[styles.confirmBtn, { width: '100%', marginTop: 24 }]} onPress={reset}>
                <Text style={styles.confirmBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const DetailRow = ({ icon, label, value, highlight }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIconBg}>
      <Ionicons name={icon} size={16} color={colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && { color: colors.primary, fontWeight: '900' }]}>{value}</Text>
    </View>
  </View>
);

// ─── Request Card ─────────────────────────────────────────────────────────────

const RequestCard = ({ item, onPress }) => {
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
  return (
    <AnimatedFadeIn>
      <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.88}>
        <View style={styles.cardTop}>
          <Image source={{ uri: item.image }} style={styles.bizImg} />
          <View style={styles.cardMain}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.bizName} numberOfLines={1}>{item.businessName}</Text>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={10} color={cfg.color} />
                <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.serviceText} numberOfLines={1}>{item.service}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>{item.price}</Text>
          </View>

          {item.status === 'Accepted' && (
            <View style={styles.footerBadge}>
              <Ionicons name="alert-circle" size={14} color="#F59E0B" />
              <Text style={styles.footerBadgeText}>Action Required</Text>
            </View>
          )}
          {item.status === 'Completed' && item.paymentMode && (
            <View style={[styles.footerBadge, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="card-outline" size={14} color="#3B82F6" />
              <Text style={[styles.footerBadgeText, { color: '#3B82F6' }]}>{item.paymentMode}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const RequestsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await leadService.getUserLeads();
      setRequests(res.data || []);
    } catch (e) {
      console.log('Error fetching user requests', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirm = (id, paymentMode) => {
    setRequests(prev =>
      prev.map(r => r.id === id
        ? { ...r, status: 'Completed', paymentStatus: paymentMode === 'later' ? 'Pay After Service' : 'Paid', paymentMode: PAYMENT_METHODS.find(m => m.id === paymentMode)?.label }
        : r)
    );
    Toast.show({ type: 'success', text1: 'Booking Confirmed!', text2: 'Your service has been scheduled.' });
  };

  const handleCancel = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
    Toast.show({ type: 'info', text1: 'Request Cancelled', text2: 'Your request has been cancelled.' });
  };

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? requests.length : requests.filter(r => r.status === f).length;
    return acc;
  }, {});

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
          <Ionicons name="menu" size={26} color={colors.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Requests</Text>
          <Text style={styles.headerSub}>{requests.length} total bookings</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Active', count: requests.filter(r => r.status === 'Accepted' || r.status === 'Pending').length, color: '#F59E0B' },
          { label: 'Completed', count: requests.filter(r => r.status === 'Completed').length, color: '#10B981' },
          { label: 'Cancelled', count: requests.filter(r => r.status === 'Cancelled').length, color: '#EF4444' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statCount, { color: s.color }]}>{s.count}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
              {counts[f] > 0 && (
                <View style={[styles.filterCount, active && styles.filterCountActive]}>
                  <Text style={[styles.filterCountText, active && { color: colors.primary }]}>{counts[f]}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RequestCard item={item} onPress={handleCardPress} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={72} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No Requests</Text>
            <Text style={styles.emptyDesc}>
              {filter === 'All' ? 'Book a service to see your requests here.' : `No ${filter} requests found.`}
            </Text>
          </View>
        }
      />

      {/* Booking Modal */}
      <BookingModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  menuBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827', textAlign: 'center' },
  headerSub: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', textAlign: 'center' },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },

  statsRow: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  statCard: { flex: 1, alignItems: 'center' },
  statCount: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },

  filterScroll: { backgroundColor: '#FFF', maxHeight: 56, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  filterContent: { paddingHorizontal: 16, alignItems: 'center', paddingVertical: 10, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent', gap: 6,
  },
  filterChipActive: { backgroundColor: `${colors.primary}12`, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  filterTextActive: { color: colors.primary },
  filterCount: { backgroundColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1 },
  filterCountActive: { backgroundColor: `${colors.primary}25` },
  filterCountText: { fontSize: 11, fontWeight: '800', color: '#6B7280' },

  list: { padding: 16, paddingBottom: 40, gap: 12 },

  card: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  cardTop: { flexDirection: 'row', padding: 16, gap: 14 },
  bizImg: { width: 72, height: 72, borderRadius: 16 },
  cardMain: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  bizName: { fontSize: 16, fontWeight: '800', color: '#111827', flex: 1, marginRight: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  serviceText: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 4 },
  priceRow: {},
  priceLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  priceValue: { fontSize: 16, fontWeight: '900', color: '#111827' },
  footerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  footerBadgeText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },

  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 20 },
  emptyDesc: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', marginTop: 10, lineHeight: 22 },

  // ─── Modal ───
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%' },
  modalHandle: { width: 44, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalBanner: { width: '100%', height: 180 },
  modalBannerOverlay: { ...StyleSheet.absoluteFillObject, top: 100 },
  modalBannerText: { position: 'absolute', top: 130, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  modalBizName: { fontSize: 22, fontWeight: '900', color: '#FFF', flex: 1, marginRight: 8 },
  modalStatusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4 },
  modalStatusText: { fontSize: 12, fontWeight: '800' },

  modalBody: { padding: 20 },
  modalSectionTitle: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 16, marginTop: 8 },

  detailGrid: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 4, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
  detailIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center' },
  detailLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 },

  descBox: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 16, marginBottom: 20 },
  descText: { fontSize: 15, color: '#4B5563', lineHeight: 22 },

  callBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#111827', borderRadius: 14, paddingVertical: 14, marginBottom: 12,
  },
  callBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14,
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  confirmBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },

  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 14, paddingVertical: 14, marginTop: 12,
    borderWidth: 1.5, borderColor: '#FCA5A5',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '800', color: '#EF4444' },

  rateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 14, paddingVertical: 14, marginTop: 12,
    borderWidth: 1.5, borderColor: '#FDE68A',
  },
  rateBtnText: { fontSize: 15, fontWeight: '800', color: '#F59E0B' },

  paySubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 20, fontWeight: '600' },
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB', marginBottom: 12,
  },
  payOptionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}06` },
  payIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  payLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#374151' },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: `${colors.primary}0D`, borderRadius: 14, padding: 14, marginTop: 4,
  },
  infoText: { flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 20, fontWeight: '500' },

  successIcon: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#111827', marginBottom: 12 },
  successDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successDetail: { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, gap: 10 },
  successDetailText: { fontSize: 14, color: '#374151', fontWeight: '600' },
});

export default RequestsScreen;
