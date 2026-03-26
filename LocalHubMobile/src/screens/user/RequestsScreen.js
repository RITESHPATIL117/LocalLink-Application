import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummyRequests = [
  { 
    id: '1', 
    businessName: 'SuperFast Plumbing', 
    service: 'Pipe Leak Repair', 
    status: 'Accepted', 
    date: 'Oct 24, 2026', 
    price: '₹1,200',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200'
  },
  { 
    id: '2', 
    businessName: 'Elite Electricians', 
    service: 'Full House Wiring Check', 
    status: 'Pending', 
    date: 'Oct 23, 2026', 
    price: 'Pending Quote',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=200'
  },
  { 
    id: '3', 
    businessName: 'Sparkle Cleaners', 
    service: 'Deep Kitchen Cleaning', 
    status: 'Completed', 
    date: 'Oct 20, 2026', 
    price: '₹2,500',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=200'
  },
];


const RequestsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState('All');
  
  const numColumns = width > 1024 ? 3 : width > 768 ? 2 : 1;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Completed': return '#3B82F6';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderRequest = ({ item }) => (
    <View style={[styles.requestCard, { width: `${100 / numColumns}%` - (numColumns > 1 ? 20 : 0) }]}>
      <View style={styles.cardInner}>
        <Image source={{ uri: item.image }} style={styles.bizImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.bizName}>{item.businessName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>
          </View>
          
          <Text style={styles.serviceText}>{item.service}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.footerText}>{item.date}</Text>
            </View>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>

          {item.status === 'Accepted' && (
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Requests</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Pending', 'Accepted', 'Completed']}
          keyExtractor={f => f}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item: f }) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, filter === f && styles.activeChip]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={filter === 'All' ? dummyRequests : dummyRequests.filter(r => r.status === filter)}
        keyExtractor={item => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyDesc}>When you request quotes from providers, they will appear here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: { 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  filterBar: { 
    paddingVertical: 12, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 12, 
    backgroundColor: '#F3F4F6', 
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  activeFilterText: { color: '#FFF' },
  list: { 
    padding: 10, 
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  requestCard: { 
    padding: 6,
  },
  cardInner: {
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bizImage: { width: 80, height: 80, borderRadius: 16 },
  cardContent: { flex: 1, marginLeft: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  bizName: { fontSize: 16, fontWeight: '800', color: '#111827' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  serviceText: { fontSize: 14, color: '#4B5563', marginBottom: 12, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#9CA3AF', marginLeft: 4, fontWeight: '500' },
  priceText: { fontSize: 15, fontWeight: '800', color: '#111827' },
  actionBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12, shadowColor: colors.primary, shadowOpacity: 0.2, shadowRadius: 8 },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 20 },
  emptyDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 10, paddingHorizontal: 40, lineHeight: 22 }
});

export default RequestsScreen;
