import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummyReports = [
  { id: '1', type: 'Flagged Review', entity: '"Fake Service" on SuperFast Plumbing', reporter: 'Priya Desai', date: '2 hours ago', status: 'Pending', severity: 'High' },
  { id: '2', type: 'Suspicious Listing', entity: 'Metro Electricians', reporter: 'Amit Sharma', date: '5 hours ago', status: 'Resolved', severity: 'Low' },
  { id: '3', type: 'User Conduct', entity: '@vikram.s', reporter: 'System Automod', date: '1 day ago', status: 'Pending', severity: 'Critical' },
];

const ReportsScreen = ({ navigation }) => {
  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <View style={styles.reportTypeWrapper}>
          <Ionicons 
            name={item.type.includes('Review') ? 'chatbox-ellipses' : item.type.includes('Listing') ? 'business' : 'person'} 
            size={16} 
            color="#6B7280" 
          />
          <Text style={styles.reportType}>{item.type}</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      
      <Text style={styles.entityText}>{item.entity}</Text>
      
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Reported By:</Text>
        <Text style={styles.metaValue}>{item.reporter}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={[styles.badge, item.severity === 'Critical' ? styles.badgeCrit : item.severity === 'High' ? styles.badgeHigh : styles.badgeLow]}>
          <Text style={[styles.badgeText, item.severity === 'Critical' ? styles.badgeCritText : item.severity === 'High' ? styles.badgeHighText : styles.badgeLowText]}>
            {item.severity.toUpperCase()} Priority
          </Text>
        </View>

        {item.status === 'Pending' ? (
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Review Case</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.resolvedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{marginRight: 4}}/>
            <Text style={styles.resolvedText}>Resolved</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Reports</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={18} color="#1F2937" />
          <Text style={styles.downloadBtnText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.metricsWrapper}>
          <View style={styles.metricCard}>
             <Ionicons name="warning" size={24} color="#F59E0B" />
             <Text style={styles.metricVal}>12</Text>
             <Text style={styles.metricLabel}>Pending Action</Text>
          </View>
          <View style={styles.metricCard}>
             <Ionicons name="shield-checkmark" size={24} color="#10B981" />
             <Text style={styles.metricVal}>148</Text>
             <Text style={styles.metricLabel}>Resolved (30d)</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Recent Flagged Content</Text>
          <FlatList
            data={dummyReports}
            keyExtractor={item => item.id}
            renderItem={renderReport}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  downloadBtnText: {
    color: '#1F2937',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },
  metricsWrapper: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  metricVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  listSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  entityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCrit: { backgroundColor: '#FEF2F2' },
  badgeHigh: { backgroundColor: '#FFFBEB' },
  badgeLow: { backgroundColor: '#ECFDF5' },
  badgeCritText: { color: '#EF4444', fontSize: 10, fontWeight: '800' },
  badgeHighText: { color: '#F59E0B', fontSize: 10, fontWeight: '800' },
  badgeLowText: { color: '#10B981', fontSize: 10, fontWeight: '800' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolvedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  }
});

export default ReportsScreen;
