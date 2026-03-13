import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

// Dummy list of provider's local businesses
const dummyListings = [
  {
    id: '1',
    name: 'SuperFast Plumbing',
    category: 'Home Services',
    location: 'Downtown City Center',
    status: 'Active',
    rating: '4.8',
    views: '1.2k',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=300',
  },
  {
    id: '2',
    name: 'Precision Pipe Fixing',
    category: 'Home Services',
    location: 'Westside Suburbs',
    status: 'Pending',
    rating: '0.0',
    views: '0',
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=300',
  }
];

const MyListingsScreen = ({ navigation }) => {
  const renderListing = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.businessName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusBadge, item.status === 'Active' ? styles.statusActive : styles.statusPending]}>
            <Text style={[styles.statusText, item.status === 'Active' ? styles.statusActiveText : styles.statusPendingText]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.categoryText}>{item.category} • {item.location}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color={colors.primary} />
            <Text style={styles.statText}>{item.views} Views</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBusiness')}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyListings}
        keyExtractor={(item) => item.id}
        renderItem={renderListing}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 4,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusActiveText: {
    color: '#10B981',
  },
  statusPendingText: {
    color: '#F59E0B',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    backgroundColor: `${colors.primary}10`,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 12,
  },
  editBtnText: {
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 6,
  },
  deleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  }
});

export default MyListingsScreen;
