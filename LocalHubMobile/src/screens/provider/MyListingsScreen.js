import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const getListingStatus = (item) => {
  if (item?.is_verified === 1) return 'Live';
  if (item?.is_verified === 2) return 'Suspended';
  return 'Pending';
};

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

  const renderListing = ({ item, index }) => {
    const listingStatus = getListingStatus(item);
    const isLive = listingStatus === 'Live';
    const isSuspended = listingStatus === 'Suspended';

    return (
    <AnimatedFadeIn duration={600} delay={index * 100}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.95}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('LeadDetails', { lead: item }); // Aligned with LeadDetailsScreen
        }}
      >
        <Image 
          source={{ uri: item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600' }} 
          style={styles.cardImage} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']} 
          style={styles.imageOverlay}
        >
          <View
            style={[
              styles.statusBadge,
              isLive ? styles.statusActive : isSuspended ? styles.statusSuspended : styles.statusPending
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isLive ? styles.statusActiveText : isSuspended ? styles.statusSuspendedText : styles.statusPendingText
              ]}
            >
              {listingStatus.toUpperCase()}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.businessName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingBadge}>
               <Ionicons name="star" size={12} color="#F59E0B" />
               <Text style={styles.ratingText}>{item.rating || 'New'}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
             <Ionicons name="location-outline" size={14} color="#64748B" />
             <Text style={styles.categoryText} numberOfLines={1}>{item.category} • {item.address || 'Local'}</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="eye-outline" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.views || 0} Views</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="flash-outline" size={14} color="#10B981" />
              <Text style={styles.statText}>High Impact</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Toast.show({ text1: 'Editor Console', text2: `Updating ${item.name}...` });
                }}
            >
              <Ionicons name="create-outline" size={18} color={colors.primary} />
              <Text style={styles.editBtnText}>Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.analyticsBtn}
                onPress={() => {
                  Haptics.selectionAsync();
                  navigation.navigate('MoreTab'); // Correct path for business analytics
                }}
            >
              <Ionicons name="stats-chart" size={18} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    Toast.show({ type: 'info', text1: 'Security Check', text2: 'Please use dashboard to delete listings.' });
                }}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );
  };

  const liveCount = listings.filter((item) => item?.is_verified === 1).length;

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Businesses</Text>
          <Text style={styles.headerSubtitle}>{liveCount} live service{liveCount !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBusiness')}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Add Business</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.listContainer}>
          <SkeletonLoader width="100%" height={280} borderRadius={32} style={{ marginBottom: 20 }} />
          <SkeletonLoader width="100%" height={280} borderRadius={32} style={{ marginBottom: 20 }} />
        </View>
      ) : listings.length === 0 ? (
        <AnimatedFadeIn style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="storefront" size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Expand Your Reach</Text>
          <Text style={styles.emptyDesc}>Start reaching thousands of local customers today by creating your first service business listing.</Text>
          <TouchableOpacity 
             style={styles.createFirstBtn}
             onPress={() => {
                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                 navigation.navigate('AddBusiness');
             }}
             activeOpacity={0.8}
          >
            <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.gradientBtn}>
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.createFirstBtnText}>Create Listing</Text>
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
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 4 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  addBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 6, fontSize: 13 },
  
  listContainer: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 32, marginBottom: 20, overflow: 'hidden', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardImage: { width: '100%', height: 180, backgroundColor: '#F1F5F9' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, height: 180, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  statusActive: { backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#10B981' },
  statusPending: { backgroundColor: 'rgba(255, 251, 235, 0.9)', borderColor: '#F59E0B' },
  statusText: { fontSize: 9, fontWeight: '900' },
  statusActiveText: { color: '#10B981' },
  statusPendingText: { color: '#F59E0B' },
  statusSuspended: { backgroundColor: 'rgba(254, 242, 242, 0.9)', borderColor: '#EF4444' },
  statusSuspendedText: { color: '#EF4444' },
  
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  businessName: { fontSize: 20, fontWeight: '900', color: '#1E293B', flex: 1, marginRight: 10, letterSpacing: -0.5 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FEF3C7' },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#B45309', marginLeft: 4 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  categoryText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  statChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 6 },
  statText: { fontSize: 12, fontWeight: '800', color: '#475569' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 16, gap: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: `${colors.primary}10`, height: 48, justifyContent: 'center', borderRadius: 14 },
  editBtnText: { color: colors.primary, fontWeight: '900', marginLeft: 8, fontSize: 13, textTransform: 'uppercase' },
  analyticsBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  deleteBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 40 },
  emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  emptyTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 12, textAlign: 'center', letterSpacing: -1 },
  emptyDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32, fontWeight: '500' },
  createFirstBtn: { width: '100%', borderRadius: 18, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, gap: 10 },
  createFirstBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900', textTransform: 'uppercase' },
});

export default MyListingsScreen;
