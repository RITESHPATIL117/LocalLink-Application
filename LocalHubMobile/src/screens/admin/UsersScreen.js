import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummyUsers = [
  { id: '1', name: 'Ritesh Patil', email: 'ritesh@localhub.com', role: 'admin', status: 'Active', joined: 'Jan 10, 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
  { id: '2', name: 'Amit Sharma', email: 'amit@service.com', role: 'provider', status: 'Active', joined: 'Feb 15, 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
  { id: '3', name: 'Neha Gupta', email: 'neha.g@gmail.com', role: 'customer', status: 'Active', joined: 'Mar 01, 2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150' },
  { id: '4', name: 'Vikram Singh', email: 'vikram.s@yahoo.com', role: 'customer', status: 'Suspended', joined: 'Mar 12, 2026', avatar: null },
  { id: '5', name: 'Priya Desai', email: 'priya.cleaning@gmail.com', role: 'provider', status: 'Active', joined: 'Mar 20, 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
];

const UsersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'customer', 'provider', 'admin', 'Suspended'];

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.cardMain}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
        )}
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userJoined}>Joined {item.joined}</Text>
        </View>

        <View style={styles.badgesWrapper}>
          <View style={[styles.roleBadge, { backgroundColor: `${getRoleColor(item.role)}15` }]}>
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>{item.role.toUpperCase()}</Text>
          </View>
          {item.status === 'Suspended' && (
            <View style={[styles.roleBadge, { backgroundColor: '#FEF2F2', marginTop: 4 }]}>
              <Text style={[styles.roleText, { color: '#EF4444' }]}>SUSPENDED</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="create-outline" size={16} color="#6B7280" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="mail-outline" size={16} color="#6B7280" />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
        {item.status === 'Suspended' ? (
          <TouchableOpacity style={[styles.actionBtn, { borderRightWidth: 0 }]}>
            <Ionicons name="refresh-outline" size={16} color="#10B981" />
            <Text style={[styles.actionText, { color: '#10B981' }]}>Restore</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { borderRightWidth: 0 }]}>
            <Ionicons name="ban-outline" size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Suspend</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="person-add" size={18} color="#FFF" />
          <Text style={styles.addBtnText}>Add User</Text>
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

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your search criteria.</Text>
          </View>
        }
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
    backgroundColor: '#1F2937', // Admin core color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 13,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#1F2937',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6B7280',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  userJoined: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  badgesWrapper: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  }
});

export default UsersScreen;
