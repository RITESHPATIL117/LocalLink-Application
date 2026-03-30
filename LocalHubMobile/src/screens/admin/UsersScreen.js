import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../../components/SkeletonLoader';

const dummyUsers = [
  { id: '1', name: 'Ritesh Patil', email: 'ritesh@localhub.com', role: 'admin', status: 'Active', joined: 'Jan 10, 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
  { id: '2', name: 'Amit Sharma', email: 'amit@service.com', role: 'provider', status: 'Active', joined: 'Feb 15, 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
  { id: '3', name: 'Neha Gupta', email: 'neha.g@gmail.com', role: 'customer', status: 'Active', joined: 'Mar 01, 2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150' },
  { id: '4', name: 'Vikram Singh', email: 'vikram.s@yahoo.com', role: 'customer', status: 'Suspended', joined: 'Mar 12, 2026', avatar: null },
  { id: '5', name: 'Priya Desai', email: 'priya.cleaning@gmail.com', role: 'provider', status: 'Active', joined: 'Mar 20, 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
];

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data || []);
    } catch (e) {
      console.log('Fetch users err:', e);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load users.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await adminService.updateUserStatus(id, newStatus);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Status Updated', text2: `User is now ${newStatus}.` });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Update Failed', text2: 'Could not change user status.' });
    }
  };

  const filters = ['All', 'customer', 'provider', 'admin', 'Suspended'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 'All' ? true :
      activeFilter === 'Suspended' ? user.status === 'Suspended' :
      user.role === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#8B5CF6';
      case 'provider': return '#3B82F6';
      case 'customer': default: return '#10B981';
    }
  };

  const renderUser = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 50} duration={600}>
      <View style={styles.userCard}>
        <View style={[styles.roleIndicator, { backgroundColor: getRoleColor(item.role) }]} />
        <View style={styles.cardMain}>
          <View style={styles.avatarWrapper}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{(item.name || 'U').charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={[styles.statusDot, { backgroundColor: item.status === 'Suspended' ? '#EF4444' : '#10B981' }]} />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
            <View style={styles.metaRow}>
               <View style={[styles.roleLabel, { backgroundColor: `${getRoleColor(item.role)}15` }]}>
                 <Text style={[styles.roleLabelText, { color: getRoleColor(item.role) }]}>{(item.role || 'user').toUpperCase()}</Text>
               </View>
               <Text style={styles.userJoined}>• Joined {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.moreBtn}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Toast.show({ text1: 'Cloud Dashboard', text2: `Connecting to ${item.name}'s logs...` });
            }}
          >
            <Ionicons name="analytics-outline" size={16} color="#64748B" />
            <Text style={styles.actionText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleUserStatus(item.id, item.status);
            }}
          >
            <Ionicons 
                name={item.status === 'Suspended' ? "refresh-circle-outline" : "ban-outline"} 
                size={16} 
                color={item.status === 'Suspended' ? '#10B981' : '#EF4444'} 
            />
            <Text style={[styles.actionText, { color: item.status === 'Suspended' ? '#10B981' : '#EF4444' }]}>
                {item.status === 'Suspended' ? 'Enable' : 'Suspend'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { borderRightWidth: 0 }]} 
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Toast.show({ text1: 'Secure Mail', text2: `Opening console for ${item.email}` });
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color="#64748B" />
            <Text style={styles.actionText}>Audit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>User Accounts</Text>
          <Text style={styles.headerSubtitle}>Manage platform access & roles</Text>
        </View>
        <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Ionicons name="person-add" size={18} color="#FFF" />
          <Text style={styles.addBtnText}>Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          data={filters}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filterChip, activeFilter === item && styles.activeFilterChip]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {loading ? (
        <View style={styles.listContainer}>
          <SkeletonLoader width="100%" height={120} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={120} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={120} borderRadius={24} style={{ marginBottom: 16 }} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="people-outline" size={48} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptyDesc}>Try adjusting your search or filters.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  addBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 6, fontSize: 13 },

  searchContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 52, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1E293B', fontWeight: '600' },

  filtersWrapper: { marginBottom: 12 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5 },
  activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeFilterText: { color: '#FFF' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  userCard: { backgroundColor: '#FFF', borderRadius: 28, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 2, overflow: 'hidden', position: 'relative' },
  roleIndicator: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%', opacity: 0.8 },
  cardMain: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: { backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#64748B' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#FFF' },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  userEmail: { fontSize: 13, color: '#94A3B8', marginBottom: 6, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roleLabel: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleLabelText: { fontSize: 9, fontWeight: '900' },
  userJoined: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  moreBtn: { padding: 8 },

  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F8FAFC', backgroundColor: '#FBFCFE' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  actionText: { fontSize: 12, fontWeight: '800', color: '#64748B', marginLeft: 8 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 8, letterSpacing: -0.5 },
  emptyDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', maxWidth: '80%' }
});

export default UsersScreen;
