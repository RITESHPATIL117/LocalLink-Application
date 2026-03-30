import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessService from '../../services/businessService';
import adminService from '../../services/adminService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import socketService from '../../services/socketService';
import Toast from 'react-native-toast-message';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';

const sidebarMenu = [
  { id: 'dashboard', title: 'Home Screen', icon: 'home-outline' },
  { id: 'users', title: 'Manage Users', icon: 'people-outline' },
  { id: 'businesses', title: 'Businesses', icon: 'business-outline' },
  { id: 'approvals', title: 'Approvals', icon: 'checkmark-circle-outline' },
  { id: 'categories', title: 'Categories', icon: 'grid-outline' },
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
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { logout } = useAuth();
  const { user } = useSelector(state => state.auth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(defaultAdminStats);

  useEffect(() => {
    fetchAdminData();
    
    // Admin socket integration
    socketService.connect();
    socketService.joinRoom('admin_room'); // Admin room for general system updates
    
    socketService.onStatsUpdate((data) => {
        console.log('Admin real-time stats update:', data);
        fetchAdminData();
        Toast.show({
          type: 'info',
          text1: 'System Live Update',
          text2: 'Global platform metrics have been updated.'
        });
    });

    return () => {
      // socketService.disconnect();
    };
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getStats();
      const stats = statsRes.data || {};
      
      setAdminStats([
        { id: '1', title: 'Total Businesses', value: stats.totalBusinesses?.toString() || '0', trend: '+5% This Week', isUp: true, icon: 'business', color: colors.primary },
        { id: '2', title: 'Total Users', value: stats.totalUsers?.toString() || '0', trend: '+12% MoM', isUp: true, icon: 'people', color: '#10B981' },
        { id: '3', title: 'Revenue', value: `₹${stats.revenue || 0}`, trend: 'Stable', isUp: true, icon: 'wallet', color: '#F59E0B' },
        { id: '4', title: 'Pending Approval', value: stats.pendingApprovals?.toString() || '0', trend: 'Priority', isUp: false, icon: 'time', color: '#EF4444' },
      ]);
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
             onPress={() => {
                setActiveMenu(item.id);
                if (item.id === 'dashboard') {
                  navigation.navigate('HomeTab');
                } else if (item.id === 'users') {
                 navigation.navigate('UsersTab');
               } else if (item.id === 'businesses') {
                 navigation.navigate('Businesses');
               } else if (item.id === 'approvals') {
                 navigation.navigate('ApprovalsTab');
               } else if (item.id === 'categories') {
                 navigation.navigate('Categories');
               } else if (item.id === 'reports') {
                 navigation.navigate('ReportsTab');
               }
             }}
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
            <View style={styles.statusRow}>
               <View style={styles.statusDot} />
               <Text style={styles.statusText}>System Live • v1.0.4</Text>
            </View>
            <Text style={styles.greetingTitle}>{adminName}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Toast.show({ type: 'info', text1: 'System Alert', text2: 'No critical system issues found.' })}>
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
            <View style={styles.statsContainer}>
              <SkeletonLoader width={(width - 72) / 2} height={140} borderRadius={28} style={{ margin: 6 }} />
              <SkeletonLoader width={(width - 72) / 2} height={140} borderRadius={28} style={{ margin: 6 }} />
            </View>
          ) : (
            <View style={styles.statsContainer}>
              {adminStats.map((stat, idx) => (
                <AnimatedFadeIn key={stat.id} delay={idx * 100} duration={600}>
                   <TouchableOpacity 
                      style={styles.statCard}
                      activeOpacity={0.9}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                   >
                     <View style={styles.statTop}>
                      <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                        <Ionicons name={stat.icon} size={24} color={stat.color} />
                      </View>
                      <View style={[styles.trendBadge, { backgroundColor: stat.isUp ? '#F0FDF4' : '#FEF2F2' }]}>
                        <Ionicons name={stat.isUp ? 'trending-up' : 'alert-circle'} size={12} color={stat.isUp ? '#10B981' : '#EF4444'} />
                        <Text style={[styles.trendText, { color: stat.isUp ? '#10B981' : '#EF4444' }]}>{stat.trend}</Text>
                      </View>
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </TouchableOpacity>
                </AnimatedFadeIn>
              ))}
            </View>
          )}

          {/* Graphical & Activity Split Area */}
          <View style={[styles.dashboardSplit, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
            
            <View style={[styles.chartSection, { flex: isLargeScreen ? 2 : 1, marginRight: isLargeScreen ? 20 : 0 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>User Growth (This Week)</Text>
                <TouchableOpacity style={styles.dropdownMini}>
                  <Text style={styles.dropdownMiniText}>Weekly</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.customChartContainer}>
                {loading ? (
                  <SkeletonLoader width="100%" height={180} borderRadius={24} />
                ) : (
                  chartData.map((dataPoint, index) => {
                    const heightPct = (dataPoint.value / 320) * 100;
                    const isCurrent = index === 5; // Highlight Sat
                    return (
                      <View key={index} style={styles.barItem}>
                         {isCurrent && (
                           <View style={styles.barValueBadge}>
                             <Text style={styles.barValueText}>{dataPoint.value}</Text>
                           </View>
                         )}
                         <View style={{ height: '100%', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                           <LinearGradient
                             colors={isCurrent ? ['#10B981', '#059669'] : ['#E2E8F0', '#CBD5E1']}
                             style={[
                               styles.barFill, 
                               { height: `${Math.max(heightPct, 10)}%` },
                               isCurrent && { opacity: 1 }
                             ]} 
                           />
                         </View>
                         <Text style={[styles.barLabel, isCurrent && { color: '#10B981', fontWeight: '800' }]}>{dataPoint.label}</Text>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>System Logs</Text>
                <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.activityList}>
                {loading ? (
                  <SkeletonLoader width="100%" height={200} borderRadius={16} />
                ) : (
                  recentActivity.map((act, index) => (
                    <TouchableOpacity 
                        key={act.id} 
                        style={[styles.activityItem, index === recentActivity.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => Haptics.selectionAsync()}
                    >
                      <View style={[styles.activityIconBg, { backgroundColor: `${act.color}15` }]}>
                        <Ionicons name={act.icon} size={18} color={act.color} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          <Text style={{fontWeight: '700', color: '#1E293B'}}>{act.action}</Text>
                        </Text>
                        <Text style={styles.activityTime}>{act.time}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={12} color="#CBD5E1" />
                    </TouchableOpacity>
                  ))
                )}
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
                onPress={() => {
                  setActiveMenu(item.id);
                  if (item.id === 'users') {
                    navigation.navigate('UsersTab');
                  } else if (item.id === 'businesses') {
                    navigation.navigate('Businesses');
                  } else if (item.id === 'approvals') {
                    navigation.navigate('ApprovalsTab');
                  } else if (item.id === 'categories') {
                    navigation.navigate('Categories');
                  } else if (item.id === 'reports') {
                    navigation.navigate('ReportsTab');
                  }
                }}
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
  mainWrapper: { flex: 1 },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 260, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 },
  greetingTitle: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 },
  statusText: { fontSize: 11, color: '#10B981', fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12, position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF', zIndex: 2 },
  profilePic: { width: 44, height: 44, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  
  contentPadding: { paddingHorizontal: 24, paddingBottom: 40 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10, marginBottom: 24, marginHorizontal: -6 },
  statCard: {
    flex: 1, 
    backgroundColor: '#FFF', borderRadius: 28, padding: 20, margin: 6,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 4, borderWidth: 1, borderColor: '#F1F5F9',
  },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  trendText: { fontSize: 10, fontWeight: '900', marginLeft: 4 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 4, letterSpacing: -1 },
  statTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  dashboardSplit: { justifyContent: 'space-between' },
  chartSection: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, marginBottom: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  dropdownMini: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  dropdownMiniText: { fontSize: 12, fontWeight: '800', color: '#64748B', marginRight: 4 },
  seeAllText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  
  customChartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 220, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 10 },
  barItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' },
  barValueBadge: { position: 'absolute', top: -30, backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 10 },
  barValueText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  barFill: { width: 14, borderRadius: 7, opacity: 0.6 },
  barLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 14 },
  
  activitySection: { flex: 1, backgroundColor: '#FFF', borderRadius: 32, padding: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  activityList: { marginTop: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  activityIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, lineHeight: 22, color: '#475569', fontWeight: '500' },
  activityTime: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 4 },
});

export default DashboardScreen;
