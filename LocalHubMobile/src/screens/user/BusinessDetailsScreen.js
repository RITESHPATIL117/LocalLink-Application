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

const BusinessDetailsScreen = ({ route, navigation }) => {
  const business = route.params?.business || {
    name: 'SuperFast Plumbing',
    category: 'Home Services',
    rating: '4.9',
    reviewsCount: 230,
    address: 'Sangli, Maharashtra',
    image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18', // Plumber cover
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Plumber avatar
    tier: 'Diamond',
  };

  const [activeTab, setActiveTab] = useState('Services');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header Cover Image */}
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: business.image }} style={styles.headerImage} />
          
          <TouchableOpacity 
            style={styles.backButtonOverlay} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <BlurView intensity={60} tint="dark" style={styles.glassCircle}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionsOverlay}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <BlurView intensity={60} tint="dark" style={styles.glassCircle}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFF" />
            </BlurView>
          </TouchableOpacity>
        </View>

        <AnimatedFadeIn 
          duration={600}
          yOffset={40}
          style={styles.contentContainer}
        >
          {/* Avatar overlapping cover */}
          <View style={styles.avatarRow}>
            <Image source={{ uri: business.avatar || business.image }} style={styles.avatarPill} />
            <View style={styles.titleArea}>
              <Text style={styles.businessName}>{business.name}</Text>
              {business.tier && (
                <Badge tier={business.tier} style={{ marginTop: 6 }} />
              )}
            </View>
          </View>

          {/* Rating & Location */}
          <View style={styles.infoSection}>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <Ionicons key={i} name="star" size={16} color={colors.star} />
              ))}
              <Text style={styles.ratingText}> {business.rating} <Text style={styles.reviewCount}>({business.reviewsCount} Reviews)</Text></Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.locationText}>{business.address}</Text>
            </View>
          </View>

          {/* Dual Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <Ionicons name="call" size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <Ionicons name="document-text" size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Request Quote</Text>
            </TouchableOpacity>
          </View>

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
            {activeTab === 'Services' && (
              <View>
                <Text style={styles.sectionTitle}>Services</Text>
                {mockServices.map((service, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}

                {/* Map Area */}
                <View style={styles.mapContainer}>
                  <Image 
                    source={{ uri: 'https://cdn.dribbble.com/users/1505378/screenshots/3642194/map.jpg' }}
                    style={styles.mapImage}
                  />
                  <View style={styles.mapPinOverlay}>
                    <Ionicons name="location-sharp" size={36} color="#EA4335" />
                  </View>
                </View>

                {/* Reviews Preview in Services Tab (as per mockup) */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Customer Reviews</Text>
                {dummyReviews.map(review => (
                  <View key={review.id} style={styles.cardReview}>
                    <View style={styles.cardReviewLeft}>
                      <View style={styles.cardAvatar}>
                         <Text style={{fontWeight: 'bold', color: '#FFF'}}>{review.user[0]}</Text>
                      </View>
                      <View>
                        <Text style={styles.cardReviewName}>{review.user}</Text>
                        <Text style={styles.cardReviewText}>{review.text}</Text>
                      </View>
                    </View>
                    <View style={styles.cardReviewRight}>
                      <Text style={styles.cardReviewRating}>{review.rating} <Ionicons name="star" size={12} color={colors.star} /></Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab !== 'Services' && (
              <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
                Content for {activeTab} goes here.
              </Text>
            )}
          </View>

          <View style={{ height: 60 }} />
        </AnimatedFadeIn>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImageContainer: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionsOverlay: {
    position: 'absolute',
    top: 50,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: -30,
    marginBottom: 10,
  },
  avatarPill: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: '#EEE',
    marginRight: 16,
  },
  titleArea: {
    flex: 1,
    paddingBottom: 4,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  diamondBadge: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabBtn: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabContentArea: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
    marginRight: 10,
    marginTop: 2,
  },
  serviceText: {
    fontSize: 15,
    color: colors.text,
  },
  mapContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    position: 'absolute',
    top: '40%',
    left: '46%',
  },
  cardReview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardReviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardReviewName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  cardReviewText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardReviewRight: {
    justifyContent: 'flex-start',
  },
  cardReviewRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.star,
  },
});

export default BusinessDetailsScreen;
