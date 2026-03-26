import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const dummyApprovals = [
  { id: '1', name: 'Elite Electricians', owner: 'Vikram Singh', category: 'Electrician', date: '2 hours ago', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=200' },
  { id: '2', name: 'Green Leaf Gardening', owner: 'Pooja Hegde', category: 'Landscaping', date: '5 hours ago', image: 'https://images.unsplash.com/photo-1592150621344-82841b999744?q=80&w=200' },
  { id: '3', name: 'Sparkle Cleaners', owner: 'Rahul Roy', category: 'Cleaning', date: 'Yesterday', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=200' },
];

const ApprovalsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingBusinesses();
      setData(res.data || []);
    } catch (e) {
      console.log('Fetch pending err:', e);
      Toast.show({ type: 'error', text1: 'Fetch Failed', text2: 'Could not load pending approvals.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type) => {
    if (type === 'approve') {
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
       try {
         await adminService.verifyBusiness(id);
         setData(prev => prev.filter(item => item.id !== id));
         Toast.show({ type: 'success', text1: 'Business Approved', text2: 'Listing is now live on LocalHub.' });
       } catch (e) {
         Toast.show({ type: 'error', text1: 'Error', text2: 'Could not verify business.' });
       }
    } else {
      Alert.alert(
        'Reject Listing',
        'Are you sure you want to reject this business listing?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reject', 
            style: 'destructive',
            onPress: () => {
               // For now rejection just removes from list (could be a delete call)
               setData(prev => prev.filter(item => item.id !== id));
               Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        ]
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 100} style={styles.card}>
      <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=400' }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bizName}>{item.name}</Text>
            <Text style={styles.ownerText}>Owner: {item.owner_name || 'Service Provider'}</Text>
          </View>
          <Text style={styles.dateText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</Text>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category_name || 'General'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.btn, styles.rejectBtn]} 
            onPress={() => handleAction(item.id, 'reject')}
          >
            <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.approveBtn]} 
            onPress={() => handleAction(item.id, 'approve')}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Approvals</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{data.length}</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={80} color="#10B981" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyDesc}>No new business listings pending approval.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginRight: 10 },
  countBadge: { backgroundColor: '#EF4444', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  list: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 120 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  bizName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  ownerText: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, flexDirection: 'row', height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 6 },
  rejectBtn: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FEE2E2' },
  approveBtn: { backgroundColor: '#10B981' },
  rejectBtnText: { color: '#EF4444', fontWeight: '700' },
  approveBtnText: { color: '#FFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginTop: 20 },
  emptyDesc: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }
});

export default ApprovalsScreen;
