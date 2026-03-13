import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';
import Badge from './Badge';
import AnimatedFadeIn from './AnimatedFadeIn';

const BusinessCard = ({ business, onPress, horizontal, index = 0 }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if(onPress) onPress();
  };

  return (
    <AnimatedFadeIn delay={index * 100} duration={400} yOffset={20}>
      <Pressable 
        style={({ pressed }) => [
          styles.card, 
          horizontal && styles.horizontalCard,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]} 
        onPress={handlePress}
      >
      <View style={{ position: 'relative' }}>
        <Image 
          source={{ uri: business.image || 'https://via.placeholder.com/300x150?text=Business+Image' }} 
          style={horizontal ? styles.horizontalImage : styles.image} 
        />
        {/* Glassmorphic overlay for rating if vertical */}
        {!horizontal && (
          <BlurView intensity={80} tint="dark" style={styles.glassRating}>
            <Text style={styles.glassRatingText}>{business.rating}</Text>
            <Ionicons name="star" size={12} color="#FBBF24" />
          </BlurView>
        )}
      </View>
      <View style={styles.content}>
        
        {horizontal ? (
          // Simple layout for Home Screen
          <>
            <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
            {business.tier && (
              <Badge tier={business.tier} style={{ marginBottom: 4 }} />
            )}
            <View style={styles.simpleRating}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.simpleRatingText}>{business.rating}</Text>
            </View>
          </>
        ) : (
            // Detailed layout for Listings Screen
            <>
              <View style={styles.headerRow}>
                <View style={{ flex: 1, marginRight: 8, alignItems: 'flex-start' }}>
                  <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
                  {business.tier && (
                    <Badge tier={business.tier} style={{ marginBottom: 4 }} />
                  )}
                </View>
              </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText} numberOfLines={1}>{business.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="list-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{business.category}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={16} color="#FFF" />
                <Text style={styles.callText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      </Pressable>
    </AnimatedFadeIn>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalCard: {
    width: 140, // More compact like the mockup
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#EEE',
  },
  horizontalImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#EEE',
  },
  content: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  simpleRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simpleRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  glassRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  glassRatingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  actionRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  callButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  callText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default BusinessCard;
