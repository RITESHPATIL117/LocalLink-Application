import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';
import { LinearGradient } from 'expo-linear-gradient';

const LeadsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  
  const filters = ['All', 'New', 'Contacted', 'Closed'];

  useEffect(() => {
    if (isFocused) {
      fetchLeads();
    }
  }, [isFocused]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let fetchedLeads = [];

      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const leadsRes = await leadService.getLeadsByBusiness(biz.id);
            const leads = leadsRes.data || [];
            
            const mappedLeads = leads.map(l => ({
              ...l,
              id: l.id || Math.random().toString(),
              customer: l.customerName || 'Potential Client',
              service: biz.name || 'General Inquiry',
              time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recently',
              rawDate: l.createdAt ? new Date(l.createdAt) : new Date(),
              status: l.status ? (l.status.charAt(0).toUpperCase() + l.status.slice(1)) : 'New',
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
            }));
            fetchedLeads = [...fetchedLeads, ...mappedLeads];
          } catch (e) {
            // Ignore error per biz
          }
        })
      );
      
      // Sort newest first
      fetchedLeads.sort((a, b) => b.rawDate - a.rawDate);
      setAllLeads(fetchedLeads);
    } catch (e) {
      console.log('Error fetching leads:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => {
      const matchesSearch = lead.customer.toLowerCase().includes(search.toLowerCase()) || 
                           lead.service.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || lead.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allLeads, search, activeFilter]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return '#4F46E5';
      case 'Contacted': return '#F59E0B';
      case 'Closed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const renderLeadItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 100} duration={500}>
      <TouchableOpacity 
        style={styles.leadCard} 
        onPress={() => navigation.navigate('LeadDetails', { lead: item })}
      >
        <View style={styles.leadHeader}>
          <Image source={{ uri: item.avatar }} style={styles.leadAvatar} />
          <View style={styles.leadMainInfo}>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.serviceName}>{item.service}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.leadFooter}>
          <View style={styles.timeArea}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.actionLink}>
            <Text style={styles.actionText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Service Leads</Text>
          <Text style={styles.subtitle}>You have {allLeads.filter(l => l.status === 'New').length} new requests</Text>
        </View>
        <View style={styles.iconBg}>
          <Ionicons name="people" size={24} color={colors.primary} />
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search leads by name or service..." 
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.filterArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
                {filter}
              </Text>
              {filter !== 'All' && filter === 'New' && allLeads.filter(l => l.status === 'New').length > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountText}>{allLeads.filter(l => l.status === 'New').length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : allLeads.length === 0 ? (
        <AnimatedFadeIn style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="mail-open" size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Inbox is Empty</Text>
          <Text style={styles.emptyDesc}>When customers request quotes or book your services, they will appear right here.</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchLeads}>
            <Ionicons name="refresh" size={18} color={colors.primary} />
            <Text style={styles.refreshBtnText}>Refresh Inbox</Text>
          </TouchableOpacity>
        </AnimatedFadeIn>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          renderItem={renderLeadItem}
          contentContainerStyle={styles.listArea}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.noSearchMatch}>
              <Ionicons name="search-outline" size={64} color="#E5E7EB" />
              <Text style={styles.emptyText}>No leads found matching your search.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  title: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '600' },
  iconBg: { width: 48, height: 48, borderRadius: 16, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 24, marginVertical: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827', fontWeight: '500' },
  filterArea: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FFF',
    borderRadius: 20, marginHorizontal: 4, borderWidth: 1, borderColor: '#E5E7EB',
  },
  activeFilterChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  activeFilterChipText: { color: '#FFF' },
  filterCountBadge: { backgroundColor: '#FFF', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  filterCountText: { fontSize: 11, color: colors.primary, fontWeight: '900' },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listArea: { paddingHorizontal: 24, paddingBottom: 60 },
  leadCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#64748B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 3,
  },
  leadHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  leadAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#F3F4F6' },
  leadMainInfo: { flex: 1, marginLeft: 14 },
  customerName: { fontSize: 16, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  serviceName: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  leadFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  timeArea: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 13, color: '#9CA3AF', marginLeft: 6, fontWeight: '500' },
  actionLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${colors.primary}10`, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  actionText: { fontSize: 13, fontWeight: '800', color: colors.primary, marginRight: 4 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -60 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
  emptyDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 },
  refreshBtnText: { color: colors.primary, fontSize: 15, fontWeight: '800', marginLeft: 8 },
  
  noSearchMatch: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyText: { marginTop: 16, fontSize: 15, color: '#9CA3AF', fontWeight: '600', textAlign: 'center' },
});

export default LeadsScreen;
