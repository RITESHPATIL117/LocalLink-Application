import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../../components/SkeletonLoader';

const ApprovalsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const toList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.businesses)) return payload.businesses;
    if (Array.isArray(payload.pending)) return payload.pending;
    return [];
  };

  const toNumLike = (v) => {
    if (v == null) return null;
    if (typeof v === 'boolean') return v ? 1 : 0;
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
    const s = String(v).toLowerCase().trim();
    if (s === 'true' || s === 'yes') return 1;
    if (s === 'false' || s === 'no') return 0;
    return null;
  };

  const isPendingBusiness = (biz) => {
    const verified =
      biz?.is_verified ??
      biz?.isVerified ??
      biz?.verified ??
      biz?.isApproved ??
      biz?.approvalStatus;
    const status = String(biz?.status || '').toLowerCase();
    const verifyNum = toNumLike(verified);
    if (verifyNum != null) {
      return verifyNum === 0;
    }
    if (String(verified || '').toLowerCase() === 'pending') return true;
    if (String(verified || '').toLowerCase() === 'approved') return false;
    if (String(verified || '').toLowerCase() === 'rejected') return false;

    // Fallback to status when verification fields are absent
    if (status) {
      if (status === 'pending' || status === 'new') return true;
      if (status === 'active' || status === 'approved' || status === 'suspended' || status === 'rejected') return false;
    }

    // Last fallback: treat unknown/unset rows as pending review.
    return true;
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingBusinesses();
      const fromPendingEndpoint = toList(res?.data ?? res);

      if ((fromPendingEndpoint || []).length > 0) {
        setData(fromPendingEndpoint);
      } else {
        // Fallback: some backends don't populate /pending-businesses but do expose status in /businesses
        const allRes = await adminService.getAllBusinesses().catch(() => ({ data: [] }));
        const all = toList(allRes?.data ?? allRes);
        setData(all.filter(isPendingBusiness));
      }
    } catch (e) {
      console.log('Fetch pending err:', e);
      // Secondary fallback when pending endpoint errors
      try {
        const allRes = await adminService.getAllBusinesses().catch(() => ({ data: [] }));
        const all = toList(allRes?.data ?? allRes);
        const pending = all.filter(isPendingBusiness);
        setData(pending);
        if (!pending.length) {
          Toast.show({ type: 'error', text1: 'Fetch Failed', text2: 'Could not load pending approvals.' });
        }
      } catch (_e2) {
        Toast.show({ type: 'error', text1: 'Fetch Failed', text2: 'Could not load pending approvals.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPress = (biz) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedBiz(biz);
    setReviewModalVisible(true);
  };

  const handleAction = async (id, type) => {
    if (type === 'approve') {
       setIsProcessing(true);
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
       try {
         await adminService.verifyBusiness(id);
        // Keep legacy pipelines in sync where customer endpoints read status instead of verify flag.
        await adminService.updateBusinessStatus(id, 'Active').catch(() => null);
         setData(prev => prev.filter(item => item.id !== id));
         setReviewModalVisible(false);
         Toast.show({ type: 'success', text1: 'Verified', text2: 'Business is now live on LocalHub.' });
       } catch (_e) {
         Toast.show({ type: 'error', text1: 'Error', text2: 'Could not verify business.' });
       }
    } else {
      Alert.alert(
        'Reject Listing',
        'Provide feedback to the owner on why this listing was rejected?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reject', 
            style: 'destructive',
            onPress: async () => {
               setIsProcessing(true);
               try {
                 await adminService.updateBusinessStatus(id, 'Suspended');
                 setData(prev => prev.filter(item => item.id !== id));
                 setReviewModalVisible(false);
                 Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                 Toast.show({ type: 'info', text1: 'Rejected', text2: 'Provider has been notified.' });
               } catch (_e) {
                 Toast.show({ type: 'error', text1: 'Action Failed', text2: 'Could not reject listing.' });
               } finally {
                 setIsProcessing(false);
               }
            }
          }
        ]
      );
    }
    if (type === 'approve') {
      setIsProcessing(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 100} duration={600}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => handleReviewPress(item)}
      >
        <Image source={{ uri: item.image || item.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=400' }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bizName}>{item.name}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={12} color="#64748B" />
                <Text style={styles.ownerText} numberOfLines={1}>{item.owner_name || 'Service Provider'}</Text>
              </View>
            </View>
            <View style={styles.dateArea}>
              <Text style={styles.dateText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category_name || 'General'}</Text>
            </View>
            <View style={styles.viewBrief}>
              <Text style={styles.viewBriefText}>Review Details</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Listing Approvals</Text>
          <Text style={styles.headerSubtitle}>Review and verify new businesses</Text>
        </View>
        {data.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{data.length} PENDING</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ScrollView style={styles.list}>
          <SkeletonLoader width="100%" height={240} borderRadius={28} style={{ marginBottom: 20 }} />
          <SkeletonLoader width="100%" height={240} borderRadius={28} style={{ marginBottom: 20 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="checkmark-done" size={64} color="#10B981" />
              </View>
              <Text style={styles.emptyTitle}>Platform is Clean!</Text>
              <Text style={styles.emptyDesc}>All submitted listings have been processed.</Text>
            </View>
          }
        />
      )}

      {/* Review Modal */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setReviewModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
               <View>
                 <Text style={styles.modalTitle}>Review Listing</Text>
                 <Text style={styles.modalSubtitle}>Technical Verification Phase</Text>
               </View>
               <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                 <Ionicons name="close-circle" size={32} color="#94A3B8" />
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedBiz?.image || selectedBiz?.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=400' }} style={styles.modalImage} />
              
              <View style={styles.detailSection}>
                 <Text style={styles.detailLabel}>Business Name</Text>
                 <Text style={styles.detailValue}>{selectedBiz?.name}</Text>
              </View>

              <View style={styles.detailSection}>
                 <Text style={styles.detailLabel}>Provider Details</Text>
                 <Text style={styles.detailValue}>{selectedBiz?.owner_name}</Text>
                 <Text style={styles.detailSubValue}>{selectedBiz?.owner_email || 'Verified Provider'}</Text>
              </View>

              <View style={styles.detailSection}>
                 <Text style={styles.detailLabel}>Description & Services</Text>
                 <Text style={styles.detailText}>{selectedBiz?.description || 'No description provided by the owner. Please verify before approval.'}</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalRejectBtn]} 
                    onPress={() => handleAction(selectedBiz?.id, 'reject')}
                >
                  <Text style={styles.modalRejectText}>Reject Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalApproveBtn]} 
                    onPress={() => handleAction(selectedBiz?.id, 'approve')}
                >
                  {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalApproveText}>Approve & Go Live</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4 },
  countBadge: { backgroundColor: '#EF4444', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  
  list: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 28, marginBottom: 20, overflow: 'hidden', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  bizName: { fontSize: 20, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  ownerText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  dateArea: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 11, color: '#94A3B8', fontWeight: '800' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 16 },
  categoryBadge: { backgroundColor: `${colors.primary}10`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  categoryText: { fontSize: 11, fontWeight: '900', color: colors.primary, textTransform: 'uppercase' },
  viewBrief: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewBriefText: { fontSize: 13, fontWeight: '800', color: colors.primary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 30, height: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 28, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  modalSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 4 },
  modalImage: { width: '100%', height: 180, borderRadius: 24, marginBottom: 24 },
  detailSection: { marginBottom: 24 },
  detailLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  detailValue: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  detailSubValue: { fontSize: 14, color: '#64748B', marginTop: 2, fontWeight: '600' },
  detailText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' },
  
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12, paddingBottom: 20 },
  modalBtn: { flex: 1, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  modalRejectBtn: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FEE2E2' },
  modalApproveBtn: { backgroundColor: '#10B981', shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  modalRejectText: { color: '#EF4444', fontWeight: '900', fontSize: 14 },
  modalApproveText: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  emptyDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 }
});

export default ApprovalsScreen;
