import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import SkeletonLoader from '../../components/SkeletonLoader';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';

const EarningsScreen = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchEarnings();
    }
  }, [isFocused]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let allClosedLeads = [];
      let totalEarned = 0;

      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const leadsRes = await leadService.getLeadsByBusiness(biz.id);
            const leads = leadsRes.data || [];
            
            const closedLeads = leads.filter(l => l.status?.toLowerCase() === 'closed');
            
            const mappedEarnings = closedLeads.map(l => {
              let amountStr = '800';
              if (l.budget) {
                const match = l.budget.replace(/[^0-9-]/g, '').split('-');
                if (match.length > 0 && match[0]) amountStr = match[0];
              }
              const amount = parseInt(amountStr, 10) || 800;
              totalEarned += amount;

              return {
                id: l.id || Math.random().toString(),
                title: `${biz.name} - ${l.customerName || 'Client'}`,
                date: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recently',
                rawDate: l.createdAt ? new Date(l.createdAt) : new Date(),
                amount: amount,
                status: 'Completed'
              };
            });
            
            allClosedLeads = [...allClosedLeads, ...mappedEarnings];
          } catch (e) {}
        })
      );
      
      allClosedLeads.sort((a, b) => b.rawDate - a.rawDate);
      setTransactions(allClosedLeads);
      setTotalBalance(totalEarned);
    } catch (e) {
      console.log('Error fetching earnings:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Financial Overview</Text>
          <Text style={styles.headerSubtitle}>Manage your payouts & revenue</Text>
        </View>
        <TouchableOpacity 
            style={styles.payoutBtn} 
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        >
          <Text style={styles.payoutBtnText}>Request Payout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <LinearGradient colors={[colors.primary, '#1E40AF']} style={styles.primaryStatCard}>
             <Text style={styles.statLabel}>Total Balance</Text>
             <Text style={styles.statValue}>₹{totalBalance.toLocaleString()}.00</Text>
             <View style={styles.statFooter}>
                <Ionicons name="trending-up" size={16} color="#4ADE80" />
                <Text style={styles.statTrend}>+12% from last month</Text>
             </View>
          </LinearGradient>

          <View style={styles.secondaryStats}>
             <View style={styles.smallStatCard}>
                <Text style={styles.smallStatLabel}>Pending</Text>
                <Text style={styles.smallStatValue}>₹0</Text>
             </View>
             <View style={styles.smallStatCard}>
                <Text style={styles.smallStatLabel}>This Month</Text>
                <Text style={[styles.smallStatValue, { color: colors.primary }]}>₹{totalBalance.toLocaleString()}</Text>
             </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 20 }}>
            <SkeletonLoader width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
            <SkeletonLoader width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
            <SkeletonLoader width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
          </View>
        ) : (
          transactions.map((tx, index) => (
            <AnimatedFadeIn key={tx.id} delay={index * 100}>
              <View style={styles.transactionCard}>
                <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="arrow-down-outline" size={20} color="#10B981" />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txAmountContainer}>
                  <Text style={[styles.txAmount, { color: '#10B981' }]}>
                    +₹{tx.amount.toLocaleString()}
                  </Text>
                  <View style={[styles.statusTag, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={[styles.statusTagText, { color: '#10B981' }]}>
                      {tx.status}
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedFadeIn>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    paddingVertical: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4 },
  payoutBtn: { 
    backgroundColor: '#1E293B', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  payoutBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  
  scrollContent: { padding: 24, paddingBottom: 100 },
  statsContainer: { marginBottom: 32 },
  primaryStatCard: { 
    padding: 28, 
    borderRadius: 32, 
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: '#FFF', fontSize: 42, fontWeight: '900', marginVertical: 8, letterSpacing: -1 },
  statFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statTrend: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  
  secondaryStats: { flexDirection: 'row', gap: 16 },
  smallStatCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#F1F5F9',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  smallStatLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  smallStatValue: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  viewAllText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  
  transactionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 24, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 1,
  },
  iconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4, letterSpacing: -0.3 },
  txDate: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  txAmountContainer: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusTagText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
});

export default EarningsScreen;
