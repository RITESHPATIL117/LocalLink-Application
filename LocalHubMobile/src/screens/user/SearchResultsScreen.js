import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

// Dummy Data
const dummyResults = [
  {
    id: '201',
    name: 'Green Leaf Cafe',
    category: 'Restaurants',
    rating: '4.6',
    tier: 'Gold',
    address: 'Saket, New Delhi',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  },
  {
    id: '202',
    name: 'Apollo Pharmacy',
    category: 'Pharmacy',
    rating: '4.2',
    tier: 'Silver',
    address: 'Hauz Khas, New Delhi',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831',
  },
  {
    id: '203',
    name: 'Urban Clap Salon Services',
    category: 'Salons',
    rating: '4.9',
    tier: 'Diamond',
    address: 'Home Service, NCR',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
  },
];

const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price'];

const SearchResultsScreen = ({ route, navigation }) => {
  const [activeFilter, setActiveFilter] = useState('Top Rated');

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
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
        data={dummyResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  },
});

export default SearchResultsScreen;
