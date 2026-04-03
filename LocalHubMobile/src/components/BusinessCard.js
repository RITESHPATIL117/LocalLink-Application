import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';
import Badge from './Badge';
import AnimatedFadeIn from './AnimatedFadeIn';
import { useFavorites } from '../hooks/useFavorites';

const BusinessCard = ({ business, onPress, horizontal, grid, compact, index = 0 }) => {
  const { width } = useWindowDimensions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(business.id);
  const [isHovered, setIsHovered] = useState(false);
  const MAX_APP_WIDTH = 800; // Consistent with HomeScreen

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if(onPress) onPress();
  };

  return (
    <AnimatedFadeIn delay={index * 50} duration={400} yOffset={20}>
      <Pressable 
        style={({ pressed }) => [
          styles.card, 
          horizontal && styles.horizontalCard,
          grid && styles.gridCard,
          compact && styles.compactCard,
          business.tier === 'Diamond' && styles.diamondCard,
          isHovered && styles.cardHovered,
          pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }
        ]} 
        onPress={handlePress}
        onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
        onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: (business.image_url && business.image_url.length > 10) ? business.image_url : (business.image && business.image.length > 10) ? business.image : `https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&sig=${business.name || 'service'}` 
            }} 
            style={[
              styles.image,
              horizontal && styles.horizontalImage,
              grid && styles.gridImage,
              compact && styles.compactImage
            ]} 
          />
          {(business.is_verified || business.tier === 'Diamond') && (
            <View style={[styles.verifiedBadge, business.tier === 'Diamond' && { backgroundColor: '#F59E0B' }]}>
              <Ionicons name={business.tier === 'Diamond' ? "star" : "shield-checkmark"} size={14} color="#FFFFFF" />
              <Text style={styles.verifiedText}>{business.tier === 'Diamond' ? 'ELITE PRO' : 'VERIFIED'}</Text>
            </View>
          )}
          <BlurView intensity={80} tint="dark" style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{business.rating}</Text>
            <Ionicons name="star" size={12} color={colors.secondary} />
          </BlurView>

          <TouchableOpacity 
            style={styles.favoriteBadge}
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFavorite(business);
            }}
          >
            <BlurView intensity={isFav ? 80 : 60} tint="dark" style={styles.favoriteGlass}>
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={16} color={isFav ? "#EF4444" : "#FFF"} />
            </BlurView>
          </TouchableOpacity>
        </View>

        <View style={[styles.content, compact && styles.compactContent]}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{business.category || 'Service'}</Text>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Live Now</Text>
          </View>
          
          <Text style={[styles.name, compact && styles.compactName]} numberOfLines={1}>{business.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#9CA3AF" />
            <Text style={styles.infoText} numberOfLines={1}>{business.address}</Text>
          </View>

          {!compact && (
            <View style={styles.trustBadgesRow}>
              <View style={styles.trustBadgeSmall}>
                <Ionicons name="time-outline" size={12} color="#10B981" />
                <Text style={styles.trustBadgeText}>Instant Response</Text>
              </View>
              <View style={styles.trustBadgeSmall}>
                <Ionicons name="repeat" size={12} color="#3B82F6" />
                <Text style={styles.trustBadgeText}>98% Repeat Rate</Text>
              </View>
            </View>
          )}

          <View style={[styles.footer, compact && styles.compactFooter]}>
            <View>
              <Text style={styles.priceLabel}>Service Start</Text>
              <Text style={styles.priceValue}>₹499</Text>
            </View>
            <View style={styles.actions}>
              {!compact && (
                <TouchableOpacity style={styles.detailsBtn} onPress={handlePress}>
                  <Text style={styles.detailsBtnText}>DETAILS</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.bookBtn} 
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (business.onInquirePress) business.onInquirePress(business);
                }}
              >
                <Text style={styles.bookBtnText}>{compact ? 'BOOK' : 'BOOK NOW'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </AnimatedFadeIn>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  diamondCard: {
    borderColor: '#FDE68A',
    borderWidth: 1.5,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  cardHovered: {
    shadowOpacity: 0.12,
    shadowRadius: 40,
    transform: [{ translateY: -4 }],
  },
  gridCard: {
    marginHorizontal: 8,
    marginVertical: 8,
    flex: 1,
  },
  horizontalCard: {
    width: 200,
    marginVertical: 4,
  },
  compactCard: {
    width: 160,
    marginHorizontal: 6,
    marginVertical: 4,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#F3F4F6',
  },
  horizontalImage: {
    height: 160,
  },
  gridImage: {
    height: 180,
  },
  compactImage: {
    height: 130,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(30, 58, 138, 0.9)', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginRight: 4,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 5,
  },
  favoriteGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  compactContent: {
    padding: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  compactName: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '600',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  trustBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  compactFooter: {
    paddingTop: 8,
  },
  priceLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bookBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

});

export default React.memo(BusinessCard);
