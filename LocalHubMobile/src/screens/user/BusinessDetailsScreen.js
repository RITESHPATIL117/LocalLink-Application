import React, { useState, useEffect, useCallback } from 'react';
import { useWindowDimensions, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Platform, Linking, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import InteractiveRating from '../../components/InteractiveRating';
import colors from '../../styles/colors';
import Badge from '../../components/Badge';
import reviewService from '../../services/reviewService';
import leadService from '../../services/leadService';
import PremiumLoader from '../../components/PremiumLoader';
import BookingWizard from '../../components/BookingWizard';
import { useFavorites } from '../../hooks/useFavorites';
import Toast from 'react-native-toast-message';

const dummyReviews = [
  { id: '1', user: 'Rahul Mehta', rating: 5, date: '2 days ago', text: 'Great Service!' },
  { id: '2', user: 'Sneha Patil', rating: 4, date: '1 week ago', text: 'Fast & Reliable' },
];

const mockServices = [
  'Pipe Repair',
  'Bathroom Fitting',
  'Leakage Fitting',
  'Water Supply',
];

const BusinessDetailsScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  
  const business = route.params?.business || {
    name: 'SuperFast Plumbing',
    category: 'Home Services',
    rating: '4.9',
    reviewsCount: 230,
    address: 'Sangli, Maharashtra',
    image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    tier: 'Diamond',
  };

  const [activeTab, setActiveTab] = useState('Overview');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', message: '' });
  const [submittingLead, setSubmittingLead] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(business.id);

  const fetchReviews = useCallback(async () => {
    if (!business.id) return;
    setLoadingReviews(true);
    try {
      const res = await reviewService.getReviewsByBusiness(business.id);
      setReviews(res.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [business.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please enter a comment' });
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        business_id: business.id,
        rating: reviewRating,
        comment: reviewComment
      });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Review submitted!' });
      setReviewModalVisible(false);
      setReviewComment('');
      fetchReviews();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed', text2: 'Could not submit review' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitLead = async () => {
    if (!leadInfo.name || !leadInfo.phone) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please fill name and phone' });
      return;
    }
    setSubmittingLead(true);
    try {
      const result = await leadService.sendLead({
        business_id: business.id,
        customer_name: leadInfo.name,
        customer_phone: leadInfo.phone,
        message: leadInfo.message || `Inquiry about ${business.name}`
      });
      
      if (result.error) {
        throw new Error(result.error);
      }

      Toast.show({ type: 'success', text1: 'Lead Sent!', text2: 'The owner will contact you soon.' });
      setLeadModalVisible(false);
      setLeadInfo({ name: '', phone: '', message: '' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed', text2: 'Could not send inquiry' });
    } finally {
      setSubmittingLead(false);
    }
  };

  const businessImage = business.image_url || business.image || 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Cover Section */}
        <View style={[styles.coverSection, isLargeScreen && styles.coverSectionWeb]}>
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: businessImage }} style={styles.headerImage} />
            {!isLargeScreen && (
              <TouchableOpacity 
                style={styles.backButtonOverlay} 
                onPress={() => navigation.goBack()}
              >
                <BlurView intensity={60} tint="dark" style={styles.glassCircle}>
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </BlurView>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.favoriteBtnOverlay} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                toggleFavorite(business);
              }}
            >
              <BlurView intensity={isFav ? 80 : 60} tint={isFav ? "light" : "dark"} style={styles.glassCircle}>
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#EF4444" : "#FFF"} />
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainInfoContainer, isLargeScreen && styles.mainInfoWeb]}>
            <View style={styles.avatarRow}>
              <Image source={{ uri: business.avatar || businessImage }} style={styles.avatarPill} />
              <View style={styles.titleArea}>
                <Text style={styles.businessName}>{business.name}</Text>
                {business.tier && (
                  <Badge tier={business.tier} style={{ marginTop: 6 }} />
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.ratingRow}>
                {[1,2,3,4,5].map(i => (
                  <Ionicons key={i} name="star" size={18} color={colors.star} />
                ))}
                <Text style={styles.ratingText}> {business.rating} <Text style={styles.reviewCount}>({business.reviewsCount} Reviews)</Text></Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={18} color={colors.textSecondary} />
                <Text style={styles.locationText}>{business.address}</Text>
              </View>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setLeadModalVisible(true)}>
                <Ionicons name="calendar-outline" size={20} color="#FFF" />
                <Text style={styles.primaryBtnText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryBtn} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  Linking.openURL(`tel:+919876543210`);
                }}
              >
                <Ionicons name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.secondaryBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentBody}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {['Overview', 'Services', 'Reviews', 'Photos'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentArea}>
            <AnimatedFadeIn key={activeTab}>
               {activeTab === 'Overview' && (
                 <View style={styles.overviewContainer}>
                    <Text style={styles.sectionTitle}>About this business</Text>
                    <Text style={styles.descriptionText}>
                      {business.description || `We provide high-quality ${business.category?.toLowerCase() || 'service'} in ${business.address || 'your area'}. Our team of professionals is dedicated to ensuring customer satisfaction with every job.`}
                    </Text>
                 </View>
               )}
               {activeTab === 'Services' && (
                 <View style={styles.servicesGrid}>
                    {mockServices.map((service, index) => (
                      <View key={index} style={styles.serviceItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                 </View>
               )}
                 {activeTab === 'Reviews' && (
                   <View>
                     <TouchableOpacity 
                        style={styles.addReviewBtn} 
                        onPress={() => setReviewModalVisible(true)}
                     >
                        <Ionicons name="create-outline" size={20} color="#FFF" />
                        <Text style={styles.addReviewBtnText}>Write a Review</Text>
                     </TouchableOpacity>

                     {loadingReviews ? (
                       <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                     ) : reviews.length > 0 ? (
                      reviews.map((review, idx) => (
                        <View key={review.id || idx} style={styles.cardReview}>
                           <View style={styles.reviewHeader}>
                             <Image source={{ uri: review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}` }} style={styles.reviewAvatar} />
                             <View>
                               <Text style={styles.reviewUserName}>{review.user?.name || 'Verified User'}</Text>
                               <Text style={styles.reviewDate}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</Text>
                             </View>
                             <View style={styles.reviewRating}>
                               <Text style={styles.ratingNum}>{review.rating}</Text>
                               <Ionicons name="star" size={14} color={colors.star} />
                             </View>
                           </View>
                           <Text style={styles.reviewText}>{review.comment || review.text}</Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Ionicons name="chatbox-ellipses-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
                      </View>
                    )}
                  </View>
                )}
                {activeTab === 'Photos' && (
                  <View style={styles.photosGrid}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Image 
                        key={i} 
                        source={{ uri: `${business.image}?sig=${i}` }} 
                        style={styles.photoThumb} 
                      />
                    ))}
                  </View>
                )}
            </AnimatedFadeIn>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ─── Review Modal ─── */}
      <Modal visible={reviewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate your experience</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={styles.starsRow}>
              <InteractiveRating 
                initialRating={reviewRating} 
                onRatingSelect={setReviewRating} 
                size={36} 
                color={colors.star} 
              />
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Tell others about your experience..."
              multiline
              numberOfLines={4}
              value={reviewComment}
              onChangeText={setReviewComment}
            />
            <TouchableOpacity 
              style={[styles.primaryBtn, submittingReview && { opacity: 0.7 }]} 
              onPress={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Submit Review</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Booking Modal ─── */}
      <BookingWizard
        visible={leadModalVisible}
        onClose={() => setLeadModalVisible(false)}
        business={business}
        onSuccess={() => {
          Toast.show({
            type: 'success',
            text1: 'Booking Sent!',
            text2: 'The professional will confirm your slot soon.'
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  coverSection: { backgroundColor: '#F9FAFB' },
  coverSectionWeb: { flexDirection: 'row', padding: 40, maxWidth: 1200, alignSelf: 'center', backgroundColor: 'transparent' },
  headerImageContainer: {
    height: Platform.OS === 'web' ? 400 : 250,
    width: Platform.OS === 'web' ? '50%' : '100%',
    position: 'relative',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    overflow: 'hidden',
  },
  headerImage: { width: '100%', height: '100%' },
  mainInfoContainer: { padding: 20, marginTop: -20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  mainInfoWeb: { flex: 1, marginTop: 0, marginLeft: 40, borderTopLeftRadius: 0, borderTopRightRadius: 0, justifyContent: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: -40, marginBottom: 16 },
  avatarPill: { width: 80, height: 80, borderRadius: 20, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#EEE' },
  titleArea: { marginLeft: 16, paddingBottom: 4 },
  businessName: { fontSize: 28, fontWeight: '900', color: '#111827' },
  infoSection: { marginBottom: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 16, fontWeight: '800', color: '#111827', marginLeft: 8 },
  reviewCount: { color: '#6B7280', fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 16, color: '#4B5563', marginLeft: 8 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  secondaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#FFF', borderWidth: 2, borderColor: colors.primary, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: colors.primary, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  contentBody: { maxWidth: 1200, alignSelf: 'center', width: '100%', paddingHorizontal: 20 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: 24 },
  tabBtn: { paddingVertical: 16, marginRight: 32, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabBtn: { borderBottomColor: colors.primary },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: colors.primary, fontWeight: '800' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 12 },
  descriptionText: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceItem: { backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderHorizontal: 1, borderColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardReview: { padding: 20, backgroundColor: '#FFF', borderRadius: 20, marginBottom: 16, borderHorizontal: 1, borderColor: '#F3F4F6' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  reviewUserName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  reviewDate: { fontSize: 12, color: '#9CA3AF' },
  reviewRating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF9C3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingNum: { fontSize: 14, fontWeight: '800', color: '#854D0E', marginRight: 4 },
  reviewText: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
  glassCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  backButtonOverlay: { position: 'absolute', top: 50, left: 16 },
  favoriteBtnOverlay: { position: 'absolute', top: 50, right: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#9CA3AF', fontWeight: '600' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoThumb: { width: 100, height: 100, borderRadius: 12 }, // Used fixed size or calc inside component if needed
  
  // Review Buttons
  addReviewBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.primary, 
    marginVertical: 16, 
    paddingVertical: 12, 
    borderRadius: 12,
    gap: 8,
  },
  addReviewBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  modalSub: { fontSize: 14, color: '#6B7280', marginBottom: 20, fontWeight: '500' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 },
  reviewInput: { 
    backgroundColor: '#F9FAFB', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 15, 
    color: '#111827', 
    textAlignVertical: 'top', 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalInput: {
    backgroundColor: '#F9FAFB', 
    borderRadius: 14, 
    padding: 16, 
    fontSize: 15, 
    color: '#111827', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});

export default BusinessDetailsScreen;
