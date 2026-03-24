import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessService from '../../services/businessService';

const BusinessesScreen = ({ navigation }) => {
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

  const renderBusiness = ({ item }) => (
    <TouchableOpacity 
      style={styles.bizCard}
      onPress={() => navigation.navigate('BusinessDetails', { businessId: item.id })}
    >
      <Image 
        source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200' }} 
        style={styles.bizImage} 
      />
      <View style={styles.bizContent}>
        <View style={styles.bizHeader}>
          <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#ECFDF5' : '#FFFBEB' }]}>
            <Text style={[styles.statusText, { color: item.status === 'active' ? '#10B981' : '#F59E0B' }]}>
              {item.status?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.bizCategory}>{item.category_name || 'General Service'}</Text>
        <View style={styles.bizFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.footerText}>{item.rating || '0.0'}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.footerText} numberOfLines={1}>{item.address || 'Local'}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" style={{ alignSelf: 'center', marginRight: 10 }} />
    </TouchableOpacity>
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
        <ActivityIndicator size="large" color="#1F2937" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBusiness}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No businesses found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  refreshBtn: { padding: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  searchSection: { padding: 20, paddingBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#E5E7EB', marginRight: 10 },
  activeTab: { backgroundColor: '#1F2937' },
  tabText: { fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#FFF' },
  list: { padding: 20, paddingBottom: 40 },
  bizCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bizImage: { width: 80, height: 80, borderRadius: 12, margin: 10 },
  bizContent: { flex: 1, paddingVertical: 12, paddingRight: 10 },
  bizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bizName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  bizCategory: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  bizFooter: { flexDirection: 'row', alignItems: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  footerText: { fontSize: 12, color: '#6B7280', marginLeft: 4, maxWidth: 100 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, fontSize: 18, color: '#9CA3AF', fontWeight: '600' }
});

export default BusinessesScreen;
