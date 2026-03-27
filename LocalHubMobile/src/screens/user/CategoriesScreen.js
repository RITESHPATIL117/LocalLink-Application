import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, ActivityIndicator, useWindowDimensions,
  Platform, KeyboardAvoidingView, LayoutAnimation, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import categoryService from '../../services/categoryService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';



// ─── Fallback & Mock Data ──────────────────────────────────────────────────

const FALLBACK_CATEGORIES = [
  { id: 'c1', name: 'Plumbing',        icon: 'water-outline',          color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'c2', name: 'Electrical',      icon: 'flash-outline',          color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'c3', name: 'Cleaning',        icon: 'sparkles-outline',       color: '#10B981', bg: '#ECFDF5' },
  { id: 'c4', name: 'AC & Appliance',  icon: 'thermometer-outline',    color: '#06B6D4', bg: '#ECFEFF' },
  { id: 'c5', name: 'Beauty & Salon',  icon: 'cut-outline',            color: '#EC4899', bg: '#FDF2F8' },
  { id: 'c6', name: 'Carpenter',       icon: 'hammer-outline',         color: '#92400E', bg: '#FFF7ED' },
  { id: 'c7', name: 'Painting',        icon: 'color-palette-outline',  color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'c8', name: 'Pest Control',    icon: 'bug-outline',            color: '#EF4444', bg: '#FEF2F2' },
];

const SUBCAT_MAP = {
  'Plumbing': [
    { name: 'Pipe Leak Repair', icon: 'water', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=300' },
    { name: 'Water Heater', icon: 'thermometer', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=300' },
    { name: 'Toilet Repair', icon: 'business', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=300' },
    { name: 'Drain Cleaning', icon: 'sync', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300' }
  ],
  'Electrical': [
    { name: 'Wiring & Panels', icon: 'flash', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300' },
    { name: 'Lighting Setup', icon: 'sunny', image: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?q=80&w=300' },
    { name: 'Inverter Repair', icon: 'battery-charging', image: 'https://images.unsplash.com/photo-1521747669139-02cd71498b04?q=80&w=300' },
    { name: 'Fan Repair', icon: 'aperture', image: 'https://images.unsplash.com/photo-1574343867664-850970d4fc6a?q=80&w=300' }
  ],
  'Cleaning': [
    { name: 'Deep Home Clean', icon: 'sparkles', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300' },
    { name: 'Sofa Cleaning', icon: 'bed', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=300' },
    { name: 'Kitchen Clean', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300' },
    { name: 'Bathroom Clean', icon: 'water', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=300' }
  ],
  'AC & Appliance': [
    { name: 'AC Service', icon: 'snow', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=300' },
    { name: 'Fridge Repair', icon: 'cube', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=300' },
    { name: 'Washing Machine', icon: 'sync', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300' }
  ],
  'Beauty & Salon': [
    { name: 'Hair Styling', icon: 'cut', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300' },
    { name: 'Facial & Cleanup', icon: 'happy', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300' },
    { name: 'Manicure', icon: 'hand-left', image: 'https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?q=80&w=300' },
    { name: 'Bridal Makeup', icon: 'color-palette', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300' }
  ]
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const CategoriesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState(null);

  // Responsive Grid
  // Left nav takes ~90px. Remaining is right pane.
  const rightPaneWidth = width - 90;
  const numColumns = rightPaneWidth > 600 ? 3 : 2;
  const itemWidth = (rightPaneWidth - 40 - (10 * (numColumns - 1))) / numColumns;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories().catch(() => ({ data: [] }));
      const rawData = res.data && res.data.length > 0 ? res.data : FALLBACK_CATEGORIES;
      
      const structured = rawData.map((c, i) => ({
        ...c,
        id: c.id || `fallback-${i}`,
        color: c.color || '#3B82F6',
        bg: c.bg || '#EFF6FF',
        icon: c.icon || 'grid-outline',
        subcategories: SUBCAT_MAP[c.name] || [
          { name: `${c.name} Pro`, icon: 'star', image: 'https://images.unsplash.com/photo-1581094488221-757774cc1e5b?q=80&w=300' },
          { name: `Standard ${c.name}`, icon: 'hammer', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300' }
        ]
      }));

      setCategories(structured);
      if (structured.length > 0) {
        setSelectedMainCat(structured[0].id);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryData = categories.find(c => c.id === selectedMainCat) || categories[0];

  const handleSelectNav = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMainCat(id);
  };

  // Filter Subcategories if searching, otherwise show active main category content
  const isSearching = search.trim().length > 0;
  
  const searchResults = isSearching 
    ? categories.flatMap(cat => 
        cat.subcategories
           .filter(sub => sub.name.toLowerCase().includes(search.toLowerCase()) || cat.name.toLowerCase().includes(search.toLowerCase()))
           .map(sub => ({ ...sub, parentCat: cat.name }))
      )
    : [];

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Explore Services</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search for AC Repair, Plumbing..." 
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ─── Main Content Area ─── */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Loading services...</Text>
        </View>
      ) : isSearching ? (
        
        // ─── Search Results View ───
        <ScrollView contentContainerStyle={styles.searchResultsContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.searchResultsHeader}>
            Found {searchResults.length} results for "{search}"
          </Text>
          <View style={styles.subCatGrid}>
            {searchResults.length > 0 ? searchResults.map((subItem, index) => (
              <AnimatedFadeIn key={index} delay={index * 50} duration={400} style={[styles.gridItem, { width: 150 }]}>
                <SubcategoryCard 
                  item={subItem} 
                  parentName={subItem.parentCat}
                  onPress={() => navigation.navigate('SearchResults', { query: subItem.name })} 
                />
              </AnimatedFadeIn>
            )) : (
              <View style={styles.noResultsBox}>
                <Ionicons name="search-outline" size={60} color="#E5E7EB" />
                <Text style={styles.noResultsText}>No services found.</Text>
              </View>
            )}
          </View>
        </ScrollView>

      ) : (

        // ─── Premium Split Layout View ───
        <View style={styles.splitLayout}>
          
          {/* Left Vertical Nav */}
          <View style={styles.leftNav}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.leftNavScroll}>
              {categories.map((cat, index) => {
                const isActive = selectedMainCat === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.leftNavItem, isActive && styles.leftNavItemActive]}
                    onPress={() => handleSelectNav(cat.id)}
                    activeOpacity={0.8}
                  >
                    {isActive && <View style={[styles.activeIndicator, { backgroundColor: cat.color }]} />}
                    <View style={[styles.navIconBg, isActive ? { backgroundColor: cat.color } : { backgroundColor: '#F3F4F6' }]}>
                      {renderDynamicIcon(cat.icon, 22, isActive ? '#FFF' : '#6B7280')}
                    </View>
                    <Text style={[styles.navItemText, isActive && { color: cat.color, fontWeight: '800' }]} numberOfLines={2}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Right Content Area */}
          <View style={styles.rightContent}>
            {activeCategoryData && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.rightContentScroll}>
                <AnimatedFadeIn duration={400} key={activeCategoryData.id}>
                  
                  {/* Active Category Header Banner */}
                  <View style={[styles.rightHeaderBanner, { backgroundColor: activeCategoryData.bg }]}>
                    <View style={styles.rightHeaderLeft}>
                      <Text style={[styles.rightHeaderTitle, { color: activeCategoryData.color }]}>
                        {activeCategoryData.name}
                      </Text>
                      <Text style={styles.rightHeaderSub}>Select a service to expand</Text>
                    </View>
                    <View style={[styles.rightHeaderIcon, { backgroundColor: activeCategoryData.color }]}>
                      {renderDynamicIcon(activeCategoryData.icon, 30, '#FFF')}
                    </View>
                  </View>

                  {/* Subcategory Grid */}
                  <View style={styles.subCatGrid}>
                    {activeCategoryData.subcategories.map((subItem, index) => (
                      <AnimatedFadeIn 
                        key={`${activeCategoryData.id}-${index}`} 
                        delay={index * 50} 
                        duration={300} 
                        style={[styles.gridItem, { width: itemWidth }]}
                      >
                        <SubcategoryCard 
                          item={subItem} 
                          onPress={() => navigation.navigate('SearchResults', { query: subItem.name })} 
                        />
                      </AnimatedFadeIn>
                    ))}
                  </View>
                  
                  {/* Space at bottom for safe scrolling */}
                  <View style={{ height: 40 }} />
                </AnimatedFadeIn>
              </ScrollView>
            )}
          </View>

        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Helper UI Components ────────────────────────────────────────────────────

const SubcategoryCard = ({ item, parentName, onPress }) => (
  <TouchableOpacity style={styles.subCatCard} onPress={onPress} activeOpacity={0.85}>
    <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1581094488221-757774cc1e5b?q=80&w=300' }} style={styles.subCatImg} />
    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.subCatGradient} />
    
    <View style={styles.subCatMeta}>
      {parentName && <Text style={styles.parentCatText}>{parentName}</Text>}
      <Text style={styles.subCatTitle} numberOfLines={2}>{item.name}</Text>
    </View>
  </TouchableOpacity>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  // Header area
  header: {
    backgroundColor: '#FFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  
  // Search
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', marginHorizontal: 20, paddingHorizontal: 16,
    height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#111827' },

  // Loading
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontSize: 14, color: '#9CA3AF', fontWeight: '600' },

  // Split Layout
  splitLayout: { flex: 1, flexDirection: 'row' },
  
  // Left Nav (Vertical Menu)
  leftNav: {
    width: 90,
    backgroundColor: '#F9FAFB',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  leftNavScroll: { paddingVertical: 10 },
  leftNavItem: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftNavItemActive: { backgroundColor: '#FFF' },
  activeIndicator: {
    position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4,
    borderTopRightRadius: 4, borderBottomRightRadius: 4,
  },
  navIconBg: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  navItemText: { fontSize: 11, fontWeight: '600', color: '#6B7280', textAlign: 'center', lineHeight: 14 },

  // Right Content Area
  rightContent: { flex: 1, backgroundColor: '#FFF' },
  rightContentScroll: { padding: 16 },
  
  rightHeaderBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, borderRadius: 20, marginBottom: 20,
  },
  rightHeaderLeft: { flex: 1, paddingRight: 10 },
  rightHeaderTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  rightHeaderSub: { fontSize: 12, color: '#4B5563', fontWeight: '600', opacity: 0.8 },
  rightHeaderIcon: {
    width: 50, height: 50, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },

  // Subcategory Grid
  subCatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { marginBottom: 10 },
  
  subCatCard: {
    width: '100%', height: 140, borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  subCatImg: { width: '100%', height: '100%' },
  subCatGradient: { ...StyleSheet.absoluteFillObject, top: '40%' },
  subCatMeta: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
  },
  parentCatText: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  subCatTitle: { fontSize: 13, fontWeight: '800', color: '#FFF', lineHeight: 18 },

  // Search Results Mode
  searchResultsContainer: { padding: 20 },
  searchResultsHeader: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  noResultsBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, width: '100%' },
  noResultsText: { marginTop: 16, fontSize: 15, color: '#9CA3AF', fontWeight: '700' },
});

export default CategoriesScreen;
