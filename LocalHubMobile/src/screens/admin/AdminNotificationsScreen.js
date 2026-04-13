import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import notificationService from '../../services/notificationService';
import leadService from '../../services/leadService';

const toTime = (d) => {
  if (!d) return 'Recently';
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return 'Recently';
  return t.toLocaleString();
};

const AdminNotificationsScreen = () => {
  const [rows, setRows] = useState([]);

  const fetchRows = useCallback(async () => {
    try {
      const [bizRes, notifRes] = await Promise.all([
        adminService.getAllBusinesses().catch(() => ({ data: [] })),
        notificationService.getNotifications().catch(() => ({ data: [] })),
      ]);
      const businesses = bizRes?.data || [];
      const apiNotifs = (notifRes?.data || []).map((n, idx) => ({
        id: String(n.id || `sys-${idx}`),
        title: n.title || 'System Notification',
        message: n.message || n.description || 'New platform activity.',
        createdAt: n.createdAt || n.created_at || new Date().toISOString(),
        unread: !n.read,
      }));

      const enquiryRows = [];
      await Promise.all(
        businesses.map(async (b) => {
          try {
            const lr = await leadService.getLeadsByBusiness(b.id);
            const leads = lr?.data || [];
            leads
              .filter((l) => {
                const s = String(l.status || '').toLowerCase();
                return !s || s === 'new' || s === 'pending';
              })
              .forEach((l) => {
                enquiryRows.push({
                  id: `enq-${l.id}`,
                  title: 'New Quick Enquiry',
                  message: `${l.customerName || 'Customer'} requested ${b.name || 'service'}.`,
                  createdAt: l.createdAt || new Date().toISOString(),
                  unread: true,
                });
              });
          } catch (_e) {}
        })
      );

      const merged = [...enquiryRows, ...apiNotifs].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setRows(merged);
    } catch (_e) {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const markAllRead = () => setRows((p) => p.map((r) => ({ ...r, unread: false })));

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.clearBtn}>
          <Ionicons name="checkmark-done-circle" size={18} color={colors.primary} />
          <Text style={styles.clearText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={42} color="#94A3B8" />
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.unread && styles.cardUnread]}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.unread ? <View style={styles.dot} /> : null}
            </View>
            <Text style={styles.msg}>{item.message}</Text>
            <Text style={styles.time}>{toTime(item.createdAt)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  clearBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#FFF3EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  clearText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  list: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#EDF2F7', padding: 14, marginBottom: 12 },
  cardUnread: { borderColor: `${colors.primary}44`, backgroundColor: '#FFFAF7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  msg: { color: '#475569', fontSize: 13, fontWeight: '600', marginTop: 6 },
  time: { color: '#94A3B8', fontSize: 11, fontWeight: '700', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '700' },
});

export default AdminNotificationsScreen;

