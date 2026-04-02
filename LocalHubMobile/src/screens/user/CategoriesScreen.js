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
import LeadGatekeeper from '../../components/LeadGatekeeper';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';



// ─── Fallback & Mock Data ──────────────────────────────────────────────────

const FALLBACK_CATEGORIES = [
  { id: 'c1', name: 'Plumbing',        icon: 'water-outline',          color: '#3B82F6', bg: '#EFF6FF', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800' },
  { id: 'c2', name: 'Electrical',      icon: 'flash-outline',          color: '#F59E0B', bg: '#FFFBEB', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=800' },
  { id: 'c3', name: 'Cleaning',        icon: 'sparkles-outline',       color: '#10B981', bg: '#ECFDF5', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800' },
  { id: 'c4', name: 'AC Service',      icon: 'thermometer-outline',    color: '#06B6D4', bg: '#ECFEFF', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800' },
  { id: 'c5', name: 'Salon',           icon: 'cut-outline',            color: '#EC4899', bg: '#FDF2F8', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800' },
  { id: 'c6', name: 'Carpentry',       icon: 'hammer-outline',         color: '#92400E', bg: '#FFF7ED', image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800' },
  { id: 'c7', name: 'Painting',        icon: 'color-palette-outline',  color: '#8B5CF6', bg: '#F5F3FF', image: 'https://images.unsplash.com/photo-1562591176-3293099a0bf3?q=80&w=800' },
  { id: 'c8', name: 'Pest Control',    icon: 'bug-outline',            color: '#EF4444', bg: '#FEF2F2', image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

const MAX_APP_WIDTH = 1200;

const CategoriesScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const contentWidth = Math.min(width, MAX_APP_WIDTH);
  const leftNavWidth = 90;
  const rightPaneWidth = isDesktop ? (contentWidth - leftNavWidth) : (width - leftNavWidth);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [activeSubcategories, setActiveSubcategories] = useState([]);

  // Lead Modal State
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [pendingSubItem, setPendingSubItem] = useState(null);
  const { isAuthenticated, leadCaptured } = useSelector(state => state.auth);

  // Responsive Grid
  // Left nav takes ~90px. Remaining is right pane.
  const numColumns = rightPaneWidth > 800 ? 4 : (rightPaneWidth > 500 ? 3 : 2);
  const itemWidth = (rightPaneWidth - 48 - (16 * (numColumns - 1))) / numColumns;

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const categoryId = route.params?.categoryId;
      if (categoryId && categories.length > 0) {
        handleSelectNav(categoryId);
        // Reset the param so it doesn't re-select if we navigate back
        navigation.setParams({ categoryId: null });
      }
    }, [route.params?.categoryId, categories])
  );

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const rawData = res.data || [];
      
      const structured = rawData.map((c, i) => ({
        ...c,
        id: c.id || `fallback-${i}`,
        color: c.color || '#3B82F6',
        bg: c.bg || '#EFF6FF',
        icon: c.icon || 'grid-outline',
      }));

      setCategories(structured);
      if (structured.length > 0) {
        handleSelectNav(structured[0].id);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryData = categories.find(c => c.id === selectedMainCat) || categories[0];

  const handleSelectNav = async (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMainCat(id);
    setSubLoading(true);
    try {
      const subRes = await categoryService.getSubcategories(id);
      setActiveSubcategories(subRes.data || []);
    } catch (e) {
      console.error('Failed to fetch subcategories', e);
    } finally {
      setSubLoading(false);
    }
  };

  // Filter Subcategories if searching, otherwise show active main category content
  const isSearching = search.trim().length > 0;
  
  const handleSubcategoryPress = (subItem) => {
    if (isAuthenticated || leadCaptured) {
      navigation.navigate('SearchResults', { query: subItem.name });
    } else {
      // Attach the parent category ID so LeadGatekeeper can send it to the backend
      setPendingSubItem({ ...subItem, category_id: selectedMainCat });
      setLeadModalVisible(true);
    }
  };

  const handleLeadSuccess = () => {
    setLeadModalVisible(false);
    navigation.navigate('SearchResults', { query: pendingSubItem?.name });
  };

  const searchResults = isSearching 
    ? categories.flatMap(cat => 
        (cat.subcategories || [])
           .filter(sub => sub.name.toLowerCase().includes(search.toLowerCase()) || cat.name.toLowerCase().includes(search.toLowerCase()))
           .map(sub => ({ ...sub, parentCat: cat.name }))
      )
    : [];

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>
      
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {navigation.canGoBack() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          )}
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
                  onPress={() => handleSubcategoryPress(subItem)} 
                  index={index}
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

                  {/* Popular Chips (Justdial Style) */}
                  <View style={styles.popularSection}>
                    <Text style={styles.sectionLabel}>Popular in {activeCategoryData.name}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                      {activeSubcategories.slice(0, 5).map((sub, idx) => (
                        <TouchableOpacity 
                          key={`pop-${idx}`} 
                          style={styles.popChip}
                          onPress={() => handleSubcategoryPress(sub)}
                        >
                          <Text style={styles.popChipText}>{sub.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Subcategory Grid */}
                  <View style={styles.subCatGrid}>
                    {subLoading ? (
                      <View style={styles.subLoader}>
                        <ActivityIndicator color={activeCategoryData.color} />
                        <Text style={styles.subLoaderText}>Fetching services...</Text>
                      </View>
                    ) : (
                      activeSubcategories.map((subItem, index) => (
                        <AnimatedFadeIn 
                          key={`${selectedMainCat}-${index}`} 
                          delay={index * 30} 
                          duration={500} 
                          style={[styles.gridItem, { width: itemWidth }]}
                        >
                          <SubcategoryCard 
                            item={subItem} 
                            onPress={() => handleSubcategoryPress(subItem)} 
                            index={index}
                          />
                        </AnimatedFadeIn>
                      ))
                    )}
                  </View>
                  
                  {/* Space at bottom for safe scrolling */}
                  <View style={{ height: 40 }} />
                </AnimatedFadeIn>
              </ScrollView>
            )}
          </View>
        </View>
      )}
      <LeadGatekeeper 
        visible={leadModalVisible}
        category={pendingSubItem}
        onClose={() => setLeadModalVisible(false)}
        onSuccess={handleLeadSuccess}
      />
      </View>
    </SafeAreaView>
  );
};

// ─── Helper UI Components ────────────────────────────────────────────────────

const SUB_FALLBACKS = [
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
  'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=800',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800',
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800',
  'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800'
];

const SubcategoryCard = ({ item, parentName, onPress, index = 0 }) => {
  const isValidImage = item.image && item.image.length > 5 && item.image !== 'null' && item.image !== 'undefined';
  const imgUri = isValidImage ? item.image : SUB_FALLBACKS[index % SUB_FALLBACKS.length];
  
  return (
    <TouchableOpacity style={styles.jdCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.jdIconBox}>
        <Image source={{ uri: imgUri }} style={styles.jdImg} />
      </View>
      <Text style={styles.jdTitle} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  mainWrapper: { flex: 1, width: '100%' },
  mainWrapperDesktop: {
    maxWidth: MAX_APP_WIDTH,
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFF',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, elevation: 5,
  },

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
  subCatGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  gridItem: { 
    marginBottom: 8,
  },
  
  // Justdial Style Card
  jdCard: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  jdIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jdImg: { width: '100%', height: '100%' },
  jdTitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#374151', 
    textAlign: 'center', 
    paddingHorizontal: 4,
    lineHeight: 14,
  },

  // Popular Section
  popularSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  popularScroll: { gap: 10, paddingRight: 20 },
  popChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  popChipText: { fontSize: 13, fontWeight: '700', color: '#4B5563' },

  // Search Results Mode
  searchResultsContainer: { padding: 20 },
  searchResultsHeader: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  noResultsBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, width: '100%' },
  noResultsText: { marginTop: 16, fontSize: 15, color: '#9CA3AF', fontWeight: '700' },

  // Sub Loader
  subLoader: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, width: '100%' },
  subLoaderText: { marginTop: 10, fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
});

export default CategoriesScreen;
