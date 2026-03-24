import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import PremiumLoader from '../../components/PremiumLoader';

// Dummy Data mapped by subcategory
const dummyResults = {
  'Plumbers': [
    {
      id: 'p1',
      name: 'SuperFast Plumbing',
      category: 'Home Services',
      rating: '4.9',
      tier: 'Diamond',
      address: 'Sangli',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', 
    },
    {
      id: 'p2',
      name: 'AtoZ Plumbing Experts',
      category: 'Home Services',
      rating: '4.5',
      tier: 'Gold',
      address: 'Vishrambag',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
    }
  ],
  'Restaurants': [
    {
      id: 'r1',
      name: 'Green Leaf Cafe',
      category: 'Restaurants',
      rating: '4.6',
      tier: 'Gold',
      address: 'Saket, New Delhi',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    }
  ],
};

const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price'];

import { useWindowDimensions } from 'react-native';

const SubcategoryScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const numColumns = isWeb ? (width > 1200 ? 3 : 2) : 1;

  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const subcategory = route.params?.subcategory || 'Services';

  useEffect(() => {
    setLoading(true);
    const matchedResults = dummyResults[subcategory] || [];
    setResults(matchedResults);
    
    // Simulate API fetch delay for premium feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [subcategory]);

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subcategory}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
             <Ionicons name="person-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterBar}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.filterChip, 
                  activeFilter === item && styles.activeFilterChip
                ]}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === item && styles.activeFilterText
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {loading ? (
        <PremiumLoader message={`Finding best ${subcategory}...`} />
      ) : (
        <FlatList
          key={numColumns}
          data={results}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#E5E7EB" />
              <Text style={styles.emptyText}>No providers found for {subcategory}</Text>
            </View>
          )}
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
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  filterBar: {
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default SubcategoryScreen;
