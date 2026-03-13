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
const MAX_APP_WIDTH = 480;

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
      setMainCategories(allCats.slice(0, 6)); 
      setTopCategories(allCats.slice(6, 12));
      
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
        
        {/* Web-like Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBg}>
              <Ionicons name="pie-chart" size={16} color="#FFF" />
            </View>
            <Text style={styles.logoText}>Local<Text style={{color: '#F97316'}}>Hub</Text></Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}><Text style={[styles.navLink, styles.activeNavLink]}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}><Text style={styles.navLink}>Categories</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SearchResults', { query: '' })}><Text style={styles.navLink}>Businesses</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Pricing')}><Text style={styles.navLink}>Pricing</Text></TouchableOpacity>
            
            {!isAuthenticated ? (
              <>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.navLink}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
                <Text style={styles.navLink}>Hi, {user?.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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

        {/* Main Categories Section */}
        {loading ? (
          <View style={{ paddingHorizontal: 16, marginTop: 25 }}>
            {/* Main Cats Skeleton */}
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
              <Skeleton width={80} height={100} radius={16} />
              <View style={{ width: 12 }} />
              <Skeleton width={80} height={100} radius={16} />
              <View style={{ width: 12 }} />
              <Skeleton width={80} height={100} radius={16} />
            </View>
            
            <Skeleton width={150} height={24} radius={4} />
            <View style={{ height: 16 }} />
            {/* Top Cats Skeleton Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
               <View style={{ width: '48%', marginBottom: 12 }}><Skeleton width="100%" height={80} radius={12} /></View>
               <View style={{ width: '48%', marginBottom: 12 }}><Skeleton width="100%" height={80} radius={12} /></View>
               <View style={{ width: '48%', marginBottom: 12 }}><Skeleton width="100%" height={80} radius={12} /></View>
               <View style={{ width: '48%', marginBottom: 12 }}><Skeleton width="100%" height={80} radius={12} /></View>
            </View>
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
                  mainCategories.map((cat) => (
                    <CategoryItem 
                      key={cat.id || Math.random().toString()}
                      item={cat} 
                      type="square"
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
                  {topCategories.map((cat) => (
                    <CategoryItem 
                      key={cat.id || Math.random().toString()} 
                      item={cat} 
                      type="wide"
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
                featuredBusinesses.map((biz) => (
                  <BusinessCard 
                    key={biz.id || Math.random().toString()} 
                    business={biz} 
                    horizontal={true}
                    onPress={() => navigation?.navigate('BusinessDetails', { business: biz })}
                  />
                ))
              ) : (
                <Text style={{ padding: 20, color: '#999' }}>No featured businesses right now.</Text>
              )}
            </ScrollView>
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
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  logoIconBg: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 20, 
    marginRight: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  navLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 14,
  },
  activeNavLink: {
    color: colors.primary,
  },
  signUpBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 14,
  },
  signUpText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 6
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 24,
  },
  searchContainer: {
    marginTop: -28, // Overlap the hero section
    zIndex: 3,
    paddingHorizontal: 10,
  },
  mainCategoriesWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
  mainCategoriesScroll: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  },
  featuredBusinessScroll: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});

export default HomeScreen;
