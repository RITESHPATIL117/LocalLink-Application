import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const ReportsScreen = ({ navigation }) => {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleReviewCase = (report) => {
    Haptics.selectionAsync();
    Alert.alert(
      "Review Management",
      `Action for ${report.type}: ${report.entity}\n\nReported by: ${report.reporter}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Dismiss", 
          onPress: () => processReport(report.id, 'Dismissed'),
          style: 'destructive'
        },
        { 
          text: "Mark Resolved", 
          onPress: () => processReport(report.id, 'Resolved') 
        }
      ]
    );
  };

  const processReport = async (id, status) => {
    try {
      await adminService.updateReportStatus(id, status);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: status } : r));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Case ${id} marked as ${status}`
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Action failed' });
    }
  };

  const fetchReports = async () => {
    try {
      const res = await adminService.getReports();
      setReports(res.data || []);
    } catch (e) {
      console.log('Error fetching reports:', e);
    } finally {
      setLoading(false);
    }
  };
  const renderReport = ({ item }) => {
    const severityColor = item.severity === 'Critical' ? '#EF4444' : item.severity === 'High' ? '#F59E0B' : '#10B981';
    
    return (
      <View style={[styles.reportCard, { borderLeftColor: severityColor }]}>
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
        
        <View style={[styles.cardFooter, { borderTopWidth: 0, paddingTop: 12 }]}>
          <View style={[styles.badge, { backgroundColor: `${severityColor}15` }]}>
            <Text style={[styles.badgeText, { color: severityColor }]}>
              {item.severity.toUpperCase()} Priority
            </Text>
          </View>

          {item.status === 'Pending' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleReviewCase(item)}>
              <Text style={styles.actionBtnText}>Review Case</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.resolvedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{marginRight: 4}}/>
              <Text style={styles.resolvedText}>{item.status}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

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
             <Text style={styles.metricVal}>{reports.filter(r => r.status === 'Pending').length}</Text>
             <Text style={styles.metricLabel}>Pending Action</Text>
          </View>
          <View style={styles.metricCard}>
             <Ionicons name="shield-checkmark" size={24} color="#10B981" />
             <Text style={styles.metricVal}>{reports.filter(r => r.status === 'Resolved').length + 145}</Text>
             <Text style={styles.metricLabel}>Resolved (30d)</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Recent Flagged Content</Text>
          <FlatList
            data={reports}
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
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
