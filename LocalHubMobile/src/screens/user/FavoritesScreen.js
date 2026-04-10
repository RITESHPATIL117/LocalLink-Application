import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import BusinessCard from '../../components/BusinessCard';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import { useFavorites } from '../../hooks/useFavorites';

const CATEGORIES = ['All', 'Home Services', 'Personal Care', 'Cleaning', 'Repair'];

const FavoritesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const numColumns = isWeb ? (width > 1200 ? 3 : 2) : 1;
  
  const { favorites, loading } = useFavorites();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Filtering Logic
  const filteredFavorites = useMemo(() => {
    let result = favorites;
    
    // Grouping by tab logic (mock category matching based on string inclusion)
    if (activeTab !== 'All') {
      result = result.filter(b => b.category?.toLowerCase() === activeTab.toLowerCase());
    }

    if (search.trim()) {
      result = result.filter(b => 
        b.name?.toLowerCase().includes(search.toLowerCase()) || 
        b.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [favorites, activeTab, search]);

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      
      {/* ─── Premium Header ─── */}
      <View style={styles.header}>
        <LinearGradient 
          colors={['#FFF', '#F9FAFB']} 
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
              <Ionicons name="menu" size={26} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>My Favorites</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{favorites.length} Saved</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="heart-half-outline" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {favorites.length > 0 && (
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#94A3B8" />
                <TextInput 
                  placeholder="Search your saved places..." 
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#94A3B8"
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {favorites.length > 0 && (
            <View style={styles.tabsWrapper}>
              <FlatList 
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={item => item}
                contentContainerStyle={styles.tabsContent}
                renderItem={({ item }) => {
                  const active = activeTab === item;
                  return (
                    <TouchableOpacity 
                      style={[styles.tabButton, active && styles.activeTabButton]}
                      onPress={() => {
                         Haptics.selectionAsync();
                         setActiveTab(item);
                      }}
                    >
                      <Text style={[styles.tabText, active && styles.activeTabText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </LinearGradient>
      </View>
      
      {/* ─── Content Area ─── */}
      {favorites.length === 0 && !loading ? (
        
        // ─── Stunning Empty State ───
        <AnimatedFadeIn duration={600} style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="heart" size={80} color="#EF4444" />
            <View style={styles.floatingStar1}>
               <Ionicons name="star" size={24} color="#F59E0B" />
            </View>
            <View style={styles.floatingStar2}>
               <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Nothing feels like home yet</Text>
          <Text style={styles.emptyDesc}>
            Found a local service you love? Tap the heart icon to save them for quick booking next time.
          </Text>
          <TouchableOpacity 
            style={styles.exploreBtn} 
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={[colors.primary, '#4338CA']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.exploreBtnGradient}>
              <Ionicons name="search" size={20} color="#FFF" />
              <Text style={styles.exploreBtnText}>Discover Services</Text>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedFadeIn>

      ) : (

        // ─── Favorites Grid ───
        <FlatList
          key={numColumns}
          data={filteredFavorites}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noSearchMatch}>
              <Ionicons name="search-outline" size={60} color="#E5E7EB" />
              <Text style={styles.noMatchText}>No matching favorites found.</Text>
            </View>
          }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  
  header: { 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9',
  },
  headerGradient: {
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  menuBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  titleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  countBadge: { backgroundColor: `${colors.primary}10`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  countText: { fontSize: 10, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },
  notifBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  
  searchSection: { paddingHorizontal: 20, marginBottom: 16 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', paddingHorizontal: 16, height: 50,
    borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9',
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  
  tabsWrapper: { marginBottom: 4 },
  tabsContent: { paddingHorizontal: 20, gap: 8 },
  tabButton: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 14, backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  activeTabButton: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFF' },

  listContent: {
    padding: 10, paddingBottom: 60,
    maxWidth: 1200, alignSelf: 'center', width: '100%',
  },
  
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, marginTop: -40,
  },
  emptyIconBg: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, position: 'relative',
    shadowColor: '#EF4444', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 5,
  },
  floatingStar1: { position: 'absolute', top: 10, right: 10, transform: [{ rotate: '15deg' }] },
  floatingStar2: { position: 'absolute', bottom: 20, left: 10, transform: [{ rotate: '-15deg' }] },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
  emptyDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 40, paddingHorizontal: 10 },
  
  exploreBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  exploreBtnGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 18, gap: 10 },
  exploreBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  noSearchMatch: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  noMatchText: { marginTop: 16, fontSize: 16, color: '#9CA3AF', fontWeight: '700' },
});

export default FavoritesScreen;
