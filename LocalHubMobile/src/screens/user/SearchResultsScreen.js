import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Skeleton from '../../components/Skeleton';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessService from '../../services/businessService';

// Dummy Data removed for real API calls
const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price'];

const SearchResultsScreen = ({ route, navigation }) => {
  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const query = route?.params?.query || ''; // Get search query from nav params

  useEffect(() => {
    fetchResults();
  }, [query, activeFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Mock parameter sending to reflect real-world filtering
      const params = {
        q: query,
        filter: activeFilter.toLowerCase().replace(' ', '_'),
      };
      const res = await businessService.getAllBusinesses(params);
      setResults(res.data || []);
    } catch (error) {
      console.log('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <View style={{ padding: 16 }}>
          {[1,2,3,4].map(key => (
            <View key={key} style={{ marginBottom: 16 }}>
              <Skeleton width="100%" height={140} radius={12} />
              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Skeleton width="60%" height={20} radius={4} />
                <Skeleton width={40} height={20} radius={4} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Skeleton width="80%" height={16} radius={4} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <BusinessCard 
              business={item} 
              index={index}
              onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
              No results found for "{query}".
            </Text>
          }
        />
      )}
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
