import { useWindowDimensions, TextInput, ActivityIndicator, View, StyleSheet, TouchableOpacity, Text, FlatList, Platform } from 'react-native';
import PremiumLoader from '../../components/PremiumLoader';
import { useState, useEffect } from 'react';
  
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import BusinessCard from '../../components/BusinessCard';
import businessService from '../../services/businessService';
import Skeleton from '../../components/Skeleton';

const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price', 'Newest'];

const SearchResultsScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const numColumns = isWeb ? (width > 1200 ? 3 : 2) : 1;

  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(route?.params?.query || '');
  
  const query = route?.params?.query || ''; 

  useEffect(() => {
    fetchResults();
  }, [query, activeFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
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
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerSearch}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput 
              value={search}
              onChangeText={setSearch}
              placeholder="Search services..."
              style={styles.headerSearchInput}
            />
          </View>
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
        <PremiumLoader message="Searching for services..." />
      ) : (
        <FlatList
          key={numColumns} // Force re-render when columns change
          data={results}
          numColumns={numColumns}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <BusinessCard 
              business={item} 
              grid={numColumns > 1}
              index={index}
              onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#E5E7EB" />
              <Text style={styles.emptyText}>No results found for "{search}"</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  headerSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  filterBar: {
    paddingVertical: 14,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  loaderContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skeletonWrapper: {
    width: Platform.OS === 'web' ? '33.33%' : '100%',
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '800',
    color: '#9CA3AF',
  },

});

export default SearchResultsScreen;
