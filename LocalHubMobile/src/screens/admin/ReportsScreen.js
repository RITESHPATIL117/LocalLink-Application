import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import SkeletonLoader from '../../components/SkeletonLoader';
import { LinearGradient } from 'expo-linear-gradient';

const ReportsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
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
  const renderReport = ({ item, index }) => {
    const severityColor = item.severity === 'Critical' ? '#EF4444' : item.severity === 'High' ? '#F59E0B' : '#10B981';
    
    return (
      <AnimatedFadeIn delay={index * 100} duration={600}>
        <TouchableOpacity 
          style={[styles.reportCard, { borderLeftColor: severityColor }]}
          activeOpacity={0.9}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.reportTypeWrapper}>
              <View style={[styles.typeIconBg, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons 
                  name={item.type.includes('Review') ? 'chatbox-ellipses' : item.type.includes('Listing') ? 'business' : 'person'} 
                  size={16} 
                  color="#64748B" 
                />
              </View>
              <Text style={styles.reportType}>{item.type}</Text>
            </View>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          
          <Text style={styles.entityText}>{item.entity}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>REPORTER</Text>
            <Text style={styles.metaValue}>{item.reporter}</Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={[styles.badge, { backgroundColor: `${severityColor}12` }]}>
              <View style={[styles.dot, { backgroundColor: severityColor }]} />
              <Text style={[styles.badgeText, { color: severityColor }]}>
                {item.severity.toUpperCase()}
              </Text>
            </View>
  
            {item.status === 'Pending' ? (
              <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => handleReviewCase(item)}
              >
                <Text style={styles.actionBtnText}>Review Case</Text>
                <Ionicons name="chevron-forward" size={12} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <View style={styles.resolvedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{marginRight: 4}}/>
                <Text style={styles.resolvedText}>{item.status}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </AnimatedFadeIn>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.metricsWrapper}>
          {loading ? (
            <>
              <SkeletonLoader width={(width - 56) / 2} height={120} borderRadius={24} />
              <SkeletonLoader width={(width - 56) / 2} height={120} borderRadius={24} />
            </>
          ) : (
            <>
              <View style={styles.metricCard}>
                 <View style={[styles.metricIconBg, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                 </View>
                 <Text style={styles.metricVal}>{reports.filter(r => r.status === 'Pending').length}</Text>
                 <Text style={styles.metricLabel}>Pending Action</Text>
              </View>
              <View style={styles.metricCard}>
                 <View style={[styles.metricIconBg, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                 </View>
                 <Text style={styles.metricVal}>{reports.filter(r => r.status === 'Resolved').length + 145}</Text>
                 <Text style={styles.metricLabel}>Resolved (30d)</Text>
              </View>
            </>
          )}
        </View>
 
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Flagged Content Logs</Text>
          {loading ? (
            <View style={{ gap: 16 }}>
              <SkeletonLoader width="100%" height={160} borderRadius={24} />
              <SkeletonLoader width="100%" height={160} borderRadius={24} />
            </View>
          ) : (
            <FlatList
              data={reports}
              keyExtractor={item => (item.id || Math.random()).toString()}
              renderItem={renderReport}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                   <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                   <Text style={styles.emptyText}>All systems normal. No pending reports.</Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  downloadBtnText: { color: '#475569', fontWeight: '800', marginLeft: 8, fontSize: 13 },
  
  metricsWrapper: { flexDirection: 'row', padding: 24, gap: 16 },
  metricCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 28, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  metricIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricVal: { fontSize: 28, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  metricLabel: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 2 },
  
  listSection: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 20, letterSpacing: -0.5 },
  reportCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, marginBottom: 16, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderLeftWidth: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reportTypeWrapper: { flexDirection: 'row', alignItems: 'center' },
  typeIconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  reportType: { fontSize: 13, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  entityText: { fontSize: 17, fontWeight: '900', color: '#1E293B', marginBottom: 16, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  metaLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '900', marginRight: 8, letterSpacing: 1 },
  metaValue: { fontSize: 13, fontWeight: '800', color: '#475569' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900', marginRight: 6 },
  resolvedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#DCFCE7' },
  resolvedText: { fontSize: 12, fontWeight: '900', color: '#10B981' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 14, color: '#94A3B8', fontWeight: '600', textAlign: 'center' },
});

export default ReportsScreen;
