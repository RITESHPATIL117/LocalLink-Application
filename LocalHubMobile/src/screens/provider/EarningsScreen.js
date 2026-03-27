import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  const [withdrawRequest, setWithdrawRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [earningsHistory, setEarningsHistory] = useState([]);
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
            
            // Filter only closed leads to act as "Completed Earnings"
            const closedLeads = leads.filter(l => l.status?.toLowerCase() === 'closed');
            
            const mappedEarnings = closedLeads.map(l => {
              // Extract number from budget, e.g., "₹500 - ₹1,500" -> 500
              let amountStr = '800'; // fallback
              if (l.budget) {
                const match = l.budget.replace(/[^0-9-]/g, '').split('-');
                if (match.length > 0 && match[0]) amountStr = match[0];
              }
              const amount = parseInt(amountStr, 10) || 800;
              totalEarned += amount;

              return {
                id: l.id || Math.random().toString(),
                service: `${biz.name} - ${l.customerName || 'Client'}`,
                date: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recently',
                rawDate: l.createdAt ? new Date(l.createdAt) : new Date(),
                amount: `₹${amount.toLocaleString()}`,
                status: 'Completed'
              };
            });
            
            allClosedLeads = [...allClosedLeads, ...mappedEarnings];
          } catch (e) {
            // ignore
          }
        })
      );
      
      allClosedLeads.sort((a, b) => b.rawDate - a.rawDate);
      setEarningsHistory(allClosedLeads);
      setTotalBalance(totalEarned);
    } catch (e) {
      console.log('Error fetching earnings:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Earnings</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Total Balance Card */}
          <AnimatedFadeIn duration={600}>
            <LinearGradient
              colors={totalBalance > 0 ? [colors.primary, '#E65C00'] : ['#9CA3AF', '#6B7280']}
              style={styles.balanceCard}
            >
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹{totalBalance.toLocaleString()}.00</Text>
              
              <View style={styles.balanceStatsArea}>
                <View style={styles.balanceStatItem}>
                  <Text style={styles.statLabel}>This Month</Text>
                  <Text style={styles.statVal}>+₹{totalBalance > 0 ? (totalBalance * 0.8).toLocaleString() : '0'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.balanceStatItem}>
                  <Text style={styles.statLabel}>Last Month</Text>
                  <Text style={styles.statVal}>₹{totalBalance > 0 ? (totalBalance * 0.2).toLocaleString() : '0'}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.withdrawBtn, totalBalance === 0 && { opacity: 0.5 }]}
                onPress={() => totalBalance > 0 && setWithdrawRequest(true)}
                disabled={totalBalance === 0}
              >
                <Ionicons name="wallet-outline" size={20} color={totalBalance > 0 ? colors.primary : '#6B7280'} />
                <Text style={[styles.withdrawBtnText, totalBalance === 0 && { color: '#6B7280' }]}>Withdraw Money</Text>
              </TouchableOpacity>
            </LinearGradient>
          </AnimatedFadeIn>

          {/* History Section */}
          <AnimatedFadeIn delay={200} duration={600}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Earnings History</Text>
                {earningsHistory.length > 0 && (
                  <TouchableOpacity>
                    <Text style={styles.filterLink}>Filter</Text>
                  </TouchableOpacity>
                )}
              </View>

              {earningsHistory.length > 0 ? (
                <View style={styles.historyList}>
                  {earningsHistory.map((item, idx) => (
                    <View key={item.id} style={[styles.historyItem, idx === earningsHistory.length -1 && { borderBottomWidth: 0 }]}>
                      <View style={styles.historyIconBg}>
                        <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyService} numberOfLines={1}>{item.service}</Text>
                        <Text style={styles.historyDate}>{item.date}</Text>
                      </View>
                      <View style={styles.historyAmountArea}>
                        <Text style={styles.historyAmount}>{item.amount}</Text>
                        <Text style={[
                          styles.historyStatus, 
                          { color: item.status === 'Completed' ? '#10B981' : '#F59E0B' }
                        ]}>{item.status}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyHistoryCard}>
                   <View style={styles.emptyHistoryIcon}>
                     <Ionicons name="document-text-outline" size={32} color={colors.primary} />
                   </View>
                   <Text style={styles.emptyHistoryTitle}>No Earnings Yet</Text>
                   <Text style={styles.emptyHistoryDesc}>When you mark leads as "Closed", the service payments will appear here.</Text>
                </View>
              )}
            </View>
          </AnimatedFadeIn>

          {/* Payment Methods */}
          <AnimatedFadeIn delay={400} duration={600}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Withdrawal Method</Text>
              <TouchableOpacity style={styles.methodCard}>
                <View style={styles.methodIcon}>
                  <Ionicons name="card" size={24} color="#000" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Bank Transfer (HDFC)</Text>
                  <Text style={styles.methodDetail}>**** **** 8829</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </AnimatedFadeIn>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  balanceCard: {
    margin: 20, borderRadius: 32, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  balanceAmount: { color: '#FFF', fontSize: 44, fontWeight: '900', letterSpacing: -1, marginBottom: 24 },
  balanceStatsArea: {
    flexDirection: 'row', width: '100%', paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', marginBottom: 20,
  },
  balanceStatItem: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, fontWeight: '600' },
  statVal: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  divider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.15)' },
  withdrawBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, width: '100%', justifyContent: 'center',
  },
  withdrawBtnText: { color: colors.primary, fontWeight: '800', marginLeft: 8, fontSize: 16 },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  filterLink: { color: colors.primary, fontWeight: '700' },
  historyList: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  historyIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  historyInfo: { flex: 1, paddingRight: 10 },
  historyService: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 4, letterSpacing: -0.3 },
  historyDate: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  historyAmountArea: { alignItems: 'flex-end' },
  historyAmount: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  historyStatus: { fontSize: 11, fontWeight: '800' },
  
  emptyHistoryCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  emptyHistoryIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyHistoryTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  emptyHistoryDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },

  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodInfo: { flex: 1 },
  methodName: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 4 },
  methodDetail: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
});

export default EarningsScreen;
