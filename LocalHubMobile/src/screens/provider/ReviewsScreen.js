import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummyReviews = [
  {
    id: '1',
    customer: 'Amit Sharma',
    service: 'SuperFast Plumbing',
    rating: 5,
    date: 'Oct 12, 2026',
    comment: 'Excellent service! Fixed our leak within an hour and left everything spotless.',
    reply: null,
  },
  {
    id: '2',
    customer: 'Priya Desai',
    service: 'Precision Pipe Fixing',
    rating: 4,
    date: 'Oct 10, 2026',
    comment: 'Good work, but arrived about 15 minutes late. Otherwise perfectly fine.',
    reply: "Thank you for the feedback Priya! We'll make sure to be more punctual next time.",
  },
  {
    id: '3',
    customer: 'Rahul Verma',
    service: 'SuperFast Plumbing',
    rating: 5,
    date: 'Oct 08, 2026',
    comment: 'Very professional, knew exactly what the issue was. Highly recommend.',
    reply: null,
  }
];

const ReviewsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');

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

  const renderReview = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.customer.charAt(0)}</Text>
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

      <Text style={styles.commentText}>{item.comment}</Text>

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
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Reviews</Text>
        <View style={styles.ratingOverview}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.avgRating}>4.7</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {['All', 'Needs Reply', '5 Stars'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={dummyReviews.filter(r => 
          activeTab === 'All' ? true : 
          activeTab === 'Needs Reply' ? !r.reply : 
          r.rating === 5
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  avgRating: {
    color: '#B45309',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  activeTabBtn: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  serviceName: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  replyBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginTop: 4,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  replyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  replyBtnPublic: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  replyBtnPublicText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  }
});

export default ReviewsScreen;
