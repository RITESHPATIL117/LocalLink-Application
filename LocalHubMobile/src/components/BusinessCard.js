import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';
import Badge from './Badge';
import AnimatedFadeIn from './AnimatedFadeIn';

const BusinessCard = ({ business, onPress, horizontal, grid, index = 0 }) => {
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
          pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }
        ]} 
        onPress={handlePress}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: business.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400' }} 
            style={[
              styles.image,
              horizontal && styles.horizontalImage,
              grid && styles.gridImage
            ]} 
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
          <BlurView intensity={80} tint="dark" style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{business.rating}</Text>
            <Ionicons name="star" size={12} color={colors.secondary} />
          </BlurView>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{business.category || 'Service'}</Text>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Live Now</Text>
          </View>
          
          <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#9CA3AF" />
            <Text style={styles.infoText} numberOfLines={1}>{business.address}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.priceText}>Starting at <Text style={styles.priceValue}>₹499</Text></Text>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>VIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </AnimatedFadeIn>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  gridCard: {
    marginHorizontal: 8,
    marginVertical: 8,
    flex: 1,
  },
  horizontalCard: {
    width: 200,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  horizontalImage: {
    height: 130,
  },
  gridImage: {
    height: 140,
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
  content: {
    padding: 16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  priceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  viewBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5,
  },

});

export default React.memo(BusinessCard);
