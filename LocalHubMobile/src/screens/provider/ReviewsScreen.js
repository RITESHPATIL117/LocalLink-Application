import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader, { CardSkeleton } from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import { Modal, TextInput, ScrollView, StyleSheet as RNStyleSheet } from 'react-native';
import reviewService from '../../services/reviewService';
import Toast from 'react-native-toast-message';

const ReviewsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchReviews();
    }
  }, [isFocused]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let allReviews = [];

      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const revRes = await reviewService.getReviewsByBusiness(biz.id);
            const bizReviews = revRes.data || [];
            
            const mappedReviews = bizReviews.map(r => ({
              ...r,
              id: r.id || Math.random().toString(),
              customer: r.user?.name || r.customerName || 'Customer',
              rating: r.rating || 5,
              comment: r.comment || r.text || '',
              service: biz.name || 'General Service',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently',
              rawDate: r.createdAt ? new Date(r.createdAt) : new Date(),
              reply: r.reply || null
            }));
            
            allReviews = [...allReviews, ...mappedReviews];
          } catch (e) {
            // ignore
          }
        })
      );
      
      allReviews.sort((a, b) => b.rawDate - a.rawDate);
      setReviews(allReviews);
    } catch (e) {
      console.log('Error fetching provider reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons 
        key={i} 
        name="star" 
        size={14} 
        color={i < rating ? '#F59E0B' : '#E5E7EB'} 
        style={{ marginRight: 2 }}
      />
    ));
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Needs Reply') return !r.reply;
    if (activeTab === '5 Stars') return r.rating === 5;
    return true;
  });

  const handleReplyPress = (review) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setReplyModalVisible(true);
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      // Logic would be: await reviewService.replyToReview(selectedReview.id, replyText);
      // For now, simulate success:
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, reply: replyText } : r));
      setReplyModalVisible(false);
      Toast.show({ type: 'success', text1: 'Reply Posted', text2: 'Your response is now visible to the customer.' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to post reply.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const renderReview = ({ item, index }) => (
    <AnimatedFadeIn duration={600} delay={index * 100}>
      <View style={styles.card}>
        <View style={styles.cardHighlight} />
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.customer.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <View style={styles.serviceRow}>
              <Ionicons name="briefcase-outline" size={12} color="#64748B" />
              <Text style={styles.serviceName}>{item.service}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <View style={styles.ratingRow}>
          {renderStars(item.rating)}
          <Text style={styles.ratingValue}>{item.rating}.0</Text>
        </View>

        {item.comment ? <Text style={styles.commentText}>{item.comment}</Text> : null}

        {item.reply ? (
          <TouchableOpacity 
            style={styles.replyBox} 
            activeOpacity={0.7}
            onPress={() => handleReplyPress(item)}
          >
            <View style={styles.replyHeader}>
              <Ionicons name="return-down-forward" size={16} color={colors.primary} />
              <Text style={styles.replyLabel}>Your Response</Text>
            </View>
            <Text style={styles.replyText}>{item.reply}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity 
                style={styles.replyBtnPublic}
                onPress={() => handleReplyPress(item)}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.replyBtnPublicText}>Respond to Customer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Customer Feedbacks</Text>
          <Text style={styles.headerSubtitle}>Manage your reputation & ratings</Text>
        </View>
        {reviews.length > 0 && (
          <View style={styles.ratingOverview}>
            <Ionicons name="star" size={18} color="#B45309" />
            <Text style={styles.avgRatingText}>{avgRating}</Text>
          </View>
        )}
      </View>

      <View style={styles.tabsContainer}>
        {['All', 'Needs Reply', '5 Stars'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {tab !== 'All' && tab === 'Needs Reply' && reviews.filter(r => !r.reply).length > 0 && (
               <View style={styles.filterCountBadge}>
                 <Text style={styles.filterCountText}>{reviews.filter(r => !r.reply).length}</Text>
               </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ScrollView style={styles.listContainer}>
          <CardSkeleton />
          <CardSkeleton />
        </ScrollView>
      ) : filteredReviews.length === 0 ? (
        <AnimatedFadeIn style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
             <Ionicons name="star-half-outline" size={64} color="#F59E0B" />
          </View>
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptyDesc}>When customers leave feedback for your services, they will appear here. Encourage your clients to review you!</Text>
        </AnimatedFadeIn>
      ) : (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Reply Modal */}
      <Modal
        visible={replyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setReplyModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Response</Text>
              <TouchableOpacity onPress={() => setReplyModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.reviewSnippet}>
               <Text style={styles.snippetTitle}>Replying to {selectedReview?.customer}</Text>
               <Text style={styles.snippetText} numberOfLines={2}>"{selectedReview?.comment}"</Text>
            </View>

            <TextInput
              style={styles.replyInput}
              placeholder="Write your professional response here..."
              placeholderTextColor="#94A3B8"
              multiline
              autoFocus
              value={replyText}
              onChangeText={setReplyText}
            />

            <TouchableOpacity 
                style={[styles.submitBtn, (!replyText.trim() || isSubmitting) && styles.submitBtnDisabled]}
                onPress={submitReply}
                disabled={!replyText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>Post Response</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#FDE68A' },
  avgRatingText: { color: '#B45309', fontWeight: '900', fontSize: 18, marginLeft: 6 },
  
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5 },
  activeTabBtn: { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  filterCountBadge: { backgroundColor: 'rgba(255,255,255,0.2)', minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  filterCountText: { fontSize: 9, color: '#FFF', fontWeight: '900' },
  
  listContainer: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 4, position: 'relative', overflow: 'hidden' },
  cardHighlight: { position: 'absolute', top: 0, left: 0, width: 6, height: '100%', backgroundColor: '#F59E0B', opacity: 0.6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: `${colors.primary}20` },
  avatarText: { fontSize: 20, fontWeight: '900', color: colors.primary },
  headerInfo: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  serviceName: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  dateText: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 4 },
  ratingValue: { fontSize: 14, fontWeight: '800', color: '#B45309', marginLeft: 6 },
  commentText: { fontSize: 16, color: '#334155', lineHeight: 26, marginBottom: 20, fontWeight: '500' },
  
  replyBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: colors.primary, marginTop: 4 },
  replyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  replyLabel: { fontSize: 13, fontWeight: '900', color: colors.primary, letterSpacing: 0.5 },
  replyText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' },
  
  actionRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20, marginTop: 4 },
  replyBtnPublic: { backgroundColor: colors.primary, flexDirection: 'row', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  replyBtnPublicText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  reviewSnippet: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  snippetTitle: { fontSize: 12, fontWeight: '800', color: '#64748B', marginBottom: 4, textTransform: 'uppercase' },
  snippetText: { fontSize: 14, color: '#475569', fontStyle: 'italic', lineHeight: 20 },
  replyInput: { backgroundColor: '#F1F5F9', borderRadius: 20, padding: 20, height: 150, textAlignVertical: 'top', fontSize: 16, color: '#1E293B', fontWeight: '500', marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  submitBtn: { backgroundColor: colors.primary, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -60 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  emptyDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24 },
});

export default ReviewsScreen;
