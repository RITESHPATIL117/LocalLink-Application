import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

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

const SubcategoryScreen = ({ route, navigation }) => {
  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  
  const subcategory = route.params?.subcategory || 'Services';

  useEffect(() => {
    // Determine dummy results or fallback to empty
    const matchedResults = dummyResults[subcategory] || [];
    setResults(matchedResults);
  }, [subcategory]);

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subcategory}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
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

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No providers found for {subcategory}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <BusinessCard 
            business={item} 
            onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  searchContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 8,
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
    minHeight: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  }
});

export default SubcategoryScreen;
