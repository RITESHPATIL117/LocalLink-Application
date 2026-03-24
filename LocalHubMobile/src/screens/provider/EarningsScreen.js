import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  const [withdrawRequest, setWithdrawRequest] = useState(false);

  const earningsHistory = [
    { id: '1', service: 'Plumbing Leak Fix', date: '24 Mar 2026', amount: '₹1,200', status: 'Completed' },
    { id: '2', service: 'Bathroom Reno Deposit', date: '22 Mar 2026', amount: '₹5,000', status: 'Pending' },
    { id: '3', service: 'Drain Unblocking', date: '18 Mar 2026', amount: '₹800', status: 'Completed' },
    { id: '4', service: 'Kitchen Sink Install', date: '15 Mar 2026', amount: '₹2,500', status: 'Completed' },
  ];

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Total Balance Card */}
        <AnimatedFadeIn duration={600}>
          <LinearGradient
            colors={[colors.primary, '#E65C00']}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>₹12,450.00</Text>
            
            <View style={styles.balanceStatsArea}>
              <View style={styles.balanceStatItem}>
                <Text style={styles.statLabel}>This Month</Text>
                <Text style={styles.statVal}>+₹8,200</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceStatItem}>
                <Text style={styles.statLabel}>Last Month</Text>
                <Text style={styles.statVal}>₹15,400</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.withdrawBtn}
              onPress={() => setWithdrawRequest(true)}
            >
              <Ionicons name="wallet-outline" size={20} color={colors.primary} />
              <Text style={styles.withdrawBtnText}>Withdraw Money</Text>
            </TouchableOpacity>
          </LinearGradient>
        </AnimatedFadeIn>

        {/* History Section */}
        <AnimatedFadeIn delay={300} duration={600}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Earnings History</Text>
              <TouchableOpacity>
                <Text style={styles.filterLink}>Filter</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
              {earningsHistory.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyIconBg}>
                    <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyService}>{item.service}</Text>
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
          </View>
        </AnimatedFadeIn>

        {/* Payment Methods */}
        <AnimatedFadeIn delay={600} duration={600}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  balanceCard: {
    margin: 20,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500', marginBottom: 8 },
  balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginBottom: 24 },
  balanceStatsArea: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
  },
  balanceStatItem: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
  statVal: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  divider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.15)' },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
  },
  withdrawBtnText: { color: colors.primary, fontWeight: '800', marginLeft: 8, fontSize: 16 },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  filterLink: { color: colors.primary, fontWeight: '700' },
  historyList: { backgroundColor: '#FFF', borderRadius: 24, padding: 8 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyInfo: { flex: 1 },
  historyService: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  historyDate: { fontSize: 13, color: '#9CA3AF' },
  historyAmountArea: { alignItems: 'flex-end' },
  historyAmount: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 2 },
  historyStatus: { fontSize: 11, fontWeight: '800' },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: { flex: 1 },
  methodName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  methodDetail: { fontSize: 13, color: '#9CA3AF' },
});

export default EarningsScreen;
