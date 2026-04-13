import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, ActivityIndicator, useWindowDimensions,
  LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import categoryService from '../../services/categoryService';
import LeadGatekeeper from '../../components/LeadGatekeeper';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { resolveCategoryImage, resolveSubcategoryImage } from '../../utils/categoryImageResolver';



// ─── Fallback & Mock Data ──────────────────────────────────────────────────

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
  const [leadEnquiryNote, setLeadEnquiryNote] = useState('');
  const { isAuthenticated, leadCaptured } = useSelector(state => state.auth);

  // Responsive Grid
  // Left nav takes ~90px. Remaining is right pane.
  const numColumns = rightPaneWidth > 800 ? 4 : (rightPaneWidth > 500 ? 3 : 2);
  const itemWidth = (rightPaneWidth - 48 - (16 * (numColumns - 1))) / numColumns;

  const handleSelectNav = React.useCallback(async (id, categoriesSnapshot = null) => {
    if (id == null || id === '') return;
    const cats = categoriesSnapshot ?? categories;
    const idStr = String(id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMainCat(idStr);
    setSubLoading(true);
    try {
      const cat = cats.find((c) => String(c.id) === idStr);
      const embedded = cat?.subcategories;
      if (embedded && embedded.length > 0) {
        setActiveSubcategories(embedded);
        return;
      }
      const subRes = await categoryService.getSubcategories(idStr);
      let list = subRes.data || [];
      const filtered = list.filter((sub) => {
        const p = sub.parent_id ?? sub.parentId ?? sub.category_id ?? sub.categoryId;
        if (p == null) return true;
        return String(p) === idStr;
      });
      setActiveSubcategories(filtered.length > 0 ? filtered : list);
    } catch (e) {
      console.error('Failed to fetch subcategories', e);
      setActiveSubcategories([]);
    } finally {
      setSubLoading(false);
    }
  }, [categories]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      const rawData = res.data || [];
      
      const structured = rawData.map((c, i) => ({
        ...c,
        id: String(c.id != null ? c.id : `fallback-${i}`),
        color: c.color || '#3B82F6',
        bg: c.bg || '#EFF6FF',
        icon: c.icon || 'grid-outline',
      }));

      setCategories(structured);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [handleSelectNav]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // When opened directly (no category passed from Home), select the first category once.
  useEffect(() => {
    if (loading) return;
    if (!categories.length) return;
    const hasRouteCategory =
      route?.params?.categoryId != null && route.params.categoryId !== '' ||
      (route?.params?.categoryName && String(route.params.categoryName).trim() !== '');
    if (hasRouteCategory) return;
    if (selectedMainCat != null) return;
    handleSelectNav(categories[0].id, categories);
  }, [loading, categories, selectedMainCat, route?.params, handleSelectNav]);

  useFocusEffect(
    React.useCallback(() => {
      let categoryId = route.params?.categoryId;
      const categoryName = route.params?.categoryName;
      if (!categories.length) return;
      let found = null;
      if (categoryId != null && categoryId !== '') {
        found = categories.find((c) => String(c.id) === String(categoryId));
      }
      if (!found && categoryName) {
        found = categories.find(
          (c) => c.name?.toLowerCase().trim() === String(categoryName).toLowerCase().trim()
        );
      }
      if (found) {
        handleSelectNav(String(found.id), categories);
        navigation.setParams({ categoryId: null, categoryName: null });
      }
    }, [route.params?.categoryId, route.params?.categoryName, categories, navigation, handleSelectNav])
  );

  const activeCategoryData =
    categories.find((c) => String(c.id) === String(selectedMainCat)) || categories[0];

  // Filter Subcategories if searching, otherwise show active main category content
  const isSearching = search.trim().length > 0;
  
  const buildSearchParams = (subItem) => {
    const catId = subItem.parentCatId ?? selectedMainCat;
    const cat = categories.find((c) => String(c.id) === String(catId));
    return {
      query: subItem.name,
      categoryId: catId,
      categoryName: cat?.name || subItem.parentCat || activeCategoryData?.name,
      subcategoryId: subItem.id,
      subcategoryName: subItem.name,
      fromCategoryBrowse: true,
    };
  };

  const handleSubcategoryPress = (subItem) => {
    if (isAuthenticated || leadCaptured) {
      navigation.navigate('SearchResults', buildSearchParams(subItem));
    } else {
      setLeadEnquiryNote(`Categories: ${subItem.name}${subItem.parentCat ? ` (${subItem.parentCat})` : ''}`);
      setPendingSubItem({ ...subItem, category_id: selectedMainCat });
      setLeadModalVisible(true);
    }
  };

  const handleLeadSuccess = () => {
    setLeadModalVisible(false);
    const cat = categories.find((c) => String(c.id) === String(pendingSubItem?.category_id));
    navigation.navigate('SearchResults', {
      query: pendingSubItem?.name,
      categoryId: pendingSubItem?.category_id,
      categoryName: cat?.name || pendingSubItem?.parentCat,
      subcategoryId: pendingSubItem?.id,
      subcategoryName: pendingSubItem?.name,
      fromCategoryBrowse: true,
    });
  };

  const searchQuery = search.trim().toLowerCase();
  const searchResults = isSearching
    ? categories.flatMap((cat) => {
        const subs = cat.subcategories || [];
        const words = searchQuery.split(/\s+/).filter(Boolean);
        return subs
          .filter((sub) => {
            const sn = sub.name.toLowerCase();
            if (sn.includes(searchQuery)) return true;
            if (words.length > 1) return words.every((w) => sn.includes(w));
            return false;
          })
          .map((sub) => ({ ...sub, parentCat: cat.name, parentCatId: cat.id }));
      })
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
            Found {searchResults.length} results for &quot;{search}&quot;
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
                const isActive = String(selectedMainCat) === String(cat.id);
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
                    {resolveCategoryImage(activeCategoryData) ? (
                      <Image
                        source={{ uri: resolveCategoryImage(activeCategoryData) }}
                        style={styles.rightHeaderPhoto}
                        resizeMode="cover"
                      />
                    ) : null}
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
                            parentName={activeCategoryData.name}
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
        enquiryNote={leadEnquiryNote}
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

const subImageHashKey = (parentName, subName) => `${parentName || ''}|${subName || ''}`;

const pickFallbackSubImage = (key) => {
  let h = 0;
  const s = String(key || '');
  for (let i = 0; i < s.length; i += 1) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return SUB_FALLBACKS[Math.abs(h) % SUB_FALLBACKS.length];
};

const SubcategoryCard = ({ item, parentName, onPress, index: _index = 0 }) => {
  const resolved = resolveSubcategoryImage(item, parentName);
  const isValidImage = resolved && resolved.length > 5 && resolved !== 'null' && resolved !== 'undefined';
  const imgUri = isValidImage ? resolved : pickFallbackSubImage(subImageHashKey(parentName, item.name));
  
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
    overflow: 'hidden',
    position: 'relative',
  },
  rightHeaderPhoto: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
  rightHeaderLeft: { flex: 1, paddingRight: 10, zIndex: 1 },
  rightHeaderTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  rightHeaderSub: { fontSize: 12, color: '#4B5563', fontWeight: '600', opacity: 0.8 },
  rightHeaderIcon: {
    width: 50, height: 50, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
    zIndex: 1,
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
