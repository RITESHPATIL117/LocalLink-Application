import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, FlatList, ActivityIndicator, RefreshControl, Platform, Animated, useWindowDimensions, Modal, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';


import colors from '../../styles/colors';
import SearchBar from '../../components/SearchBar';
import BusinessCard from '../../components/BusinessCard';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';
import categoryService from '../../services/categoryService';
import businessService from '../../services/businessService';
import LeadGatekeeper from '../../components/LeadGatekeeper';
import PremiumLoader from '../../components/PremiumLoader';
import reviewService from '../../services/reviewService';
import Toast from 'react-native-toast-message';

const MAX_APP_WIDTH = 800;

// ─── Fallback Data ─────────────────────────────────────────────────────────────

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Cleaning',     icon: 'sparkles-outline',   color: '#3B82F6', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300' },
  { id: '2', name: 'Plumbing',     icon: 'water-outline',      color: '#3B82F6', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=300' },
  { id: '3', name: 'Electrical',   icon: 'flash-outline',      color: '#F59E0B', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300' },
  { id: '4', name: 'HVAC',         icon: 'snow-outline',       color: '#06B6D4', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=300' },
  { id: '5', name: 'Pet Care',     icon: 'paw-outline',        color: '#EC4899', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=300' },
  { id: '6', name: 'Automobile',   icon: 'car-sport-outline',  color: '#EF4444', image: 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=300' },
  { id: '7', name: 'Events',       icon: 'calendar-outline',   color: '#8B5CF6', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=300' },
  { id: '8', name: 'Health',       icon: 'fitness-outline',    color: '#10B981', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300' },
];

const FALLBACK_BUSINESSES = [
  {
    id: 'b1', name: 'Elite Plumbers', category: 'Plumbing', rating: '4.8',
    reviewsCount: 156, address: '123 Water St', tier: 'Diamond',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'b2', name: 'Sparky Electricians', category: 'Electrical', rating: '4.9',
    reviewsCount: 220, address: '456 Flow Ave', tier: 'Gold',
    image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    id: 'b3', name: 'Pest Control Pro', category: 'Pest', rating: '4.7',
    reviewsCount: 89, address: '789 Bug Way', tier: 'Silver',
    image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=400',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'b4', name: 'Glow Salon', category: 'Beauty', rating: '4.9',
    reviewsCount: 442, address: 'Saket, New Delhi', tier: 'Diamond',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
];

const BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000',
    tag: '🏠 Home Services',
    title: 'Expert Cleaning\nAt Your Doorstep',
    subtitle: 'Book in 60 seconds',
    cta: 'Book Now',
    ctaRoute: { name: 'SearchResults', params: { query: 'Cleaning' } },
  },
  {
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1000',
    tag: '⚡ Electrical',
    title: 'Certified Electricians\nAvailable 24/7',
    subtitle: 'Same-day service guaranteed',
    cta: 'Find Electrician',
    ctaRoute: { name: 'SearchResults', params: { query: 'Electrical' } },
  },
  {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?q=80&w=1000',
    tag: '💅 Beauty & Wellness',
    title: 'Top Salons\nNear You',
    subtitle: 'Pamper yourself today',
    cta: 'Explore Salons',
    ctaRoute: { name: 'SearchResults', params: { query: 'Beauty' } },
  },
  {
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1000',
    tag: '❄️ AC & Appliance',
    title: 'AC not cooling?\nWe fix it fast',
    subtitle: 'Trained & verified technicians',
    cta: 'Get Fixed',
    ctaRoute: { name: 'SearchResults', params: { query: 'AC Repair' } },
  },
];

const TRENDING = [
  { label: '❄️ AC Repair',        q: 'AC Repair' },
  { label: '🪠 Pipe Repair',      q: 'Plumbing' },
  { label: '✨ Deep Cleaning',    q: 'Deep Cleaning' },
  { label: '🐛 Pest Control',     q: 'Pest Control' },
  { label: '💇 Hair Styling',     q: 'Beauty' },
  { label: '🔌 Wiring Check',     q: 'Electrical' },
  { label: '🚗 Car Wash',         q: 'Car Wash' },
  { label: '🖌️ Wall Painting',    q: 'Painting' },
];

const HOW_IT_WORKS = [
  { step: '1', icon: 'search-outline',           color: '#3B82F6', title: 'Search',         desc: 'Find verified local service providers near you' },
  { step: '2', icon: 'calendar-outline',          color: '#10B981', title: 'Book',           desc: 'Choose a time slot and confirm your booking instantly' },
  { step: '3', icon: 'shield-checkmark-outline',  color: '#F59E0B', title: 'Get Served',     desc: 'Sit back while our professionals handle everything' },
  { step: '4', icon: 'star-outline',              color: '#EC4899', title: 'Rate & Review',  desc: 'Share your experience to help the community' },
];

const TESTIMONIALS = [
  { id: 't1', name: 'Anjali Patil', role: 'Homeowner, Sangli', text: '"Booked a plumber in under 2 minutes. Super fast, professional service!"', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { id: 't2', name: 'Rohit Desai', role: 'Shop Owner, Pune',   text: '"Their electricians fixed our wiring same day. Highly recommend!"',        rating: 5, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 't3', name: 'Priya Kumar', role: 'Working Mom, Nashik', text: '"Deep cleaning service was outstanding. The team was courteous and thorough."', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, onSeeAll, style }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
        <Text style={styles.seeAll}>View All</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    )}
  </View>
);

const CategoryPill = ({ item, onPress }) => {
  const fallbackMatch = FALLBACK_CATEGORIES.find(f => f.name === item.name) || FALLBACK_CATEGORIES[0];
  const finalImage = item.image || item.image_url || fallbackMatch.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300';
  const finalColor = item.color || fallbackMatch.color || '#3B82F6';
  const finalIcon = item.icon || fallbackMatch.icon || 'grid-outline';

  return (
    <TouchableOpacity style={styles.catPill} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.catImageContainer}>
        <Image source={{ uri: finalImage }} style={styles.catImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.catOverlay} />
      </View>
      <Text style={styles.catPillText} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const TestimonialCard = ({ item }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.testimonialStars}>
      {Array.from({ length: item.rating }).map((_, i) => (
        <Ionicons key={i} name="star" size={14} color="#F59E0B" />
      ))}
    </View>
    <Text style={styles.testimonialText}>{item.text}</Text>
    <View style={styles.testimonialAuthor}>
      <Image source={{ uri: item.avatar }} style={styles.testimonialAvatar} />
      <View>
        <Text style={styles.testimonialName}>{item.name}</Text>
        <Text style={styles.testimonialRole}>{item.role}</Text>
      </View>
    </View>
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [featuredBusinesses, setFeaturedBusinesses] = useState(FALLBACK_BUSINESSES);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Lead Modal State
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  
  const { leadCaptured } = useSelector(state => state.auth);

  const { width } = useWindowDimensions();
  const SLIDER_HEIGHT = width * 0.45;
  const isDesktop = width >= 768;
  const bannerWidth = Math.min(width, MAX_APP_WIDTH);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesRes, businessesRes, reviewsRes] = await Promise.all([
        categoryService.getCategories().catch(() => ({ data: [] })),
        businessService.getAllBusinesses({ featured: true }).catch(() => ({ data: [] })),
        reviewService.getTopReviews(5).catch(() => ({ data: [] })),
      ]);
      const apiCats = categoriesRes.data || [];
      const apiBiz  = businessesRes.data || [];
      const apiRevs = reviewsRes.data || [];

      if (apiCats.length > 0) setCategories(apiCats);
      if (apiBiz.length > 0) setFeaturedBusinesses(apiBiz);
      if (apiRevs.length > 0) {
        const processed = apiRevs.map(r => ({
          id: r.id.toString(),
          name: r.user_name,
          role: `${r.business_name} Customer`,
          text: `"${r.comment}"`,
          rating: r.rating,
          avatar: `https://ui-avatars.com/api/?name=${r.user_name}&background=random`
        }));
        setTestimonials(processed);
      }
    } catch (e) {
      // Silently fall back to mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, [fetchData]);

  const handleCategoryPress = (cat) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isAuthenticated || leadCaptured) {
      navigation.navigate('SearchResults', { query: cat.name });
    } else {
      setPendingCategory(cat);
      setLeadModalVisible(true);
    }
  };

  const handleLeadSuccess = () => {
    setLeadModalVisible(false);
    navigation.navigate('SearchResults', { query: pendingCategory?.name });
  };

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentBannerIndex + 1) % BANNERS.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentBannerIndex(next);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  const renderBanner = useMemo(() => ({ item }) => {
    const banner = item;
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={[styles.bannerContainer, { width: bannerWidth }]}
        onPress={() => navigation.navigate(banner.ctaRoute.name, banner.ctaRoute.params)}
      >
        <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.bannerTag}>
          <Text style={styles.bannerTagText}>{banner.tag}</Text>
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
          <View style={styles.bannerCta}>
            <Text style={styles.bannerCtaText}>{banner.cta}</Text>
            <Ionicons name="arrow-forward" size={14} color="#111827" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [bannerWidth]);

  const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ─ Header ─ */}
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        {!isDesktop && (
          <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={26} color="#111827" />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <View style={styles.logoIconBg}>
            <Ionicons name="location" size={15} color="#FFF" />
          </View>
          <Text style={styles.logoText}>Local<Text style={{ color: colors.secondary }}>Hub</Text></Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Support')}
          >
            <Ionicons name="notifications-outline" size={22} color="#374151" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          {isAuthenticated ? (
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
              <Image
                source={{ uri: user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random&size=100` }}
                style={styles.headerAvatar}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* ─ Greeting ─ */}
        <AnimatedFadeIn duration={400}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingText}>
                {greetingText()}{isAuthenticated && user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={colors.primary} />
                <Text style={styles.locationText}>Sangli, Maharashtra</Text>
                <Ionicons name="chevron-down" size={14} color={colors.primary} />
              </View>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* ─ Search ─ */}
        <AnimatedFadeIn delay={100} duration={500}>
          <View style={styles.searchWrapper}>
            <SearchBar onSearchPress={() => navigation.navigate('SearchResults')} />
          </View>
        </AnimatedFadeIn>

        {/* ─ Hero Banner ─ */}
        <AnimatedFadeIn delay={150} duration={500}>
          <View style={[styles.heroSection, { height: SLIDER_HEIGHT }]}>
            <FlatList
              ref={flatListRef}
              data={BANNERS}
              renderItem={renderBanner}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={StyleSheet.absoluteFillObject}
              onMomentumScrollEnd={(e) => {
                setCurrentBannerIndex(Math.round(e.nativeEvent.contentOffset.x / bannerWidth));
              }}
            />
            {/* Pagination */}
            <View style={styles.pagination}>
              {BANNERS.map((_, i) => (
                <View key={i} style={[styles.paginationDot, currentBannerIndex === i && styles.paginationDotActive]} />
              ))}
            </View>
          </View>
        </AnimatedFadeIn>

        {/* ─ Quick Actions ─ */}
        <AnimatedFadeIn delay={200}>
          <View style={styles.quickActionsRow}>
            {[
              { label: 'Book Service', icon: 'calendar-outline',       color: '#3B82F6', route: 'SearchResults' },
              { label: 'List Business', icon: 'business-outline',       color: '#10B981', route: 'Login' },
              { label: 'My Bookings',  icon: 'document-text-outline',  color: '#F59E0B', route: 'RequestsTab' },
              { label: 'Support',      icon: 'headset-outline',         color: '#8B5CF6', route: 'Support' },
            ].map(a => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickAction}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate(a.route);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${a.color}15` }]}>
                  <Ionicons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={styles.quickActionText}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedFadeIn>

        {/* ─ Promo Banner ─ */}
        <AnimatedFadeIn delay={250}>
          <View style={styles.promoWrapper}>
            <LinearGradient
              colors={[colors.primary, '#E65C00']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.promoCard}
            >
              <View style={styles.promoLeft}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>LIMITED OFFER</Text>
                </View>
                <Text style={styles.promoTitle}>Summer Special 🔥</Text>
                <Text style={styles.promoDesc}>20% off on AC Repair & Plumbing</Text>
                <TouchableOpacity style={styles.promoBtn} onPress={() => navigation.navigate('Pricing')}>
                  <Text style={styles.promoBtnText}>Claim Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Ionicons name="gift" size={90} color="rgba(255,255,255,0.12)" style={styles.promoIcon} />
            </LinearGradient>
          </View>
        </AnimatedFadeIn>

        {/* ─ Categories ─ */}
        <AnimatedFadeIn delay={300}>
          <SectionHeader
            title="Browse by Category"
            onSeeAll={() => navigation.navigate('CategoriesTab')}
          />
          <View style={styles.categoriesGrid}>
            {categories.map(cat => (
              <CategoryPill
                key={cat.id}
                item={cat}
                onPress={() => handleCategoryPress(cat)}
              />
            ))}
          </View>
        </AnimatedFadeIn>

        {/* ─ Featured Businesses ─ */}
        <AnimatedFadeIn delay={350}>
          <SectionHeader
            title="Featured Providers"
            onSeeAll={() => navigation.navigate('SearchResults', { query: '' })}
            style={{ marginTop: 8 }}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bizScroll}>
            {featuredBusinesses.map((biz, i) => (
              <BusinessCard
                key={biz.id || i}
                business={biz}
                compact
                index={i}
                onPress={() => navigation.navigate('BusinessDetails', { business: biz })}
              />
            ))}
          </ScrollView>
        </AnimatedFadeIn>

        {/* ─ Trending Now ─ */}
        <AnimatedFadeIn delay={400}>
          <SectionHeader title="🔥 Trending Now" style={{ marginTop: 8 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
            {TRENDING.map(t => (
              <TouchableOpacity
                key={t.q}
                style={styles.trendingChip}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('SearchResults', { query: t.q });
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.trendingText}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimatedFadeIn>

        {/* ─ How It Works ─ */}
        <AnimatedFadeIn delay={450}>
          <View style={styles.howItWorksSection}>
            <SectionHeader title="How It Works" />
            <View style={styles.stepsRow}>
              {HOW_IT_WORKS.map((s, i) => (
                <View key={s.step} style={styles.stepCard}>
                  <View style={[styles.stepIconBg, { backgroundColor: `${s.color}15` }]}>
                    <Ionicons name={s.icon} size={24} color={s.color} />
                  </View>
                  {i < HOW_IT_WORKS.length - 1 && <View style={styles.stepConnector} />}
                  <Text style={[styles.stepTitle, { color: s.color }]}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </AnimatedFadeIn>

        {/* ─ Trust Badges ─ */}
        <AnimatedFadeIn delay={500}>
          <View style={styles.trustRow}>
            {[
              { icon: 'shield-checkmark', label: 'Verified\nProviders',   color: '#10B981' },
              { icon: 'people',           label: '10,000+\nHappy Users',  color: '#3B82F6' },
              { icon: 'star',             label: '4.8 Avg\nRating',       color: '#F59E0B' },
              { icon: 'flash',            label: 'Same Day\nService',     color: '#EF4444' },
            ].map(b => (
              <View key={b.label} style={styles.trustBadge}>
                <Ionicons name={b.icon} size={24} color={b.color} />
                <Text style={styles.trustLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        </AnimatedFadeIn>

        {/* ─ Testimonials ─ */}
        <AnimatedFadeIn delay={550}>
          <SectionHeader title="What Customers Say ⭐" style={{ marginTop: 8 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.testimonialScroll}>
            {testimonials.map(t => <TestimonialCard key={t.id} item={t} />)}
          </ScrollView>
        </AnimatedFadeIn>

        {/* ─ List Your Business CTA ─ */}
        <AnimatedFadeIn delay={600}>
          <View style={styles.ctaSection}>
            <LinearGradient colors={['#111827', '#1F2937']} style={styles.ctaCard}>
              <Ionicons name="business" size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
              <Text style={styles.ctaTitle}>Grow Your Business</Text>
              <Text style={styles.ctaDesc}>
                Join 500+ local businesses on LocalHub. Get discovered, generate leads, and grow faster.
              </Text>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => navigation.navigate(isAuthenticated ? 'ProviderRoot' : 'Login')}
              >
                <Text style={styles.ctaBtnText}>List Your Business Free</Text>
                <Ionicons name="arrow-forward" size={18} color="#111827" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </AnimatedFadeIn>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ─── Category Lead Modal ─── */}
      <LeadGatekeeper
        visible={leadModalVisible}
        category={pendingCategory}
        onClose={() => setLeadModalVisible(false)}
        onSuccess={handleLeadSuccess}
      />
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { paddingBottom: 20 },
  scrollContentDesktop: { 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: MAX_APP_WIDTH,
    backgroundColor: '#FFF',
    // Add a slight shadow to the "page" on desktop
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 5,
  },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  headerDesktop: {
    paddingHorizontal: 40,
  },
  menuBtn: { padding: 6, borderRadius: 10, backgroundColor: '#F9FAFB' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIconBg: { backgroundColor: colors.primary, padding: 6, borderRadius: 10, marginRight: 8 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#111827', letterSpacing: -0.8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFF' },
  headerAvatar: { width: 38, height: 38, borderRadius: 12, borderWidth: 2, borderColor: colors.primary },
  loginBtn: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 12 },
  loginBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  // Greeting
  greetingRow: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, backgroundColor: '#FFF' },
  greetingText: { fontSize: 24, fontWeight: '900', color: '#111827' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 14, color: colors.primary, fontWeight: '700' },

  // Search
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },

  // Banner
  heroSection: { width: '100%', position: 'relative' },
  bannerContainer: { height: '100%', position: 'relative', overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%' },
  bannerTag: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  bannerTagText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  bannerContent: { position: 'absolute', bottom: 40, left: 20 },
  bannerTitle: { fontSize: 30, fontWeight: '900', color: '#FFF', lineHeight: 36, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: '600' },
  bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start' },
  bannerCtaText: { color: '#111827', fontWeight: '900', fontSize: 14 },
  pagination: { position: 'absolute', bottom: 16, flexDirection: 'row', alignSelf: 'center', gap: 6, width: '100%', justifyContent: 'center' },
  paginationDot: { width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  paginationDotActive: { width: 36, backgroundColor: '#FFF' },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  quickAction: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionText: { fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' },

  // Promo
  promoWrapper: { paddingHorizontal: 16, paddingVertical: 16 },
  promoCard: { borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', minHeight: 160 },
  promoLeft: { flex: 1 },
  promoBadge: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  promoBadgeText: { color: '#FFF', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  promoTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  promoDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: 18 },
  promoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 11, borderRadius: 14, alignSelf: 'flex-start' },
  promoBtnText: { color: colors.primary, fontWeight: '900', fontSize: 14 },
  promoIcon: { position: 'absolute', right: -20, bottom: -20 },

  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // Categories
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  catPill: { 
    width: (width - 44) / 4 - 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  catImageContainer: {
    width: '100%',
  },

  // Businesses
  bizScroll: { paddingHorizontal: 12, paddingBottom: 16, gap: 4 },

  // Trending
  trendingScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  trendingChip: {
    backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 24, borderWidth: 0,
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 16, elevation: 4,
  },
  trendingText: { color: '#374151', fontWeight: '700', fontSize: 14 },

  // How It Works
  howItWorksSection: { backgroundColor: '#FFF', marginVertical: 8, paddingBottom: 20 },
  stepsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 4 },
  stepCard: { flex: 1, alignItems: 'center', paddingHorizontal: 4, position: 'relative' },
  stepIconBg: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  stepConnector: { position: 'absolute', top: 26, right: -8, width: 16, height: 2, backgroundColor: '#E5E7EB' },
  stepTitle: { fontSize: 13, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  stepDesc: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 16, fontWeight: '500' },

  // Trust
  trustRow: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 20, paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6', gap: 8 },
  trustBadge: { flex: 1, alignItems: 'center', gap: 6 },
  trustLabel: { fontSize: 11, color: '#4B5563', fontWeight: '700', textAlign: 'center', lineHeight: 16 },

  // Testimonials
  testimonialScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  testimonialCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20, 
    width: Platform.OS === 'web' && width >= 768 ? (MAX_APP_WIDTH - 60) / 2 : width * 0.75,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  testimonialStars: { flexDirection: 'row', gap: 2, marginBottom: 10 },
  testimonialText: { fontSize: 14, color: '#4B5563', lineHeight: 22, fontStyle: 'italic', marginBottom: 16, fontWeight: '500' },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: 20 },
  testimonialName: { fontSize: 14, fontWeight: '800', color: '#111827' },
  testimonialRole: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },

  // Categories
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  catPill: { 
    width: (width - 44) / 4 - 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  catImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  catImage: { width: '100%', height: '100%' },
  catOverlay: { ...StyleSheet.absoluteFillObject, top: '40%' },
  catPillText: { fontSize: 11, fontWeight: '800', color: '#374151', marginTop: 6, textAlign: 'center' },

  // Businesses
  bizScroll: { paddingHorizontal: 12, paddingBottom: 16, gap: 4 },

  // Trending
  trendingScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  trendingChip: {
    backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 24, borderWidth: 0,
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 16, elevation: 4,
  },
  trendingText: { color: '#374151', fontWeight: '700', fontSize: 14 },

  // How It Works
  howItWorksSection: { backgroundColor: '#FFF', marginVertical: 8, paddingBottom: 20 },
  stepsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 4 },
  stepCard: { flex: 1, alignItems: 'center', paddingHorizontal: 4, position: 'relative' },
  stepIconBg: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  stepConnector: { position: 'absolute', top: 26, right: -8, width: 16, height: 2, backgroundColor: '#E5E7EB' },
  stepTitle: { fontSize: 13, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  stepDesc: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 16, fontWeight: '500' },

  // Trust
  trustRow: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 20, paddingHorizontal: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6', gap: 8 },
  trustBadge: { flex: 1, alignItems: 'center', gap: 6 },
  trustLabel: { fontSize: 11, color: '#4B5563', fontWeight: '700', textAlign: 'center', lineHeight: 16 },

  // Testimonials
  testimonialScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  testimonialCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20, 
    width: Platform.OS === 'web' && width >= 768 ? (MAX_APP_WIDTH - 60) / 2 : width * 0.75,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  testimonialStars: { flexDirection: 'row', gap: 2, marginBottom: 10 },
  testimonialText: { fontSize: 14, color: '#4B5563', lineHeight: 22, fontStyle: 'italic', marginBottom: 16, fontWeight: '500' },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: 20 },
  testimonialName: { fontSize: 14, fontWeight: '800', color: '#111827' },
  testimonialRole: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },

  // CTA
  ctaSection: { paddingHorizontal: 16, paddingVertical: 16 },
  ctaCard: { borderRadius: 24, padding: 28, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 10, textAlign: 'center' },
  ctaDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22, marginBottom: 24, fontWeight: '500' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  ctaBtnText: { color: '#111827', fontWeight: '900', fontSize: 16 },
});

export default HomeScreen;
