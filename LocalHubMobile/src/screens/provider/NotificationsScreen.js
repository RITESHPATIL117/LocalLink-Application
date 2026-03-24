import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const dummyNotifications = [
  {
    id: '1',
    title: 'New Lead Received!',
    message: 'Amit Sharma is interested in your Plumbing services.',
    time: '2 mins ago',
    type: 'lead',
    icon: 'people',
    unread: true,
  },
  {
    id: '2',
    title: 'Listing Approved!',
    message: 'Your business "SuperFast Plumbing" is now live.',
    time: '1 hour ago',
    type: 'system',
    icon: 'checkmark-circle',
    unread: false,
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '₹1,200 has been added to your balance.',
    time: 'Yesterday',
    type: 'payment',
    icon: 'wallet',
    unread: false,
  },
];

const NotificationsScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, item.unread && styles.unreadItem]}>
      <View style={[styles.iconContainer, { backgroundColor: item.type === 'lead' ? '#EEF2FF' : item.type === 'payment' ? '#ECFDF5' : '#FFFBEB' }]}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.type === 'lead' ? '#4F46E5' : item.type === 'payment' ? '#10B981' : '#F59E0B'} 
        />
      </View>
      <View style={styles.content}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listArea}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  markRead: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  listArea: { paddingBottom: 40 },
  notificationItem: {
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    alignItems: 'center',
    position: 'relative',
  },
  unreadItem: { backgroundColor: '#FFF3EE' },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  messageText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  unreadDot: {
    position: 'absolute',
    right: 12,
    top: '50%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: -5,
  }
});

export default NotificationsScreen;
