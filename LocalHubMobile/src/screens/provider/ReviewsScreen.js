import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import reviewService from '../../services/reviewService';

const ReviewsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const renderReview = ({ item, index }) => (
    <AnimatedFadeIn duration={400} delay={index * 100}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.customer.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.serviceName}>{item.service}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <View style={styles.ratingRow}>
          {renderStars(item.rating)}
        </View>

        {item.comment ? <Text style={styles.commentText}>{item.comment}</Text> : null}

        {item.reply ? (
          <View style={styles.replyBox}>
            <Text style={styles.replyLabel}>Your Reply:</Text>
            <Text style={styles.replyText}>{item.reply}</Text>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.replyBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
              <Text style={styles.replyBtnText}>Reply Privately</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.replyBtnPublic}>
              <Text style={styles.replyBtnPublicText}>Post Public Reply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Reviews</Text>
        {reviews.length > 0 && (
          <View style={styles.ratingOverview}>
            <Ionicons name="star" size={20} color="#F59E0B" />
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  avgRatingText: { color: '#B45309', fontWeight: '800', fontSize: 18, marginLeft: 6 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8 },
  activeTabBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  activeTabText: { color: '#FFF' },
  filterCountBadge: { backgroundColor: '#FFF', minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 6, paddingHorizontal: 6 },
  filterCountText: { fontSize: 11, color: colors.primary, fontWeight: '900' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 20, paddingBottom: 80 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#64748B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: `${colors.primary}30` },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.primary },
  headerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  serviceName: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  dateText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', marginBottom: 12 },
  commentText: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 16 },
  replyBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: colors.primary },
  replyLabel: { fontSize: 12, fontWeight: '800', color: colors.primary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  replyText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  actionRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16, marginTop: 4 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', paddingVertical: 10 },
  replyBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary, marginLeft: 8 },
  replyBtnPublic: { flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  replyBtnPublicText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -60 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
  emptyDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
});

export default ReviewsScreen;
