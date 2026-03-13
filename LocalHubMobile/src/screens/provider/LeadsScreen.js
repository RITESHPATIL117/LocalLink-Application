import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummyLeads = [
  {
    id: '1',
    user: 'Amit Sharma',
    service: 'Plumbing Repair',
    date: 'Today, 10:30 AM',
    message: 'I have a leaking pipe under the kitchen sink. Need someone urgently.',
    status: 'New',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
  },
  {
    id: '2',
    user: 'Neha Gupta',
    service: 'Bathroom Installation',
    date: 'Yesterday, 04:15 PM',
    message: 'Looking for quotes to renovate my master bathroom.',
    status: 'Contacted',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
  },
  {
    id: '3',
    user: 'Vikas Patil',
    service: 'Drain Unblocking',
    date: '10 Mar 2026',
    message: 'Main drain is completely blocked. When can you come?',
    status: 'Closed',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150',
  }
];

const LeadsScreen = () => {
  const renderLead = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'New' ? styles.badgeNew : item.status === 'Contacted' ? styles.badgeContacted : styles.badgeClosed
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'New' ? styles.textNew : item.status === 'Contacted' ? styles.textContacted : styles.textClosed
          ]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.serviceBox}>
        <Ionicons name="construct-outline" size={16} color={colors.primary} />
        <Text style={styles.serviceText}>{item.service}</Text>
      </View>
      
      <Text style={styles.messageText} numberOfLines={2}>
        "{item.message}"
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.replyBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#FFF" />
          <Text style={styles.replyBtnText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbound Leads</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
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
  filterBtn: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeNew: { backgroundColor: '#EEF2FF' },
  badgeContacted: { backgroundColor: '#FEF3C7' },
  badgeClosed: { backgroundColor: '#F3F4F6' },
  textNew: { color: '#4F46E5', fontSize: 11, fontWeight: '700' },
  textContacted: { color: '#D97706', fontSize: 11, fontWeight: '700' },
  textClosed: { color: '#6B7280', fontSize: 11, fontWeight: '700' },
  serviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  replyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  replyBtnText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default LeadsScreen;
