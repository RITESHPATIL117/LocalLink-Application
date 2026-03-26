import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, RefreshControl, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../styles/colors';
import SearchBar from '../../components/SearchBar';
import CategoryItem from '../../components/CategoryItem';
import BusinessCard from '../../components/BusinessCard';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Skeleton from '../../components/Skeleton';
import categoryService from '../../services/categoryService';
import businessService from '../../services/businessService';
import PremiumLoader from '../../components/PremiumLoader';
import Toast from 'react-native-toast-message';
import { useMemo } from 'react';

const { width, height } = Dimensions.get('window');

// Fallback mocked arrays removed for real API calls
// High quality real-world images of local services
const bannerImages = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000', // Cleaning/Housekeeping
  'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1000', // Mechanic/Auto Repair
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1000', // Local Grocery/Shop
  'https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?q=80&w=1000', // Salon/Beauty
];

const SLIDER_HEIGHT = height * 0.40; // 40% of screen height
const MAX_APP_WIDTH = 800;

const HomeScreen = ({ navigation }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // Real API Data States
  const [mainCategories, setMainCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = (show) => {
    if (show) {
      setShowDropdown(true);
      Animated.spring(dropdownAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }).start(() => setShowDropdown(false));
    }
  };

  // Calculate banner container width dynamically
  const bannerWidth = Math.min(width, MAX_APP_WIDTH);

  const fetchData = async () => {
    try {
      // Parallel API calls
      const [categoriesRes, businessesRes] = await Promise.all([
        categoryService.getCategories().catch(() => ({ data: [] })),
        businessService.getAllBusinesses({ featured: true }).catch(() => ({ data: [] }))
      ]);
      
      const allCats = categoriesRes.data || [];
      // If none from API, fallback to empty array or we can keep old mock if we had it.
      // For real world, we want to reflect the DB.
      setMainCategories(allCats.slice(0, 4)); 
      setTopCategories(allCats.slice(0, 6));
      
      setFeaturedBusinesses(businessesRes.data || []);
    } catch (error) {
      console.log('Error fetching home data', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not refresh data from server. Showing offline/mock data.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Auto-scroll logic for the image slider
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentBannerIndex + 1;
      if (nextIndex >= bannerImages.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentBannerIndex(nextIndex);
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  const renderBannerItem = useMemo(() => ({ item, index }) => {
    return (
      <View key={index} style={[styles.bannerContainer, { width: bannerWidth }]}>
        <Image 
          source={{ uri: item }} 
          style={styles.bannerImage} 
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bannerOverlay}
        >
          <Text style={styles.bannerTitle}>Professional Services</Text>
          <Text style={styles.bannerSubtitle}>At your fingertips</Text>
        </LinearGradient>
      </View>
    );
  }, [bannerWidth]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        
        {/* Responsive Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuBtn} 
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={[styles.logoIconBg, { backgroundColor: colors.primary }]}>
              <Ionicons name="location" size={16} color="#FFF" />
            </View>
            <Text style={styles.logoText}>Local<Text style={{color: colors.secondary}}>Hub</Text></Text>
          </View>
          
          {width > 768 ? (
            <View style={styles.webNavLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}><Text style={[styles.navLink, styles.activeNavLink]}>Home</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}><Text style={styles.navLink}>Categories</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SearchResults', { query: '' })}><Text style={styles.navLink}>Businesses</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}><Text style={styles.navLink}>Pricing</Text></TouchableOpacity>
              
              {!isAuthenticated ? (
                <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signUpText}>Login / Sign Up</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={styles.profileBtn}>
                  <Image source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={styles.headerAvatar} />
                  <Text style={styles.navLink}>{user?.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity onPress={() => toggleDropdown(true)} style={styles.headerIconButton}>
              <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>


        {/* Global Sub-Navbar (Mobile & Desktop) */}
        <View style={styles.subNavbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subNavbarContent}>
            <TouchableOpacity style={[styles.subNavLink, styles.activeSubNavLink]} onPress={() => navigation.navigate('Home')}>
              <Text style={[styles.subNavText, styles.activeSubNavText]}>Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavLink} onPress={() => navigation.navigate('CategoriesTab')}>
              <Text style={styles.subNavText}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavLink} onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.subNavText}>Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavLink} onPress={() => navigation.navigate('Support')}>
              <Text style={styles.subNavText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavLink} onPress={() => navigation.navigate('SearchResults', { query: '' })}>
              <Text style={styles.subNavText}>Businesses</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Dropdown Menu Modal */}
        {showDropdown && (
          <View style={styles.dropdownOverlay}>
            <TouchableOpacity 
              style={styles.dropdownBackdrop} 
              activeOpacity={1} 
              onPress={() => toggleDropdown(false)} 
            />
            <Animated.View 
              style={[
                styles.dropdownMenu,
                {
                  opacity: dropdownAnim,
                  transform: [
                    { scale: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                    { translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }
                  ]
                }
              ]}
            >
              {/* Triangle Pointer */}
              <View style={styles.dropdownTriangle} />

              {/* User Info Header (Optional) */}
              {isAuthenticated && (
                <View style={styles.userInfoHeader}>
                  <Image source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} style={styles.dropdownAvatar} />
                  <View>
                    <Text style={styles.dropdownName}>{user?.name?.split(' ')[0]}</Text>
                    <Text style={styles.dropdownRole}>Premium Member</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('ProfileTab'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="person-outline" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.dropdownText}>My Profile</Text>
              </TouchableOpacity>
              
              <View style={styles.dropdownDivider} />

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('RequestsTab'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="document-text-outline" size={18} color="#16A34A" />
                </View>
                <Text style={styles.dropdownText}>My Requests</Text>
              </TouchableOpacity>
              
              <View style={styles.dropdownDivider} />

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('FavoritesTab'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#FFF1F2' }]}>
                  <Ionicons name="heart-outline" size={18} color="#E11D48" />
                </View>
                <Text style={styles.dropdownText}>Favorites</Text>
              </TouchableOpacity>
              
              <View style={styles.dropdownDivider} />

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('CategoriesTab'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F5F3FF' }]}>
                  <Ionicons name="grid-outline" size={18} color="#7C3AED" />
                </View>
                <Text style={styles.dropdownText}>All Categories</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('Settings'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="settings-outline" size={18} color="#4B5563" />
                </View>
                <Text style={styles.dropdownText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => { toggleDropdown(false); navigation.navigate('Support'); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="help-circle-outline" size={18} color="#EF4444" />
                </View>
                <Text style={styles.dropdownText}>Help & Support</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Hero Banner Area with Image Slider */}
        <View style={[styles.heroSection, { height: SLIDER_HEIGHT }]}>
          <FlatList
            ref={flatListRef}
            data={bannerImages}
            renderItem={renderBannerItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            style={StyleSheet.absoluteFillObject}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / bannerWidth);
              setCurrentBannerIndex(newIndex);
            }}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Find <Text style={{color: colors.secondary}}>Premium Services</Text>{'\n'}Near You
            </Text>
            <View style={styles.heroLocation}>
              <Ionicons name="location" size={18} color="#FFF" />
              <Text style={styles.heroSubtitle}>Enter City or Location</Text>
            </View>
          </View>
          
          {/* Pagination Lines */}
          <View style={styles.paginationContainer}>
            {bannerImages.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationLine, 
                  currentBannerIndex === index && styles.paginationLineActive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Search Bar Container - overlaps hero slightly less due to new height */}
        <AnimatedFadeIn 
          style={styles.searchContainer}
          delay={200}
          duration={500}
        >
          <SearchBar onSearchPress={() => navigation?.navigate('SearchResults')} />
        </AnimatedFadeIn>

        {/* Special Offers Section */}
        <AnimatedFadeIn delay={300} duration={500}>
          <View style={styles.promoContainer}>
            <LinearGradient
              colors={colors.promoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoCard}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Summer Special! 🚀</Text>
                <Text style={styles.promoText}>Get 20% off all AC Repair and Plumbing services this week.</Text>
                <TouchableOpacity style={styles.promoBtn}>
                  <Text style={styles.promoBtnText}>Claim Now</Text>
                </TouchableOpacity>
              </View>
              <Ionicons name="gift" size={80} color="rgba(255,255,255,0.1)" style={styles.promoDecoration} />
            </LinearGradient>
          </View>
        </AnimatedFadeIn>


        {/* Main Categories Section */}
        {loading ? (
          <View style={{ height: 400, justifyContent: 'center' }}>
            <PremiumLoader message="Fetching best services for you..." />
          </View>
        ) : (
          <AnimatedFadeIn
            delay={300}
            duration={500}
          >
            <View style={styles.mainCategoriesWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mainCategoriesScroll}
              >
                {mainCategories.length > 0 ? (
                  mainCategories.map((cat, index) => (
                    <CategoryItem 
                      key={cat.id || Math.random().toString()}
                      item={cat} 
                      type="square"
                      index={index}
                      onPress={() => navigation?.navigate('SearchResults', { query: cat.name })}
                    />
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', width: '100%', padding: 20, color: '#999' }}>No categories found.</Text>
                )}
              </ScrollView>
            </View>

            {/* Top Categories Section */}
            {topCategories.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Top Categories</Text>
                  <TouchableOpacity onPress={() => navigation?.navigate('CategoriesTab')}>
                    <Text style={styles.seeAll}>View All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.topCategoriesGrid}>
                  {topCategories.map((cat, index) => (
                    <CategoryItem 
                      key={cat.id || Math.random().toString()} 
                      item={cat} 
                      type="wide"
                      index={index}
                      onPress={() => navigation?.navigate('SearchResults', { query: cat.name })}
                    />
                  ))}
                </View>
              </>
            )}

            {/* Featured Businesses Section */}
            <View style={[styles.sectionHeader, { marginTop: 12 }]}>
              <Text style={styles.sectionTitle}>Featured Businesses</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredBusinessScroll}
            >
              {featuredBusinesses.length > 0 ? (
                featuredBusinesses.map((biz, index) => (
                  <BusinessCard 
                    key={biz.id || Math.random().toString()} 
                    business={biz} 
                    horizontal={true}
                    index={index}
                    onPress={() => navigation?.navigate('BusinessDetails', { business: biz })}
                  />
                ))
              ) : (
                <Text style={{ padding: 20, color: '#999' }}>No featured businesses right now.</Text>
              )}
            </ScrollView>

            {/* Trending Services */}
            <View style={[styles.sectionHeader, { marginTop: 12 }]}>
              <Text style={styles.sectionTitle}>Trending Near You <Ionicons name="flame" size={18} color="#EF4444" /></Text>
            </View>
            <View style={styles.trendingContainer}>
               <TouchableOpacity style={styles.trendingBadge} onPress={() => navigation?.navigate('SearchResults', { query: 'AC Repair' })}>
                 <Text style={styles.trendingText}>❄️ AC Repair</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.trendingBadge} onPress={() => navigation?.navigate('SearchResults', { query: 'Deep Cleaning' })}>
                 <Text style={styles.trendingText}>✨ Deep Cleaning</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.trendingBadge} onPress={() => navigation?.navigate('SearchResults', { query: 'Pest Control' })}>
                 <Text style={styles.trendingText}>🐛 Pest Control</Text>
               </TouchableOpacity>
            </View>
          </AnimatedFadeIn>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFB', 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  menuBtn: {
    padding: 6,
    marginRight: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
  logoIconBg: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  webNavLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginLeft: 24,
  },
  activeNavLink: {
    color: colors.primary,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 24,
  },
  signUpText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  heroSection: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    height: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 56 : 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Platform.OS === 'web' ? 66 : 48,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 15,
    letterSpacing: -1.5,
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  paginationLine: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 3,
  },
  paginationLineActive: {
    backgroundColor: '#FFF',
    width: 40,
  },
  subNavbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subNavbarContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  subNavLink: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSubNavLink: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeSubNavText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    marginTop: -55,
    zIndex: 10,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 20,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  categoriesSection: {
    paddingVertical: 10,
  },
  categoriesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.8,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  topCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  featuredBusinessScroll: {
    paddingHorizontal: 8,
    paddingBottom: 20,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  promoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  promoCard: {
    margin: 10,
    borderRadius: 32,
    padding: 32,
    minHeight: 220,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  promoText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 25,
    maxWidth: '85%',
    fontWeight: '700',
    marginBottom: 24,
  },
  promoBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  promoBtnText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  promoDecoration: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    opacity: 0.15,
    transform: [{ rotate: '-15deg' }]
  },
  trendingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
  },
  trendingBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  trendingText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 65,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 12,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 15,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownTriangle: {
    position: 'absolute',
    top: -10,
    right: 14,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dropdownName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  dropdownRole: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginVertical: 4,
  },
});


export default HomeScreen;
