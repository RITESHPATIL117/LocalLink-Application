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
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
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
          {business.tier && (
            <View style={styles.badgeOverlay}>
              <Badge tier={business.tier} />
            </View>
          )}
          <BlurView intensity={60} tint="dark" style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{business.rating}</Text>
            <Ionicons name="star" size={12} color={colors.star} />
          </BlurView>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#6B7280" />
            <Text style={styles.infoText} numberOfLines={1}>{business.address}</Text>
          </View>

          {!horizontal && (
            <View style={styles.categoryRow}>
              <Text style={styles.categoryText}>{business.category}</Text>
              <View style={styles.dot} />
              <Text style={styles.statusText}>Open Now</Text>
            </View>
          )}

          {(!horizontal && !grid) && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" size={16} color="#FFF" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.msgBtn}>
                <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Pressable>
    </AnimatedFadeIn>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    width: 180,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  horizontalImage: {
    height: 120,
  },
  gridImage: {
    height: 140,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    marginRight: 4,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  msgBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BusinessCard;
