import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { LinearGradient } from 'expo-linear-gradient';

const MyListingsScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchListings();
    }
  }, [isFocused]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await businessOwnerService.getBusinesses();
      setListings(response.data || []);
    } catch (error) {
      console.log('Error fetching my businesses', error);
    } finally {
      setLoading(false);
    }
  };

  const renderListing = ({ item, index }) => (
    <AnimatedFadeIn duration={400} delay={index * 100}>
      <View style={styles.card}>
        <Image 
          source={{ uri: item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=300' }} 
          style={styles.cardImage} 
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.businessName} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.statusBadge, item.status === 'Active' ? styles.statusActive : styles.statusPending]}>
              <Text style={[styles.statusText, item.status === 'Active' ? styles.statusActiveText : styles.statusPendingText]}>
                {item.status || 'Active'}
              </Text>
            </View>
          </View>
          <Text style={styles.categoryText}>{item.category} {item.address ? `• ${item.address}` : ''}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{item.rating || 'New'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.views || 0} Views</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color={colors.primary} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Listings</Text>
          <Text style={styles.headerSubtitle}>{listings.length} active service{listings.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBusiness')}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Create New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : listings.length === 0 ? (
        <AnimatedFadeIn style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="storefront" size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Listings Yet</Text>
          <Text style={styles.emptyDesc}>Start reaching thousands of local customers today by creating your first service listing.</Text>
          <TouchableOpacity 
             style={styles.createFirstBtn}
             onPress={() => navigation.navigate('AddBusiness')}
             activeOpacity={0.8}
          >
            <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.gradientBtn}>
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.createFirstBtnText}>Create First Listing</Text>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedFadeIn>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderListing}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 4 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 6, fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFF', borderRadius: 24, marginBottom: 20, overflow: 'hidden',
    shadowColor: '#64748B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardImage: { width: '100%', height: 160, backgroundColor: '#F3F4F6' },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  businessName: { fontSize: 20, fontWeight: '800', color: '#111827', flex: 1, marginRight: 10, letterSpacing: -0.5 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusPending: { backgroundColor: '#FFFBEB' },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusActiveText: { color: '#10B981' },
  statusPendingText: { color: '#F59E0B' },
  categoryText: { fontSize: 14, color: '#6B7280', marginBottom: 16, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  statText: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginLeft: 6 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
  editBtn: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12, backgroundColor: `${colors.primary}10`, paddingVertical: 12, justifyContent: 'center', borderRadius: 14 },
  editBtnText: { color: colors.primary, fontWeight: '800', marginLeft: 6, fontSize: 14 },
  deleteBtn: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -40 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
  emptyDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  createFirstBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  createFirstBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default MyListingsScreen;
