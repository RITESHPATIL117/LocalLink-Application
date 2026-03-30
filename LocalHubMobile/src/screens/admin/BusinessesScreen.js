import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessService from '../../services/businessService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const BusinessesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await businessService.getAllBusinesses();
      setBusinesses(res.data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      Toast.show({ type: 'error', text1: 'Sync Failed', text2: 'Could not fetch platform data.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          biz.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' ? true : biz.status === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const renderBusiness = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 50} duration={600}>
      <TouchableOpacity 
        style={styles.bizCard}
        activeOpacity={0.9}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('BusinessDetails', { businessId: item.id });
        }}
      >
        <Image 
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600' }} 
          style={styles.bizImage} 
        />
        <View style={styles.bizContent}>
          <View style={styles.bizHeader}>
            <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#ECFDF5' : '#FFFBEB' }]}>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#10B981' : '#F59E0B' }]} />
              <Text style={[styles.statusText, { color: item.status === 'active' ? '#10B981' : '#F59E0B' }]}>
                {item.status?.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.bizCategory}>{item.category_name || 'General Service'}</Text>
          
          <View style={styles.bizFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.footerText}>{item.rating || '0.0'}</Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="location-outline" size={12} color="#64748B" />
              <Text style={styles.footerText} numberOfLines={1}>{item.address?.split(',').shift() || 'Local'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.chevronWrapper}>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Businesses</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchBusinesses}>
          <Ionicons name="refresh" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search businesses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {['All', 'Active', 'Pending'].map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.tab, filter === t && styles.activeTab]}
            onPress={() => setFilter(t)}
          >
            <Text style={[styles.tabText, filter === t && styles.activeTabText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.list}>
          <SkeletonLoader width="100%" height={100} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={100} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={100} borderRadius={24} style={{ marginBottom: 16 }} />
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={item => (item.id || Math.random()).toString()}
          renderItem={renderBusiness}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="business-outline" size={48} color={colors.primary} />
              </View>
              <Text style={styles.emptyText}>No Businesses Found</Text>
              <Text style={styles.emptyDesc}>Try adjusting your search or filters to see more results.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  refreshBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  searchSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, borderRadius: 18, height: 54, borderWidth: 1.5, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 12, gap: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  activeTab: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontWeight: '800', color: '#64748B', fontSize: 13, textTransform: 'uppercase' },
  activeTabText: { color: '#FFF' },
  
  list: { padding: 20, paddingBottom: 100 },
  bizCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 28, padding: 12, marginBottom: 16, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  bizImage: { width: 80, height: 80, borderRadius: 18 },
  bizContent: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  bizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  bizName: { fontSize: 18, fontWeight: '900', color: '#1E293B', flex: 1, marginRight: 8, letterSpacing: -0.5 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  bizCategory: { fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 10 },
  bizFooter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#64748B', marginLeft: 4, fontWeight: '800' },
  chevronWrapper: { justifyContent: 'center', paddingHorizontal: 8 },
  
  emptyState: { alignItems: 'center', marginTop: 60, padding: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, fontWeight: '600' }
});

export default BusinessesScreen;
