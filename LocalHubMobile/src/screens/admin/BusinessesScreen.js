import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const BusinessesScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  // Deep-link from Categories
  useEffect(() => {
    if (route.params?.categoryId) {
        setFilter(route.params.categoryId.toString());
    }
  }, [route.params?.categoryId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBusinesses(true);
    }, [])
  );

  const fetchBusinesses = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await adminService.getAllBusinesses();
      setBusinesses(res.data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      if (!isSilent) Toast.show({ type: 'error', text1: 'Sync Failed', text2: 'Could not fetch platform data.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const isSuspending = currentStatus !== 'suspended';
    const newStatus = isSuspending ? 'Suspended' : 'Active';
    
    Alert.alert(
      `${isSuspending ? 'Suspend' : 'Activate'} Business`,
      `Are you sure you want to mark this business as ${newStatus.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isSuspending ? 'Suspend' : 'Activate', 
          style: isSuspending ? 'destructive' : 'default',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await adminService.updateBusinessStatus(id, newStatus);
              setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: newStatus.toLowerCase() } : b));
              Toast.show({ type: 'success', text1: 'Status Updated', text2: `Business is now ${newStatus}.` });
            } catch (e) {
              Toast.show({ type: 'error', text1: 'Action Failed', text2: 'Could not update status.' });
            }
          }
        }
      ]
    );
  };

  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          biz.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    if (filter === 'Active' || filter === 'Pending') return matchesSearch && (biz.status === filter.toLowerCase() || (filter === 'Active' && biz.is_verified === 1));
    
    // Check if filter is a category ID
    return matchesSearch && (biz.category_id?.toString() === filter || biz.status === filter.toLowerCase());
  });

  const renderBusiness = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 50} duration={600}>
      <TouchableOpacity 
        style={styles.bizCard}
        activeOpacity={0.9}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('BusinessDetails', { business: item });
        }}
      >
        <Image 
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600' }} 
          style={styles.bizImage} 
        />
        <View style={styles.bizContent}>
          <View style={styles.bizHeader}>
            <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity 
                onPress={() => toggleStatus(item.id, item.status)}
                style={[styles.statusBadge, { backgroundColor: item.status === 'suspended' ? '#FEF2F2' : '#ECFDF5' }]}
            >
              <View style={[styles.statusDot, { backgroundColor: item.status === 'suspended' ? '#EF4444' : '#10B981' }]} />
              <Text style={[styles.statusText, { color: item.status === 'suspended' ? '#EF4444' : '#10B981' }]}>
                {item.status?.toUpperCase()}
              </Text>
            </TouchableOpacity>
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
        <View style={styles.actionColumn}>
          <TouchableOpacity 
            style={[styles.moderateBtn, item.status === 'suspended' && styles.activateBtn]} 
            onPress={() => toggleStatus(item.id, item.status)}
          >
            <Ionicons 
                name={item.status === 'suspended' ? "checkmark-circle" : "ban"} 
                size={18} 
                color="#FFF" 
            />
          </TouchableOpacity>
          <View style={styles.chevronWrapper}>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </View>
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
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, fontWeight: '600' },
  actionColumn: { justifyContent: 'center', alignItems: 'center', paddingLeft: 10, gap: 12 },
  moderateBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', shadowColor: '#EF4444', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  activateBtn: { backgroundColor: '#10B981', shadowColor: '#10B981' },
});

export default BusinessesScreen;
