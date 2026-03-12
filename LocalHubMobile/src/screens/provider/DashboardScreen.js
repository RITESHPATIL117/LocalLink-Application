import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const statCards = [
  { id: '1', title: 'Total Leads', value: '142', icon: 'people', color: colors.primary },
  { id: '2', title: 'Active Leads', value: '28', icon: 'flash', color: colors.warning },
  { id: '3', title: 'Profile Views', value: '1,059', icon: 'eye', color: colors.success },
];

const ProviderDashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        {/* Top Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Welcome back, Rahul!</Text>
            <Text style={styles.greetingSubtitle}>Here's what's happening today.</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={styles.statsContainer}>
          {statCards.map(stat => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Graph Placeholder */}
        <View style={styles.graphSection}>
          <Text style={styles.sectionTitle}>Engagement Overview</Text>
          <View style={styles.graphPlaceholder}>
            <Ionicons name="bar-chart" size={60} color="#E5E7EB" />
            <Text style={styles.graphSubtext}>Weekly Data Coming Soon</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('AddBusiness')}>
              <View style={[styles.actionIconBg, { backgroundColor: `${colors.primary}10` }]}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Add Listing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: `${colors.success}10` }]}>
                <Ionicons name="chatbubbles" size={24} color={colors.success} />
              </View>
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
            
             <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIconBg, { backgroundColor: `${colors.warning}10` }]}>
                <Ionicons name="star" size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  graphSection: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  graphPlaceholder: {
    height: 180,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphSubtext: {
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

export default ProviderDashboardScreen;
