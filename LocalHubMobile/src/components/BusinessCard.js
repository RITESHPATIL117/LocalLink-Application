import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import Badge from './Badge';

const BusinessCard = ({ business, onPress, horizontal }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, horizontal && styles.horizontalCard]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: business.image || 'https://via.placeholder.com/300x150?text=Business+Image' }} 
        style={horizontal ? styles.horizontalImage : styles.image} 
      />
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
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{business.rating}</Text>
                <Ionicons name="star" size={12} color="#FFF" />
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
    </TouchableOpacity>
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
  ratingContainer: {
    backgroundColor: '#34A853',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 2,
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
