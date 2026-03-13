import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../styles/colors';
import SearchBar from '../../components/SearchBar';
import CategoryItem from '../../components/CategoryItem';
import BusinessCard from '../../components/BusinessCard';

const { width, height } = Dimensions.get('window');

// Main Categories matching the mockup
const mainCategories = [
  { id: '1', name: 'Food &\nRestaurants', icon: 'fast-food', color: '#F59E0B' },
  { id: '2', name: 'Health &\nMedical', icon: 'medkit', color: '#3B82F6' },
  { id: '3', name: 'Home\nServices', icon: 'home', color: '#10B981' },
  { id: '4', name: 'Local\nShops', icon: 'storefront', color: '#EF4444' },
  { id: '5', name: 'Education', icon: 'school', color: '#22C55E' },
  { id: '6', name: 'Beauty\n& Care', icon: 'color-palette', color: '#EC4899' },
];

const topCategories = [
  { id: '1', name: 'Automobile', icon: 'car-sport', color: '#EF4444' },
  { id: '2', name: 'Real Estate', icon: 'business', color: '#64748B' },
  { id: '3', name: 'Events &\nWeddings', icon: 'ribbon', color: '#EC4899' },
  { id: '4', name: 'Pet Services', icon: 'paw', color: '#F59E0B' },
  { id: '5', name: 'Fitness &\nSports', icon: 'barbell', color: '#F97316' },
  { id: '6', name: 'Travel &\nTransport', icon: 'airplane', color: '#EAB308' },
];

const featuredBusinesses = [
  {
    id: '1',
    name: 'SuperFast Plumbing',
    category: 'Home Services',
    rating: '4.9',
    address: 'Sangli',
    image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18?q=80&w=400', 
  },
  {
    id: '2',
    name: 'City Hospital',
    category: 'Health & Medical',
    rating: '4.8',
    address: 'Sangli',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400', 
  },
  {
    id: '3',
    name: 'Beauty Parlour',
    category: 'Beauty',
    rating: '4.7',
    address: 'Sangli',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
  },
  {
    id: '4',
    name: 'Car Repair',
    category: 'Automobile',
    rating: '4.6',
    address: 'Sangli',
    image: 'https://images.unsplash.com/photo-1632823465306-cdbb235256e6?q=80&w=400',
  }
];

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
  
  // Calculate banner container width dynamically
  const bannerWidth = Math.min(width, MAX_APP_WIDTH);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
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
        <View style={styles.searchContainer}>
          <SearchBar onSearchPress={() => navigation?.navigate('SearchResults')} />
        </View>

        {/* Main Categories Section */}
        <View style={styles.mainCategoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mainCategoriesScroll}
          >
            {mainCategories.map((cat) => (
              <CategoryItem 
                key={cat.id}
                item={cat} 
                type="square"
                onPress={() => navigation?.navigate('SearchResults', { query: cat.name })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Top Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('CategoriesTab')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topCategoriesGrid}>
          {topCategories.map((cat) => (
            <CategoryItem 
              key={cat.id} 
              item={cat} 
              type="wide"
              onPress={() => navigation?.navigate('SearchResults', { query: cat.name })}
            />
          ))}
        </View>

        {/* Featured Businesses Section */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Featured Businesses</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredBusinessScroll}
        >
          {featuredBusinesses.map((biz) => (
            <BusinessCard 
              key={biz.id} 
              business={biz} 
              horizontal={true}
              onPress={() => navigation?.navigate('BusinessDetails', { business: biz })}
            />
          ))}
        </ScrollView>

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
