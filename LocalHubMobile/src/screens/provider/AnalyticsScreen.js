import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const AnalyticsScreen = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ conversionRate: 0, views: 0, leads: 0 });
  const [locations, setLocations] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAnalytics();
    }
  }, [isFocused]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let totalViews = 0;
      let totalLeads = 0;
      const locationMap = {};

      await Promise.all(
        businesses.map(async (biz) => {
          totalViews += biz.views || 0;
          try {
            const leadsRes = await leadService.getLeadsByBusiness(biz.id);
            const leads = leadsRes.data || [];
            totalLeads += leads.length;

            leads.forEach(l => {
               if (l.location) {
                 const city = l.location.split(',').pop().trim();
                 locationMap[city] = (locationMap[city] || 0) + 1;
               }
            });
          } catch (e) {
            // ignore
          }
        })
      );

      const convRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : 0;
      setStats({ conversionRate: convRate, views: totalViews, leads: totalLeads });

      const sortedLocations = Object.keys(locationMap)
        .map(key => ({ name: key, count: locationMap[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // top 3
        
      if (sortedLocations.length > 0) {
        const sumLocs = sortedLocations.reduce((a, b) => a + b.count, 0);
        setLocations(sortedLocations.map(loc => ({
          name: loc.name,
          percentage: Math.round((loc.count / sumLocs) * 100)
        })));
      } else {
        setLocations([]);
      }

    } catch (e) {
      console.log('Error fetching analytics:', e);
      Toast.show({ type: 'error', text1: 'Sync Error', text2: 'Could not fetch real-time analytics.' });
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (index) => {
    if (index === 0) return colors.primary;
    if (index === 1) return '#F59E0B';
    return '#10B981';
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Advanced Analytics</Text>
      </View>

      {loading ? (
        <ScrollView style={styles.scrollArea}>
          <SkeletonLoader width="100%" height={160} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={140} borderRadius={24} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={180} borderRadius={24} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
          
          <AnimatedFadeIn duration={600}>
            {/* KPI Summary Card */}
            <TouchableOpacity 
                activeOpacity={0.9} 
                style={styles.card}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
               <View style={styles.cardHeaderSmall}>
                  <Text style={styles.sectionTitle}>Conversion Rate</Text>
                  <View style={styles.infoIcon}>
                    <Ionicons name="information-circle-outline" size={18} color="#94A3B8" />
                  </View>
               </View>
               
               <View style={styles.bigNumberRow}>
                 <Text style={styles.bigNumber}>{stats.conversionRate}%</Text>
                 <View style={[styles.trendBadge, parseFloat(stats.conversionRate) > 5 ? styles.badgeGood : styles.badgeNeutral]}>
                   <Ionicons 
                     name={parseFloat(stats.conversionRate) > 5 ? "trending-up" : "remove"} 
                     size={16} 
                     color={parseFloat(stats.conversionRate) > 5 ? "#10B981" : "#64748B"} 
                   />
                   <Text style={[styles.trendText, parseFloat(stats.conversionRate) > 5 ? styles.textGood : styles.textNeutral]}>
                     {parseFloat(stats.conversionRate) > 5 ? 'Elite' : 'Stable'}
                   </Text>
                 </View>
               </View>
               <View style={styles.metricDivider} />
               <View style={styles.metricSummaryRow}>
                 <View style={styles.subMetric}>
                    <Text style={styles.subMetricVal}>{stats.views}</Text>
                    <Text style={styles.subMetricLabel}>PROFILE VIEWS</Text>
                 </View>
                 <View style={styles.subMetric}>
                    <Text style={styles.subMetricVal}>{stats.leads}</Text>
                    <Text style={styles.subMetricLabel}>TOTAL LEADS</Text>
                 </View>
               </View>
            </TouchableOpacity>

            {/* Geographic Distribution Area */}
            {locations.length > 0 ? (
              <View style={styles.card}>
                 <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Lead Origins (Top 3)</Text>
                 {locations.map((loc, idx) => (
                   <View key={idx} style={{ marginBottom: 20 }}>
                     <View style={styles.rowItem}>
                       <Text style={styles.rowLabel}>{loc.name}</Text>
                       <Text style={styles.rowValue}>{loc.percentage}%</Text>
                     </View>
                     <View style={styles.progressBarBg}>
                       <AnimatedFadeIn duration={1000} delay={400 + (idx * 150)}>
                         <LinearGradient
                            colors={idx === 0 ? [colors.primary, '#E65C00'] : idx === 1 ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
                            start={{x:0, y:0}} end={{x:1, y:1}}
                            style={[styles.progressBarFill, { width: `${loc.percentage}%` }]} 
                         />
                       </AnimatedFadeIn>
                     </View>
                   </View>
                 ))}
              </View>
            ) : (
              <View style={styles.card}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="map-outline" size={32} color={colors.primary} />
                </View>
                <Text style={styles.emptyCardTitle}>Gathering Intelligence...</Text>
                <Text style={styles.emptyCardDesc}>Once you start receiving leads, your prime market locations will appear here in real-time.</Text>
              </View>
            )}

            {/* Upsell / Pro Card */}
            <TouchableOpacity 
                activeOpacity={0.9} 
                style={styles.upgradeCard}
                onPress={() => Haptics.selectionAsync()}
            >
              <LinearGradient colors={['#FEF3C7', '#FFFBEB']} style={StyleSheet.absoluteFill} borderRadius={24} />
              <View style={styles.upgradeHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="diamond-outline" size={24} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.upgradeTitle}>Unlock Advanced Insights</Text>
                  <Text style={styles.upgradeDesc}>See which keywords users used to find you and track your rank against competitors.</Text>
                </View>
              </View>
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Explore Diamond Membership</Text>
              </View>
            </TouchableOpacity>
          </AnimatedFadeIn>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  scrollArea: { padding: 24, paddingBottom: 100 },
  
  card: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, marginBottom: 20, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeaderSmall: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' },
  infoIcon: { padding: 4 },
  
  bigNumberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  bigNumber: { fontSize: 48, fontWeight: '900', color: colors.primary, letterSpacing: -2 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, marginLeft: 16 },
  badgeGood: { backgroundColor: '#F0FDF4' },
  badgeNeutral: { backgroundColor: '#F8FAFC' },
  trendText: { fontWeight: '900', marginLeft: 6, fontSize: 13, textTransform: 'uppercase' },
  textGood: { color: '#10B981' },
  textNeutral: { color: '#64748B' },
  
  metricDivider: { height: 1.5, backgroundColor: '#F8FAFC', marginBottom: 20 },
  metricSummaryRow: { flexDirection: 'row', gap: 32 },
  subMetric: { gap: 4 },
  subMetricVal: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  subMetricLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '900', letterSpacing: 1 },
  
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { fontSize: 15, fontWeight: '800', color: '#475569' },
  rowValue: { fontSize: 15, fontWeight: '900', color: '#1E293B' },
  progressBarBg: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  emptyCardTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, fontWeight: '600' },
  
  upgradeCard: { borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden', shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  upgradeHeader: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  iconCircle: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  upgradeTitle: { fontSize: 17, fontWeight: '900', color: '#92400E', letterSpacing: -0.3 },
  upgradeDesc: { fontSize: 13, color: '#92400E', lineHeight: 18, fontWeight: '600', marginTop: 4 },
  upgradeBtn: { backgroundColor: '#F59E0B', paddingVertical: 14, borderRadius: 16, alignItems: 'center', alignSelf: 'stretch' },
  upgradeBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5 }
});

export default AnalyticsScreen;
