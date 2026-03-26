import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BusinessCard from '../../components/BusinessCard';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummySavedBusinesses = [
  {
    id: '101',
    name: 'Sagar Ratna Restaurant',
    category: 'Restaurants',
    rating: '4.8',
    address: 'South Extension, New Delhi',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400',
  },
  {
    id: '103',
    name: 'QuickFix Electricals',
    category: 'Electricians',
    rating: '4.5',
    address: 'Andheri West, Mumbai',
    image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18?q=80&w=400',
  },
];


const FavoritesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const numColumns = isWeb ? (width > 1200 ? 3 : 2) : 1;
  const [favorites, setFavorites] = useState(dummySavedBusinesses);

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Items</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="filter-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {favorites.length === 0 ? (
        <AnimatedFadeIn duration={600}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="heart-outline" size={100} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyDesc}>
              Tap the heart icon on any business page to save it for quick access later.
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn} 
              onPress={() => navigation.navigate('HomeTab')}
            >
              <Text style={styles.exploreBtnText}>Explore Services</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>
      ) : (
        <FlatList
          key={numColumns}
          data={favorites}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <BusinessCard 
              business={item} 
              grid={numColumns > 1}
              index={index}
              onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: { 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyIconBg: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  emptyDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default FavoritesScreen;
