import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import LeadGatekeeper from '../../components/LeadGatekeeper';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import PremiumLoader from '../../components/PremiumLoader';
import leadService from '../../services/leadService';
import Toast from 'react-native-toast-message';

// Dummy Data mapped by subcategory
const dummyResults = {
  // Home Services (Cleaning, Plumbing, Electrical, HVAC)
  'Home Deep Cleaning': [
    { id: 'c1', name: 'Elite Home Shine', category: 'Cleaning', rating: '4.9', tier: 'Diamond', address: 'Model Colony', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952' },
    { id: 'c2', name: 'Sparkle Squad', category: 'Cleaning', rating: '4.7', tier: 'Gold', address: 'Vishrambag', image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab' },
  ],
  'Pipe Leaks': [
    { id: 'p1', name: 'LeakFix Pro', category: 'Plumbing', rating: '4.8', tier: 'Diamond', address: 'Sangli City', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12' },
  ],
  'Wiring & Panels': [
    { id: 'e1', name: 'VoltMaster Electrical', category: 'Electrical', rating: '4.6', tier: 'Silver', address: 'Miraj', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9' },
  ],
  'AC Service & Repair': [
    { id: 'h1', name: 'Arctic Cool HVAC', category: 'HVAC', rating: '4.9', tier: 'Diamond', address: 'Sangli', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26' },
  ],

  // Lifestyle & Care
  'Pet Grooming': [
    { id: 'pet1', name: 'Paws & Whiskers Spa', category: 'Pet Care', rating: '4.8', tier: 'Gold', address: 'Gulmohar Colony', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7' },
  ],
  'Car Wash & Spa': [
    { id: 'auto1', name: 'Glossy Rides Detailing', category: 'Automobile', rating: '4.7', tier: 'Diamond', address: 'South Shivaji Nagar', image: 'https://images.unsplash.com/photo-1487754164641-a095905fd481' },
  ],
  'Photography': [
    { id: 'ev1', name: 'LensCraft Studios', category: 'Events', rating: '5.0', tier: 'Diamond', address: 'Gaonbhag', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' },
  ],
  'Yoga Instructor': [
    { id: 'fit1', name: 'Zen Flow Yoga', category: 'Health', rating: '4.9', tier: 'Gold', address: 'Vijay Nagar', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b' },
  ],

  // Professional & Home Design
  'Wall Painting': [
    { id: 'des1', name: 'Rainbow Decorators', category: 'Home Design', rating: '4.5', tier: 'Silver', address: 'Kupwad', image: 'https://images.unsplash.com/photo-1562591176-3293099a0bf3' },
  ],
  'Notary Help': [
    { id: 'leg1', name: 'Advocate Sawant & Associates', category: 'Legal', rating: '4.8', tier: 'Diamond', address: 'District Court Area', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f' },
  ],
  'Private Tutors': [
    { id: 'edu1', name: 'Bright Future Academy', category: 'Education', rating: '4.7', tier: 'Gold', address: 'Vishrambag', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d' },
  ],
  'Rentals': [
    { id: 're1', name: 'Localnest Properties', category: 'Real Estate', rating: '4.4', tier: 'Silver', address: 'Sangli City', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa' },
  ],
  'Dry Cleaning': [
    { id: 'l1', name: 'White Cloud Laundry', category: 'Laundry', rating: '4.6', tier: 'Gold', address: 'Market Yard', image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60' },
  ],
  'Cafe': [
    { id: 'res1', name: 'Brew & Bite Cafe', category: 'Restaurants', rating: '4.5', tier: 'Gold', address: 'College Corner', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' },
  ],
};

const filters = ['Top Rated', 'Near Me', 'Open Now', 'Price'];


const SubcategoryScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const numColumns = isWeb ? (width > 1200 ? 3 : 2) : 1;

  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [loading, setLoading] = useState(true);
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const { isAuthenticated, leadCaptured } = useSelector(state => state.auth);
  
  const subcategory = route.params?.subcategory || 'Services';

  useEffect(() => {
    // Show lead modal if info not already captured
    if (!isAuthenticated && !leadCaptured) {
      setLeadModalVisible(true);
    }

    setLoading(true);
    const matchedResults = dummyResults[subcategory] || [];
    setResults(matchedResults);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [subcategory, isAuthenticated, leadCaptured]);

  const handleLeadSuccess = () => {
    setLeadModalVisible(false);
  };

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

      {/* ─── Lead Gating Modal ─── */}
      <LeadGatekeeper
        visible={leadModalVisible}
        category={{ name: subcategory }}
        onClose={() => navigation.goBack()}
        onSuccess={handleLeadSuccess}
      />
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
