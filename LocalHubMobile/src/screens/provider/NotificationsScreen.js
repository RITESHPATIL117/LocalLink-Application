import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import notificationService from '../../services/notificationService';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';

const { width } = Dimensions.get('window');

const fmtTime = (d) => {
  if (!d) return 'Recently';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleString();
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();

  const fetchNotifications = useCallback(async () => {
    try {
      const [notifRes, bizRes] = await Promise.all([
        notificationService.getNotifications().catch(() => ({ data: [] })),
        businessOwnerService.getBusinesses().catch(() => ({ data: [] })),
      ]);
      const notifRows = notifRes?.data || [];
      const businesses = bizRes?.data || [];

      const leadRows = [];
      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const lr = await leadService.getLeadsByBusiness(biz.id);
            const leads = lr?.data || [];
            leads
              .filter((l) => {
                const s = String(l.status || '').toLowerCase();
                return !s || s === 'new' || s === 'pending';
              })
              .forEach((l) => {
                leadRows.push({
                  id: `lead-${l.id}`,
                  title: 'New Quick Enquiry',
                  message: `${l.customerName || 'Customer'} is interested in ${biz.name || 'your service'}.`,
                  time: fmtTime(l.createdAt),
                  createdAt: l.createdAt || new Date().toISOString(),
                  type: 'lead',
                  icon: 'flash',
                  unread: true,
                });
              });
          } catch (_e) {}
        })
      );

      const apiNotifs = (notifRows || []).map((n, idx) => ({
        id: String(n.id || `notif-${idx}`),
        title: n.title || 'Notification',
        message: n.message || n.description || 'You have a new update.',
        time: fmtTime(n.createdAt || n.created_at),
        createdAt: n.createdAt || n.created_at || new Date().toISOString(),
        type: n.type || 'system',
        icon: n.type === 'payment' ? 'wallet' : n.type === 'lead' ? 'people' : 'checkmark-circle',
        unread: !n.read,
      }));

      const merged = [...leadRows, ...apiNotifs].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setNotifications(merged);
    } catch (_e) {
      setNotifications([]);
    }
  }, []);

  React.useEffect(() => {
    if (isFocused) fetchNotifications();
  }, [isFocused, fetchNotifications]);

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const renderItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 80} duration={600}>
      <TouchableOpacity 
        style={[styles.notifCard, item.unread && styles.unreadCard]}
        onPress={() => {
            Haptics.selectionAsync();
            // In a real app, mark this specific one as read
        }}
      >
        <View style={[styles.iconWrapper, { backgroundColor: item.type === 'lead' ? '#F0F9FF' : item.type === 'payment' ? '#F0FDF4' : '#FFFBEB' }]}>
          <Ionicons 
            name={item.icon} 
            size={22} 
            color={item.type === 'lead' ? '#0EA5E9' : item.type === 'payment' ? '#22C55E' : '#D97706'} 
          />
        </View>
        
        <View style={styles.notifContent}>
          <View style={styles.notifMeta}>
            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.timeLabel}>{item.time}</Text>
          </View>
          <Text style={styles.messagePreview} numberOfLines={2}>{item.message}</Text>
          
          <View style={styles.cardFooter}>
             <View style={styles.typeBadge}>
                <View style={[styles.typeDot, { backgroundColor: item.type === 'lead' ? '#0EA5E9' : item.type === 'payment' ? '#22C55E' : '#D97706' }]} />
                <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
             </View>
             {item.unread && (
                <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.newBadge}>
                    <Text style={styles.newText}>NEW</Text>
                </LinearGradient>
             )}
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>System Alerts</Text>
        <TouchableOpacity 
          style={styles.markBtn} 
          onPress={handleMarkAllRead}
        >
          <Ionicons name="checkmark-done-circle" size={18} color={colors.primary} />
          <Text style={styles.markRead}>Clear Unread</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>All Clear!</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1.5, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  markBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3EE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  markRead: { color: colors.primary, fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  listContainer: { padding: 20, paddingBottom: 100 },
  notifCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 28, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2 },
  unreadCard: { backgroundColor: '#F8FAFC', borderColor: `${colors.primary}20` },
  
  iconWrapper: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  notifContent: { flex: 1 },
  notifMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  notifTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', flex: 1, marginRight: 10 },
  timeLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '800' },
  messagePreview: { fontSize: 14, color: '#64748B', lineHeight: 20, fontWeight: '600', marginBottom: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 6 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 },
  
  newBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  newText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#94A3B8', fontWeight: '800', marginTop: 16 }
});

export default NotificationsScreen;
