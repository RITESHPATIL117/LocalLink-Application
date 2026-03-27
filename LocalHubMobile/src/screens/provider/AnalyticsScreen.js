import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';

const AnalyticsScreen = () => {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
          
          <AnimatedFadeIn duration={500}>
            {/* KPI Summary */}
            <View style={styles.card}>
               <Text style={styles.sectionTitle}>Conversion Rate</Text>
               <View style={styles.bigNumberRow}>
                 <Text style={styles.bigNumber}>{stats.conversionRate}%</Text>
                 <View style={[styles.trendBadge, parseFloat(stats.conversionRate) > 5 ? styles.badgeGood : styles.badgeNeutral]}>
                   <Ionicons 
                     name={parseFloat(stats.conversionRate) > 5 ? "trending-up" : "remove"} 
                     size={16} 
                     color={parseFloat(stats.conversionRate) > 5 ? "#10B981" : "#6B7280"} 
                   />
                   <Text style={[styles.trendText, parseFloat(stats.conversionRate) > 5 ? styles.textGood : styles.textNeutral]}>
                     {parseFloat(stats.conversionRate) > 5 ? 'Excellent' : 'Average'}
                   </Text>
                 </View>
               </View>
               <Text style={styles.subtitleText}>Based on {stats.views} profile views and {stats.leads} quotes.</Text>
            </View>

            {/* Demographics Area */}
            {locations.length > 0 ? (
              <View style={styles.card}>
                 <Text style={styles.sectionTitle}>Lead Locations</Text>
                 {locations.map((loc, idx) => (
                   <View key={idx}>
                     <View style={styles.rowItem}>
                       <Text style={styles.rowLabel}>{loc.name}</Text>
                       <Text style={styles.rowValue}>{loc.percentage}%</Text>
                     </View>
                     <View style={styles.progressBarBg}>
                       <AnimatedFadeIn duration={1000} delay={400 + (idx * 150)}>
                         <View style={[styles.progressBarFill, { width: `${loc.percentage}%`, backgroundColor: getBarColor(idx) }]} />
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
                <Text style={styles.emptyCardTitle}>No Location Data Yet</Text>
                <Text style={styles.emptyCardDesc}>Once leads start messaging you, their locations will be tracked here automatically.</Text>
              </View>
            )}

            {/* Empty State warning for extra features */}
            <View style={styles.upgradeCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.upgradeTitle}>Unlock Pro Insights</Text>
              <Text style={styles.upgradeDesc}>See exactly which competitors your leads are also messaging and what search terms they used to find you.</Text>
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>Upgrade to Gold</Text>
              </View>
            </View>
          </AnimatedFadeIn>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollArea: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, marginBottom: 16, shadowColor: '#64748B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  bigNumberRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  bigNumber: { fontSize: 42, fontWeight: '800', color: colors.primary, lineHeight: 48 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 16, marginBottom: 6 },
  badgeGood: { backgroundColor: '#ECFDF5' },
  badgeNeutral: { backgroundColor: '#F3F4F6' },
  trendText: { fontWeight: '700', marginLeft: 6 },
  textGood: { color: '#10B981' },
  textNeutral: { color: '#6B7280' },
  subtitleText: { fontSize: 14, color: '#6B7280' },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  rowValue: { fontSize: 14, fontWeight: '800', color: '#111827' },
  progressBarBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  progressBarFill: { height: '100%', borderRadius: 4 },
  
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  emptyCardTitle: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 8 },
  emptyCardDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  
  upgradeCard: { backgroundColor: '#FFFBEB', borderRadius: 20, padding: 24, marginTop: 8, borderWidth: 1, borderColor: '#FEF3C7', alignItems: 'center', textAlign: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  upgradeTitle: { fontSize: 18, fontWeight: '800', color: '#D97706', marginBottom: 12 },
  upgradeDesc: { fontSize: 14, color: '#92400E', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  upgradeBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  upgradeBtnText: { color: '#FFF', fontWeight: '800' }
});

export default AnalyticsScreen;
