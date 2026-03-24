import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
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

  const renderBanner = ({ item }) => (
    <View style={[styles.bannerContainer, { width: bannerWidth }]}>
      <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bannerOverlay}
      />
    </View>
  );

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
            <View style={styles.logoIconBg}>
              <Ionicons name="pie-chart" size={16} color="#FFF" />
            </View>
            <Text style={styles.logoText}>Local<Text style={{color: '#F97316'}}>Hub</Text></Text>
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
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
              <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Banner Area with Image Slider */}
        <View style={[styles.heroSection, { height: SLIDER_HEIGHT }]}>
          <FlatList
            ref={flatListRef}
            data={bannerImages}
            renderItem={renderBanner}
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
              Find <Text style={{color: colors.primary}}>Local Services</Text>{'\n'}Near You
            </Text>
            <View style={styles.heroLocation}>
              <Ionicons name="location" size={18} color="#FFF" />
              <Text style={styles.heroSubtitle}>Enter City or Location</Text>
            </View>
          </View>
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {bannerImages.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  currentBannerIndex === index && styles.paginationDotActive
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
              colors={[colors.primary, '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoBanner}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Summer Special! 🚀</Text>
                <Text style={styles.promoText}>Get 20% off all AC Repair and Plumbing services this week.</Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Claim Now</Text>
                </TouchableOpacity>
              </View>
              <Ionicons name="gift" size={60} color="rgba(255,255,255,0.2)" style={styles.promoIconBg} />
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
    paddingVertical: 12,
    backgroundColor: '#FFF',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuBtn: {
    padding: 4,
    marginRight: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto', // Push nav links to the right
  },
  logoIconBg: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 20, 
    marginRight: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  webNavLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 24,
  },
  activeNavLink: {
    color: colors.primary,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 24,
  },
  signUpText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  },
  heroContent: {
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 32,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: Platform.OS === 'web' ? 58 : 42,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 30,
  },
  searchContainer: {
    marginTop: -40, // Deeper overlap for premium look
    zIndex: 3,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 20,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  mainCategoriesWrapper: {
    marginTop: 40,
    marginBottom: 30,
  },
  mainCategoriesScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
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
    paddingBottom: 16,
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
  promoBanner: {
    borderRadius: 24,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  promoText: {
    color: '#FFF',
    fontSize: 15,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 22,
    maxWidth: 400,
  },
  promoButton: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  promoButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  promoIconBg: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
    transform: [{ rotate: '-15deg' }]
  },
  trendingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
  },
  trendingBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  trendingText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  }
});

export default HomeScreen;
