import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import colors from '../../styles/colors';
import Badge from '../../components/Badge';

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

import { useWindowDimensions, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Cover Section */}
        <View style={[styles.coverSection, isLargeScreen && styles.coverSectionWeb]}>
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: business.image }} style={styles.headerImage} />
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
          </View>

          <View style={[styles.mainInfoContainer, isLargeScreen && styles.mainInfoWeb]}>
            <View style={styles.avatarRow}>
              <Image source={{ uri: business.avatar || business.image }} style={styles.avatarPill} />
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
              <TouchableOpacity style={styles.primaryBtn}>
                <Ionicons name="call" size={20} color="#FFF" />
                <Text style={styles.primaryBtnText}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
                <Text style={styles.secondaryBtnText}>Chat</Text>
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
                      We provide high-quality {business.category.toLowerCase()} services in {business.address}. 
                      Our team of professionals is dedicated to ensuring customer satisfaction with every job.
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
                   {dummyReviews.map(review => (
                     <View key={review.id} style={styles.cardReview}>
                        <View style={styles.reviewHeader}>
                          <Image source={{ uri: `https://ui-avatars.com/api/?name=${review.user}` }} style={styles.reviewAvatar} />
                          <View>
                            <Text style={styles.reviewUserName}>{review.user}</Text>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                          </View>
                          <View style={styles.reviewRating}>
                            <Text style={styles.ratingNum}>{review.rating}</Text>
                            <Ionicons name="star" size={14} color={colors.star} />
                          </View>
                        </View>
                        <Text style={styles.reviewText}>{review.text}</Text>
                     </View>
                   ))}
                 </View>
               )}
            </AnimatedFadeIn>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
});

export default BusinessDetailsScreen;
