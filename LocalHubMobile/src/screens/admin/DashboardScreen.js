import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform, RefreshControl, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import adminService from '../../services/adminService';
import socketService from '../../services/socketService';
import Toast from 'react-native-toast-message';
import WelcomeModal from '../../components/WelcomeModal';
import * as Haptics from 'expo-haptics';

// Elite Components
import AdminHeader from '../../components/admin/AdminHeader';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatCard from '../../components/admin/StatCard';
import SkeletonLoader, { StatPillSkeleton } from '../../components/SkeletonLoader';

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
  { id: '1', title: 'Total Businesses', value: '0', trend: '0 live', isUp: false, icon: 'business', color: colors.primary },
  { id: '2', title: 'Total Users', value: '0', trend: '0 active', isUp: false, icon: 'people', color: '#10B981' },
  { id: '3', title: 'Revenue', value: '₹0', trend: '0 this cycle', isUp: false, icon: 'wallet', color: '#F59E0B' },
  { id: '4', title: 'Pending Approval', value: '0', trend: '0 waiting', isUp: false, icon: 'time', color: '#EF4444' },
];

const recentActivityData = [
  { id: 'a1', action: 'New Business Registered: "Metro Electricians"', time: '10 mins ago', icon: 'business', color: colors.primary },
  { id: 'a2', action: 'Subscription Upgraded: "SuperFast Plumbing" to Gold', time: '1 hour ago', icon: 'star', color: '#F59E0B' },
  { id: 'a3', action: 'User "Rahul Kumar" reported a listing.', time: '2 hours ago', icon: 'warning', color: '#EF4444' },
  { id: 'a4', action: 'System Backup completed successfully.', time: '4 hours ago', icon: 'cloud-done', color: '#10B981' },
];

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DashboardScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { logout } = useAuth();
  const { user } = useSelector(state => state.auth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminStats, setAdminStats] = useState(defaultAdminStats);
  const [recentActivity, setRecentActivity] = useState(recentActivityData);
  const [chartData, setChartData] = useState(WEEK_LABELS.map((label) => ({ label, value: 0 })));
  const [showSettings, setShowSettings] = useState(false);

  const fetchAdminData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [statsRes, usersRes, businessesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers().catch(() => ({ data: [] })),
        adminService.getAllBusinesses().catch(() => ({ data: [] }))
      ]);
      const stats = statsRes?.data || statsRes || {};
      const users = usersRes?.data || usersRes || [];
      const businesses = businessesRes?.data || businessesRes || [];

      const liveBusinesses = businesses.filter((b) => b?.is_verified === 1).length;
      const pendingBusinesses = businesses.filter((b) => b?.is_verified === 0).length;
      const activeUsers = users.filter((u) => (u?.status || '').toLowerCase() !== 'inactive').length;
      
      const newStats = [
        { id: '1', title: 'Total Businesses', value: stats.totalBusinesses?.toString() || '0', trend: `${liveBusinesses} live`, isUp: liveBusinesses > 0, icon: 'business', color: colors.primary },
        { id: '2', title: 'Total Users', value: stats.totalUsers?.toString() || '0', trend: `${activeUsers} active`, isUp: activeUsers > 0, icon: 'people', color: '#10B981' },
        { id: '3', title: 'Revenue', value: stats.revenue ? `₹${stats.revenue}` : '₹0', trend: `${stats.revenue || 0} this cycle`, isUp: (stats.revenue || 0) > 0, icon: 'wallet', color: '#F59E0B' },
        { id: '4', title: 'Pending Approval', value: stats.pendingApprovals?.toString() || '0', trend: `${pendingBusinesses} waiting`, isUp: false, icon: 'time', color: '#EF4444' },
      ];
      setAdminStats(newStats);

      const now = new Date();
      const dailyCounts = new Array(7).fill(0);
      users.forEach((u) => {
        if (!u?.createdAt && !u?.created_at) return;
        const created = new Date(u.createdAt || u.created_at);
        if (Number.isNaN(created.getTime())) return;
        const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          const dayIndex = created.getDay();
          dailyCounts[dayIndex] += 1;
        }
      });
      setChartData(WEEK_LABELS.map((label, idx) => ({ label, value: dailyCounts[idx] })));
    } catch (e) {
      console.log('Admin dashboard err:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    
    // Admin socket integration
    socketService.connect();
    socketService.joinRoom('admin_room'); // Admin room for platform updates
    
    // 1. Listen for new leads
    socketService.socket?.on('new_lead_received', (data) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
            type: 'success',
            text1: '🔔 New Booking Alert',
            text2: `${data.customerName} booked ${data.businessName}`,
        });
        
        // Update stats silently
        fetchAdminData(true);
        
        // Add to local activity feed
        const newLog = {
            id: `new-${Date.now()}`,
            action: `New Booking: ${data.customerName} -> ${data.businessName}`,
            time: 'Just now',
            icon: 'cart',
            color: colors.primary
        };
        setRecentActivity(prev => [newLog, ...prev.slice(0, 5)]);
    });

    // 2. Listen for new business registration
    socketService.socket?.on('new_business_registered', (data) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
            type: 'info',
            text1: '🚀 New Business Partner!',
            text2: `${data.name} just joined LocalHub.`,
        });
        
        fetchAdminData(true);
        
        const newLog = {
            id: `biz-${Date.now()}`,
            action: `Business Registered: "${data.name}"`,
            time: 'Just now',
            icon: 'business',
            color: '#10B981'
        };
        setRecentActivity(prev => [newLog, ...prev.slice(0, 5)]);
    });

    // 3. Listen for general platform activity
    socketService.socket?.on('log_activity', (data) => {
        const newLog = {
            id: `log-${Date.now()}`,
            action: data.action,
            time: 'Just now',
            icon: 'pulse',
            color: '#6B7280'
        };
        setRecentActivity(prev => [newLog, ...prev.slice(0, 5)]);
    });

    socketService.socket?.on('stats_update', () => {
      fetchAdminData(true);
    });

    return () => {
      // socketService.disconnect();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await fetchAdminData();
  };

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
      <ScrollView 
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Elite Header */}
        <AdminHeader 
          title="Admin Portal"
          status="System Live • v1.1.0"
          profilePic={profilePic}
          onProfilePress={() => setShowSettings(true)}
          onSettingsPress={() => setShowSettings(true)}
        />

        {/* Modular Sticky Navbar */}
        {!isLargeScreen && (
          <AdminNavbar 
            items={sidebarMenu.filter(i => i.id !== 'settings')}
            activeId={activeMenu}
            onSelect={(id) => {
              setActiveMenu(id);
              if (id === 'users') navigation.navigate('UsersTab');
              else if (id === 'businesses') navigation.navigate('Businesses');
              else if (id === 'approvals') navigation.navigate('ApprovalsTab');
              else if (id === 'categories') navigation.navigate('CategoriesTab');
              else if (id === 'reports') navigation.navigate('ReportsTab');
              else if (id === 'dashboard') navigation.navigate('HomeTab');
            }}
          />
        )}

        <View style={styles.contentPadding}>
          
          {/* Stats Cards - Grid Upgrade */}
          <View style={styles.statsContainer}>
            {loading ? (
              <>
                <StatPillSkeleton />
                <StatPillSkeleton />
                <StatPillSkeleton />
                <StatPillSkeleton />
              </>
            ) : (
              (adminStats || []).map((stat, idx) => (
                <StatCard 
                  key={stat.id}
                  {...stat}
                  delay={idx * 150}
                />
              ))
            )}
          </View>

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
                    const maxChartValue = Math.max(...chartData.map((d) => d.value), 1);
                    const heightPct = (dataPoint.value / maxChartValue) * 100;
                    const isCurrent = index === new Date().getDay();
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
                  (recentActivity || []).map((act, index) => (
                    <TouchableOpacity 
                        key={act.id} 
                        style={[styles.activityItem, index === (recentActivity?.length || 0) - 1 && { borderBottomWidth: 0 }]}
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
      <WelcomeModal isProvider={true} />
      
      {/* Admin Settings / Profile Modal */}
      <Modal visible={showSettings} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowSettings(false)}>
            <View style={styles.settingsSheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>System Administration</Text>
                
                <TouchableOpacity style={styles.sheetAction} onPress={() => { setShowSettings(false); navigation.navigate('ReportsTab'); }}>
                    <View style={[styles.sheetIconBg, { backgroundColor: '#F1F5F9' }]}>
                        <Ionicons name="shield-outline" size={20} color="#64748B" />
                    </View>
                    <Text style={styles.sheetActionText}>Platform Health</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sheetAction, { marginTop: 12 }]} onPress={logout}>
                    <View style={[styles.sheetIconBg, { backgroundColor: '#FEF2F2' }]}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    </View>
                    <Text style={[styles.sheetActionText, { color: '#EF4444' }]}>Terminate Session</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.sheetCloseBtn} 
                    onPress={() => setShowSettings(false)}
                >
                    <Text style={styles.sheetCloseText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top', 'left', 'right']}>
      {isLargeScreen && renderSidebar()}
      
      <View style={styles.mainContentWrapper}>
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
  mainWrapper: { flex: 1, backgroundColor: '#F8FAFC' }, // Premium Slate White
  contentPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10, marginBottom: 28 },
  statValue: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginBottom: 6, letterSpacing: -1.5 },
  statTitle: { fontSize: 13, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  dashboardSplit: { justifyContent: 'space-between' },
  chartSection: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, marginBottom: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
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
  
  activitySection: { flex: 1, backgroundColor: '#FFF', borderRadius: 32, padding: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  activityList: { marginTop: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  activityIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, lineHeight: 22, color: '#475569', fontWeight: '500' },
  activityTime: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 4 },
  
  // Settings Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  settingsSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 24, textAlign: 'center' },
  sheetAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20 },
  sheetIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  sheetActionText: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  sheetCloseBtn: { marginTop: 24, alignItems: 'center' },
  sheetCloseText: { fontSize: 14, fontWeight: '800', color: '#94A3B8' }
});

export default DashboardScreen;
