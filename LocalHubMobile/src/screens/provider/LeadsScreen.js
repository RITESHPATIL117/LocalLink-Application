import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const LeadsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'New', 'Contacted', 'Closed'];

  const leads = [
    { id: '1', customer: 'Amit Sharma', service: 'Plumbing Repair', time: '2 mins ago', status: 'New', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150' },
    { id: '2', customer: 'Neha Gupta', service: 'Kitchen Leak', time: '1 hour ago', status: 'New', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
    { id: '3', customer: 'Rajesh Kumar', service: 'Tap Install', time: '3 hours ago', status: 'Contacted', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150' },
    { id: '4', customer: 'Suresh Raina', service: 'Pipe Fix', time: 'Yesterday', status: 'Closed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customer.toLowerCase().includes(search.toLowerCase()) || 
                         lead.service.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || lead.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
        onPress={() => navigation.navigate('LeadDetails', { leadId: item.id })}
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
        <Text style={styles.title}>Service Leads</Text>
        <Text style={styles.subtitle}>You have {leads.filter(l => l.status === 'New').length} new requests</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search leads..." 
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
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
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLeadItem}
        contentContainerStyle={styles.listArea}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#E5E7EB" />
            <Text style={styles.emptyText}>No leads found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  pageHeader: { paddingHorizontal: 24, paddingVertical: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  searchSection: { paddingHorizontal: 24, marginVertical: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#111827' },
  filterArea: { marginBottom: 10 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  activeFilterChipText: { color: '#FFF' },
  listArea: { paddingHorizontal: 24, paddingBottom: 40 },
  leadCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  leadHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  leadAvatar: { width: 48, height: 48, borderRadius: 24 },
  leadMainInfo: { flex: 1, marginLeft: 12 },
  customerName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  serviceName: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '800' },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  timeArea: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#9CA3AF', marginLeft: 4 },
  actionLink: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 13, fontWeight: '700', color: colors.primary, marginRight: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#9CA3AF', fontWeight: '600' },
});

export default LeadsScreen;
