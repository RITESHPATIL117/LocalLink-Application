import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessService from '../../services/businessService';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const sidebarMenu = [
  { id: 'dashboard', title: 'Dashboard', icon: 'speedometer-outline' },
  { id: 'users', title: 'Manage Users', icon: 'people-outline' },
  { id: 'businesses', title: 'Businesses', icon: 'business-outline' },
  { id: 'approvals', title: 'Approvals', icon: 'checkmark-circle-outline' },
  { id: 'reports', title: 'Reports', icon: 'document-text-outline' },
  { id: 'settings', title: 'Settings', icon: 'options-outline' },
];

const defaultAdminStats = [
  { id: '1', title: 'Total Businesses', value: '1,245', trend: '+45 This Week', isUp: true, icon: 'business', color: colors.primary },
  { id: '2', title: 'Total Users', value: '8,930', trend: '+12% MoM', isUp: true, icon: 'people', color: '#10B981' },
  { id: '3', title: 'Revenue', value: '₹4.2L', trend: '-2% vs Last', isUp: false, icon: 'wallet', color: '#F59E0B' },
  { id: '4', title: 'Pending Approval', value: '24', trend: 'Needs Review', isUp: true, icon: 'time', color: '#EF4444' },
];

const recentActivity = [
  { id: 'a1', action: 'New Business Registered: "Metro Electricians"', time: '10 mins ago', icon: 'business', color: colors.primary },
  { id: 'a2', action: 'Subscription Upgraded: "SuperFast Plumbing" to Gold', time: '1 hour ago', icon: 'star', color: '#F59E0B' },
  { id: 'a3', action: 'User "Rahul Kumar" reported a listing.', time: '2 hours ago', icon: 'warning', color: '#EF4444' },
  { id: 'a4', action: 'System Backup completed successfully.', time: '4 hours ago', icon: 'cloud-done', color: '#10B981' },
];

const chartData = [
  { label: 'Mon', value: 120 },
  { label: 'Tue', value: 145 },
  { label: 'Wed', value: 200 },
  { label: 'Thu', value: 180 },
  { label: 'Fri', value: 250 },
  { label: 'Sat', value: 320 },
  { label: 'Sun', value: 290 },
];

const DashboardScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { user } = useSelector(state => state.auth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(defaultAdminStats);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const bizRes = await businessService.getAllBusinesses();
      const businesses = bizRes.data || [];
      const totalBiz = businesses.length;

      setAdminStats(prev => {
        const newStats = [...prev];
        newStats[0].value = totalBiz.toString();
        // Since we don't have a reliable user list / revenue endpoint, we'll keep the mock logic for others for now
        return newStats;
      });
    } catch (e) {
      console.log('Admin dashboard err:', e);
    } finally {
      setLoading(false);
    }
  };

  const adminName = user?.name || "Admin Lead";
  const profilePic = user?.profilePic || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200";

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <View style={styles.logoIconBg}>
           <Ionicons name="shield-checkmark" size={18} color="#FFF" />
        </View>
        <Text style={styles.logoText}>Local<Text style={{color: colors.primary}}>Hub</Text></Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sidebarNavGroup}>
          <Text style={styles.sidebarLabel}>ADMIN PANEL</Text>
          {sidebarMenu.map((item) => (
             <TouchableOpacity
             key={item.id}
             style={[styles.menuItem, activeMenu === item.id && styles.activeMenuItem]}
             onPress={() => setActiveMenu(item.id)}
           >
             <Ionicons 
               name={activeMenu === item.id ? item.icon.replace('-outline', '') : item.icon} 
               size={20} 
               color={activeMenu === item.id ? colors.primary : '#6B7280'} 
             />
             <Text style={[styles.menuText, activeMenu === item.id && styles.activeMenuText]}>
               {item.title}
             </Text>
           </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderMainContent = () => (
    <View style={styles.mainWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Absolute Header Background */}
        <LinearGradient
          colors={['#1F2937', '#111827']} // Dark distinct header for Admin
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        />

        {/* Top Navigation / Header Area */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingGreeting}>System Overview,</Text>
            <Text style={styles.greetingTitle}>{adminName}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.badge} />
              <Ionicons name="notifications" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={logout}>
              <Ionicons name="log-out" size={20} color="#FFF" />
            </TouchableOpacity>
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          </View>
        </View>

        <View style={styles.contentPadding}>
          
          {/* Stats Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.statsContainer}>
              {adminStats.map(stat => (
                <View key={stat.id} style={styles.statCard}>
                  <View style={styles.statTop}>
                    <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                      <Ionicons name={stat.icon} size={22} color={stat.color} />
                    </View>
                    <View style={[styles.trendBadge, { backgroundColor: stat.isUp ? '#ECFDF5' : '#FEF2F2' }]}>
                      <Ionicons name={stat.isUp ? 'trending-up' : 'alert-circle'} size={12} color={stat.isUp ? '#10B981' : '#EF4444'} />
                      <Text style={[styles.trendText, { color: stat.isUp ? '#10B981' : '#EF4444' }]}>{stat.trend}</Text>
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Graphical & Activity Split Area */}
          <View style={styles.dashboardSplit}>
            
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>User Growth (This Week)</Text>
                <TouchableOpacity style={styles.dropdownMini}>
                  <Text style={styles.dropdownMiniText}>Weekly</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.customChartContainer}>
                {chartData.map((dataPoint, index) => {
                  const heightPct = (dataPoint.value / 320) * 100;
                  const isCurrent = index === 5; // Highlight Sat
                  return (
                    <View key={index} style={styles.barItem}>
                       {isCurrent && <Text style={styles.barValue}>{dataPoint.value}</Text>}
                       <View style={[
                         styles.barFill, 
                         { height: `${heightPct}%` },
                         isCurrent && { backgroundColor: '#10B981', opacity: 1 }
                        ]} />
                       <Text style={[styles.barLabel, isCurrent && { color: '#10B981', fontWeight: '700' }]}>{dataPoint.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>System Logs</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.activityList}>
                {recentActivity.map((act, index) => (
                  <View key={act.id} style={[styles.activityItem, index === recentActivity.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[styles.activityIconBg, { backgroundColor: `${act.color}15` }]}>
                      <Ionicons name={act.icon} size={16} color={act.color} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>
                        <Text style={{fontWeight: '500', color: '#111827'}}>{act.action}</Text>
                      </Text>
                      <Text style={styles.activityTime}>{act.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      {isLargeScreen && renderSidebar()}
      
      <View style={styles.mainContentWrapper}>
        {/* Mobile top nav fallback for sidebar */}
        {!isLargeScreen && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileNav}>
             {sidebarMenu.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.mobileMenuItem, activeMenu === item.id && styles.activeMobileMenuItem]}
                onPress={() => setActiveMenu(item.id)}
              >
                <Ionicons 
                  name={activeMenu === item.id ? item.icon.replace('-outline', '') : item.icon} 
                  size={18} 
                  color={activeMenu === item.id ? '#FFF' : '#6B7280'} 
                />
                <Text style={[styles.mobileMenuText, activeMenu === item.id && styles.activeMobileMenuText]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {renderMainContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', 
  },
  sidebar: {
    width: 260,
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    height: '100%',
    ...Platform.select({
      web: {
        boxShadow: '4px 0 20px rgba(0,0,0,0.03)',
      }
    })
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoIconBg: {
    backgroundColor: '#1F2937', 
    padding: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  sidebarNavGroup: {
    paddingVertical: 16,
  },
  sidebarLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 2,
    borderRightWidth: 3,
    borderRightColor: 'transparent',
  },
  activeMenuItem: {
    backgroundColor: '#F3F4F6', 
    borderRightColor: '#1F2937',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 14,
  },
  activeMenuText: {
    color: '#111827',
    fontWeight: '700',
  },
  mainContentWrapper: {
    flex: 1,
    position: 'relative',
  },
  mobileNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    maxHeight: 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  activeMobileMenuItem: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  mobileMenuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeMobileMenuText: {
    color: '#FFF',
  },
  mainWrapper: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: isLargeScreen ? 0 : 24,
    borderBottomRightRadius: isLargeScreen ? 0 : 24,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  greetingGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: 'transparent',
    zIndex: 2,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  contentPadding: {
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' && width < 1000 ? '48%' : 100, 
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: Platform.OS === 'web' && width < 1000 ? '1%' : 6,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dashboardSplit: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  chartSection: {
    flex: isLargeScreen ? 2 : 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginRight: isLargeScreen ? 20 : 0,
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  dropdownMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dropdownMiniText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  customChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 220,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
  },
  barFill: {
    width: 24,
    backgroundColor: '#10B981',
    borderRadius: 10,
    opacity: 0.15,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
    position: 'absolute',
    top: -24,
  },
  activitySection: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  activityList: {
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default DashboardScreen;
