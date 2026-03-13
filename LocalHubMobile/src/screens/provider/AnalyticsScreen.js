import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const AnalyticsScreen = () => {
  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Advanced Analytics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        {/* KPI Summary */}
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>Conversion Rate</Text>
           <View style={styles.bigNumberRow}>
             <Text style={styles.bigNumber}>24.8%</Text>
             <View style={styles.trendBadge}>
               <Ionicons name="trending-up" size={16} color="#10B981" />
               <Text style={styles.trendText}>+4.2%</Text>
             </View>
           </View>
           <Text style={styles.subtitleText}>Of all profile viewers who contact you.</Text>
        </View>

        {/* Demographics Placeholder */}
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>Audience Location</Text>
           <View style={styles.rowItem}>
             <Text style={styles.rowLabel}>Downtown City Center</Text>
             <Text style={styles.rowValue}>45%</Text>
           </View>
           <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '45%' }]} /></View>
           
           <View style={styles.rowItem}>
             <Text style={styles.rowLabel}>Westside Suburbs</Text>
             <Text style={styles.rowValue}>30%</Text>
           </View>
           <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '30%', backgroundColor: '#F59E0B' }]} /></View>
           
           <View style={styles.rowItem}>
             <Text style={styles.rowLabel}>North Hills</Text>
             <Text style={styles.rowValue}>25%</Text>
           </View>
           <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '25%', backgroundColor: '#10B981' }]} /></View>
        </View>

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
  scrollArea: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  bigNumberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 48,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 16,
    marginBottom: 6,
  },
  trendText: {
    color: '#10B981',
    fontWeight: '700',
    marginLeft: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  upgradeCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 12,
  },
  upgradeDesc: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  upgradeBtnText: {
    color: '#FFF',
    fontWeight: '800',
  }
});

export default AnalyticsScreen;
