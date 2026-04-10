import { useWindowDimensions, TextInput, View, StyleSheet, TouchableOpacity, Text, FlatList, Platform } from 'react-native';
import PremiumLoader from '../../components/PremiumLoader';
import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
  
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import BusinessCard from '../../components/BusinessCard';
import businessService from '../../services/businessService';
import BookingWizard from '../../components/BookingWizard';
import Toast from 'react-native-toast-message';

const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price', 'Newest'];

const SearchResultsScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const numColumns = isDesktop ? (width > 1200 ? 3 : 2) : 1;

  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(route?.params?.query || '');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleInquirePress = (biz) => {
    setSelectedBusiness(biz);
    setBookingModalVisible(true);
  };
  
  const query = route?.params?.query || ''; 

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const fetchResults = useCallback(async () => {
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
  }, [query, activeFilter]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const renderMapView = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webMapFallback}>
          <Ionicons name="map-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.webMapFallbackText}>Map View is optimized for mobile devices.</Text>
          <TouchableOpacity style={styles.switchBackBtn} onPress={() => setViewMode('list')}>
             <Text style={styles.switchBackBtnText}>Switch to List View</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const MapView = require('react-native-maps').default;
    const { Marker, Callout } = require('react-native-maps');

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: results[0]?.latitude || 17.3850,
          longitude: results[0]?.longitude || 78.4867,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {results.map((biz) => (
          <Marker
            key={biz.id}
            coordinate={{
              latitude: parseFloat(biz.latitude) || 17.3850,
              longitude: parseFloat(biz.longitude) || 78.4867,
            }}
            title={biz.name}
            description={biz.category}
            pinColor={colors.primary}
          >
             <Callout onPress={() => navigation.navigate('BusinessDetails', { business: biz })}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{biz.name}</Text>
                  <Text style={styles.calloutSub}>{biz.category}</Text>
                  <Text style={styles.calloutAction}>View Details</Text>
                </View>
             </Callout>
          </Marker>
        ))}
      </MapView>
    );
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]} edges={['top']}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <View style={styles.headerTop}>
          {!isDesktop && (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color={colors.primary} />
            </TouchableOpacity>
          )}
          <View style={styles.headerSearch}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput 
              value={search}
              onChangeText={setSearch}
              placeholder="Search services..."
              style={styles.headerSearchInput}
            />
          </View>
          <TouchableOpacity 
            style={styles.viewToggleBtn}
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          >
            <Ionicons name={viewMode === 'list' ? "map-outline" : "list-outline"} size={24} color={colors.primary} />
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
      ) : viewMode === 'map' ? (
        renderMapView()
      ) : (
        <FlatList
          key={numColumns} // Force re-render when columns change
          data={results}
          numColumns={numColumns}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <BusinessCard 
              business={{
                ...item,
                onInquirePress: handleInquirePress
              }} 
              grid={numColumns > 1}
              index={index}
              onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#E5E7EB" />
              <Text style={styles.emptyText}>No results found for &quot;{search}&quot;</Text>
            </View>
          }
        />
      )}
      <BookingWizard
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        business={selectedBusiness}
        isRFQ={!selectedBusiness?.id} // If no specific business id, it's an RFQ
        onSuccess={(data) => {
          if (!selectedBusiness?.id) {
            Toast.show({
              type: 'success',
              text1: 'Broadcast Sent!',
              text2: 'Matching vendors will contact you soon.'
            });
          } else {
            Toast.show({
              type: 'success',
              text1: 'Booking Confirmed!',
              text2: `Your request for ${selectedBusiness?.name} has been sent.`
            });
          }
        }}
      />
      {results.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setSelectedBusiness({ 
              category_id: results[0].category_id, 
              name: 'Top Vendors',
              category: results[0].category_name 
            });
            setBookingModalVisible(true);
          }}
        >
          <LinearGradient colors={[colors.primary, '#6366F1']} style={styles.fabGradient}>
            <Ionicons name="flash" size={20} color="#FFF" />
            <Text style={styles.fabText}>GET BEST PRICE</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewToggleBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginLeft: 12,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  webMapFallbackText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  switchBackBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  switchBackBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  calloutContainer: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  calloutSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  calloutAction: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 8,
  },
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
    paddingVertical: 14,
    gap: 16,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerDesktop: {
    paddingHorizontal: 40,
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
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  fabGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default SearchResultsScreen;
