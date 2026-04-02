import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform, ActivityIndicator, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';
import socketService from '../../services/socketService';
import { renderDynamicIcon } from '../../utils/iconHelper';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import WelcomeModal from '../../components/WelcomeModal';

const sidebarMenu = [
  { id: 'dashboard', title: 'Home Screen', icon: 'home-outline' },
  { id: 'listings', title: 'My Businesses', icon: 'list-outline' },
  { id: 'leads', title: 'Leads', icon: 'people-outline' },
  { id: 'reviews', title: 'Reviews', icon: 'star-outline' },
  { id: 'analytics', title: 'Analytics', icon: 'bar-chart-outline' },
  { id: 'subscription', title: 'Earnings', icon: 'card-outline' },
  { id: 'settings', title: 'Settings', icon: 'settings-outline' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ProviderDashboardScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { user } = useSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [stats, setStats] = useState({ totalLeads: 0, activeLeads: 0, views: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileStrength, setProfileStrength] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    
    // Socket integration
    if (user?.id) {
      socketService.connect();
      socketService.joinRoom(user.id.toString());
      
      socketService.onNewLead((newLead) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Update stats and activity silently
        fetchDashboardData(true);
        
        Toast.show({
          type: 'success',
          text1: '🔔 New Lead Received!',
          text2: `${newLead.customerName} just requested a quote.`,
          onPress: () => navigation.navigate('LeadsTab')
        });
      });
    }

    return () => {
      // socketService.disconnect(); // Keep alive or disconnect on logout
    };
  }, [user]);

  const fetchDashboardData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // 1. Fetch Aggregated Stats from new specialized endpoint
      const statsRes = await businessOwnerService.getDashboardStats();
      const apiStats = statsRes.data || {};
      
      // 2. Fetch Businesses for Activity Feed & Detailed Context
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let allLeads = [];

      // Fetch recent leads for the activity feed
      await Promise.all(
        businesses.slice(0, 3).map(async (biz) => {
          try {
            const leadsRes = await leadService.getLeadsByBusiness(biz.id);
            const leads = leadsRes.data || [];
            
            const mappedLeads = leads.map(l => ({
              id: l.id || Math.random().toString(),
              user: l.customerName || 'Customer',
              action: `Requested a quote for ${biz.name}`,
              time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recently',
              rawDate: l.createdAt ? new Date(l.createdAt) : new Date(),
              icon: 'chatbubble-ellipses',
              color: colors.primary
            }));
            
            allLeads = [...allLeads, ...mappedLeads];
          } catch (e) {}
        })
      );

      setStats({ 
        totalLeads: apiStats.totalLeads || 0, 
        activeLeads: apiStats.pendingListings || 0, // Using pending as "action needed"
        views: apiStats.totalViews || 0 
      });

      allLeads.sort((a, b) => b.rawDate - a.rawDate);
      
      // Calculate Profile Strength (Interactive)
      let strength = 20; // Basic registration
      if (user?.profilePic) strength += 20;
      if (businesses.length > 0) {
        strength += 20; // At least one listing
        const mainBiz = businesses[0];
        if (mainBiz.description && mainBiz.description.length > 50) strength += 20;
        if (mainBiz.image_url) strength += 20;
      }
      setProfileStrength(strength);

      if (allLeads.length === 0) {
        setRecentActivities([
          { id: 'a1', user: 'System', action: 'Welcome to LocalHub! Start by adding your first listing.', time: 'Just now', icon: 'sparkles', color: colors.secondary },
          { id: 'a2', user: 'Tips', action: 'Complete your profile to increase visibility by 40%', time: 'Today', icon: 'bulb', color: '#10B981' },
          { id: 'a3', user: 'Notice', action: 'Your dashboard is now live with real-time tracking.', time: 'Today', icon: 'shield-checkmark', color: colors.primary },
        ]);
        
        setMonthlyChartData([
          { label: 'Mon', value: 5 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 3 },
          { label: 'Thu', value: 12 }, { label: 'Fri', value: 15 }, { label: 'Sat', value: 7 },
          { label: 'Sun', value: 9 },
        ]);
      } else {
        setRecentActivities(allLeads.slice(0, 4));
        // Chart logic remains based on lead dates
        const monthCounts = new Array(12).fill(0);
        allLeads.forEach(l => {
           const m = l.rawDate.getMonth();
           monthCounts[m] += 1;
        });
        setMonthlyChartData(MONTHS.map((m, i) => ({ label: m, value: monthCounts[i] })));
      }
    } catch (error) {
      console.log('Error fetching provider stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const businessName = user?.name || "Provider"; 
  const profilePic = user?.profilePic || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200";

  const currentStatCards = [
    { id: '1', title: 'Total Leads', value: stats.totalLeads.toLocaleString(), trend: '+12%', isUp: true, icon: 'people-outline', color: '#3B82F6' },
    { id: '2', title: 'Action Needed', value: stats.activeLeads.toString(), trend: '5 New', isUp: true, icon: 'flash-outline', color: '#F59E0B' },
    { id: '3', title: 'Profile Views', value: stats.views.toLocaleString(), trend: '+8%', isUp: true, icon: 'eye-outline', color: '#10B981' },
  ];

  // Highest value for chart scaling
  const maxChartValue = Math.max(...monthlyChartData.map(d => d.value), 10);

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <View style={styles.logoIconBg}>
           <Ionicons name="pie-chart" size={18} color="#FFF" />
        </View>
        <Text style={styles.logoText}>Local<Text style={{color: colors.primary}}>Hub</Text></Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sidebarNavGroup}>
          <Text style={styles.sidebarLabel}>MAIN MENU</Text>
          {sidebarMenu.slice(0, 5).map((item) => renderSidebarItem(item))}
          
          <Text style={[styles.sidebarLabel, { marginTop: 24 }]}>GENERAL</Text>
          {sidebarMenu.slice(5).map((item) => renderSidebarItem(item))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSidebarItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, activeMenu === item.id && styles.activeMenuItem]}
      onPress={() => {
        setActiveMenu(item.id);
        if (item.id === 'listings') navigation.navigate('MyListingsTab');
        else if (item.id === 'leads') navigation.navigate('LeadsTab');
        else if (item.id === 'dashboard') navigation.navigate('HomeTab');
        else if (item.id === 'analytics') navigation.navigate('MoreTab');
        else if (item.id === 'reviews') navigation.navigate('Reviews');
        else if (item.id === 'subscription') navigation.navigate('Earnings');
        else if (item.id === 'settings') navigation.navigate('Settings');
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
  );

  const renderMainContent = () => (
    <View style={styles.mainWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Absolute Header Background */}
        <LinearGradient
          colors={[colors.primary, '#E65C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        />

        {/* Top Navigation / Header Area */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingGreeting}>Partner Dashboard</Text>
            <Text style={styles.greetingTitle}>{businessName}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChatList')}>
              <Ionicons name="chatbubbles" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.badge} />
              <Ionicons name="notifications" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentPadding}>
          
          {/* Profile Strength Meter - NEW */}
          <AnimatedFadeIn delay={50} duration={600}>
            <View style={styles.strengthCard}>
                <View style={styles.strengthHeader}>
                    <Text style={styles.strengthTitle}>Profile Strength</Text>
                    <Text style={[styles.strengthValue, { color: profileStrength > 80 ? '#10B981' : colors.primary }]}>
                        {profileStrength}%
                    </Text>
                </View>
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFill, { width: `${profileStrength}%`, backgroundColor: profileStrength > 80 ? '#10B981' : colors.primary }]} />
                </View>
                <Text style={styles.strengthTip}>
                    {profileStrength < 100 
                        ? `💡 Pro Tip: ${profileStrength < 60 ? "Add a business photo" : "Write a detailed description"} to get more leads.`
                        : "✅ Your profile is optimized and ready for growth!"}
                </Text>
            </View>
          </AnimatedFadeIn>

          {/* Quick Actions Grid - NEW */}
          <AnimatedFadeIn delay={100} duration={600}>
            <View style={styles.quickGrid}>
              {[
                { label: 'Add Listing', icon: 'add-circle', color: '#10B981', route: 'AddBusiness' },
                { label: 'All Leads', icon: 'people', color: '#3B82F6', route: 'LeadsTab' },
                { label: 'Analytics', icon: 'stats-chart', color: '#F59E0B', route: 'MoreTab' },
                { label: 'Reviews', icon: 'star', color: '#8B5CF6', route: 'Reviews' },
              ].map(q => (
                <TouchableOpacity key={q.label} style={styles.quickItem} onPress={() => navigation.navigate(q.route)}>
                  <View style={[styles.quickIcon, { backgroundColor: `${q.color}15` }]}>
                    <Ionicons name={q.icon} size={24} color={q.color} />
                  </View>
                  <Text style={styles.quickLabel}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedFadeIn>
          
          {/* Stats Cards */}
          {loading ? (
             <View style={styles.statsContainer}>
               <SkeletonLoader width={(width - 72) / 2} height={140} borderRadius={24} style={{ margin: 6 }} />
               <SkeletonLoader width={(width - 72) / 2} height={140} borderRadius={24} style={{ margin: 6 }} />
             </View>
          ) : (
             <AnimatedFadeIn duration={600} style={styles.statsContainer}>
              {currentStatCards.map(stat => (
                <TouchableOpacity 
                  key={stat.id} 
                  style={[styles.statCard, { minWidth: isLargeScreen ? 200 : (width - 72) / 2 }]}
                  activeOpacity={0.9}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <View style={styles.statTop}>
                    <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                      {renderDynamicIcon(stat.icon, 24, stat.color)}
                    </View>
                    <View style={[styles.trendBadge, { backgroundColor: stat.isUp ? '#F0FDF4' : '#FEF2F2' }]}>
                      <Ionicons name={stat.isUp ? 'trending-up' : 'trending-down'} size={12} color={stat.isUp ? '#10B981' : '#EF4444'} />
                      <Text style={[styles.trendText, { color: stat.isUp ? '#10B981' : '#EF4444' }]}>{stat.trend}</Text>
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </TouchableOpacity>
              ))}
            </AnimatedFadeIn>
          )}

          {/* Graphical & Activity Split Area */}
          <View style={[styles.dashboardSplit, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
            
            <View style={[styles.chartSection, { flex: isLargeScreen ? 2 : 1, marginRight: isLargeScreen ? 20 : 0 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Lead Analytics</Text>
                <TouchableOpacity style={styles.dropdownMini}>
                  <Text style={styles.dropdownMiniText}>This Year</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.customChartContainer}>
                {loading ? (
                  <SkeletonLoader width="100%" height={180} borderRadius={16} />
                ) : (
                  monthlyChartData.map((dataPoint, index) => {
                    const heightPct = (dataPoint.value / maxChartValue) * 100;
                    const isCurrent = dataPoint.value > 0 && dataPoint.value === Math.max(...monthlyChartData.map(d => d.value)); 
                    return (
                      <View key={index} style={styles.barItem}>
                         {isCurrent && (
                           <LinearGradient colors={[colors.primary, '#E65C00']} style={styles.barValueBadge}>
                             <Text style={styles.barValueText}>{dataPoint.value}</Text>
                           </LinearGradient>
                         )}
                         <View style={{ height: '100%', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <LinearGradient
                              colors={isCurrent ? [colors.primary, '#E65C00'] : ['#E2E8F0', '#CBD5E1']}
                              style={[
                                styles.barFill, 
                                { height: `${Math.max(heightPct, 8)}%` },
                                isCurrent && { opacity: 1 }
                              ]}
                            />
                         </View>
                         <Text style={[styles.barLabel, isCurrent && { color: colors.primary, fontWeight: '800' }]}>{dataPoint.label}</Text>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LeadsTab')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.activityList}>
                {loading ? (
                  <>
                    <SkeletonLoader width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
                    <SkeletonLoader width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
                  </>
                ) : (
                  recentActivities.map((act, index) => (
                    <TouchableOpacity 
                        key={act.id} 
                        style={[styles.activityItem, index === recentActivities.length - 1 && { borderBottomWidth: 0 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                          Haptics.selectionAsync();
                          if (act.icon === 'people') { // It's a lead
                             navigation.navigate('LeadDetails', { lead: { 
                               id: act.id, 
                               customer: act.user, 
                               action: act.action, 
                               time: act.time,
                               service: 'Personal Inquiry', // Fallback for activity leads
                               status: 'New'
                             } });
                          }
                        }}
                    >
                      <View style={[styles.activityIconBg, { backgroundColor: `${act.color}15` }]}>
                        {renderDynamicIcon(act.icon, 18, act.color)}
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          <Text style={{fontWeight: '900', color: '#1E293B'}}>{act.user} </Text>
                          {act.action}
                        </Text>
                        <Text style={styles.activityTime}>{act.time}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
      <WelcomeModal isProvider={true} />
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
                  if (item.id === 'listings') navigation.navigate('MyListingsTab');
                  else if (item.id === 'leads') navigation.navigate('LeadsTab');
                  else if (item.id === 'analytics') navigation.navigate('MoreTab');
                  else if (item.id === 'reviews') navigation.navigate('Reviews');
                  else if (item.id === 'subscription') navigation.navigate('Earnings');
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
  container: { flexDirection: 'row', backgroundColor: '#F3F4F6' },
  sidebar: {
    width: 260, backgroundColor: '#FFF', borderRightWidth: 1, borderRightColor: '#F3F4F6', height: '100%',
    ...Platform.select({ web: { boxShadow: '4px 0 20px rgba(0,0,0,0.03)' } })
  },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  logoIconBg: { backgroundColor: colors.primary, padding: 6, borderRadius: 8, marginRight: 10 },
  logoText: { fontSize: 22, fontWeight: '900', color: colors.primary, letterSpacing: -0.5 },
  sidebarNavGroup: { paddingVertical: 16 },
  sidebarLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 12, paddingHorizontal: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, marginVertical: 2, borderRightWidth: 3, borderRightColor: 'transparent' },
  activeMenuItem: { backgroundColor: `${colors.primary}08`, borderRightColor: colors.primary },
  menuText: { fontSize: 15, fontWeight: '600', color: '#4B5563', marginLeft: 14 },
  activeMenuText: { color: colors.primary, fontWeight: '700' },
  
  mainContentWrapper: { flex: 1, position: 'relative' },
  mobileNav: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', maxHeight: 65,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, zIndex: 10,
  },
  mobileMenuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  activeMobileMenuItem: { backgroundColor: colors.primary, borderColor: colors.primary },
  mobileMenuText: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginLeft: 6 },
  activeMobileMenuText: { color: '#FFFFFF' },
  
  mainWrapper: { flex: 1 },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 280, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 30 },
  greetingGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  greetingTitle: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1.2 },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', marginRight: 12, position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF', zIndex: 2 },
  profileBtn: { position: 'relative' },
  profilePic: { width: 44, height: 44, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  onlineIndicator: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
  
  contentPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // NEW Quick Grid Styles
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  quickItem: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 24, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  quickIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  quickLabel: { fontSize: 11, fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.2 },

  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 28, marginHorizontal: -6 },
  statCard: {
    flex: 1, 
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22, margin: 6,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5, borderWidth: 1, borderColor: '#F8FAFC',
  },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  trendText: { fontSize: 10, fontWeight: '900', marginLeft: 4 },
  statValue: { fontSize: 30, fontWeight: '900', color: '#0F172A', marginBottom: 4, letterSpacing: -1 },
  statTitle: { fontSize: 12, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  dashboardSplit: { justifyContent: 'space-between' },
  chartSection: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, marginBottom: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  dropdownMini: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  dropdownMiniText: { fontSize: 12, fontWeight: '800', color: '#64748B', marginRight: 4 },
  seeAllText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  
  customChartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 180, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 10 },
  barItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' },
  barValueBadge: { position: 'absolute', top: -30, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 5 },
  barValueText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  barFill: { width: 12, borderRadius: 6, opacity: 0.6 },
  barLabel: { fontSize: 10, fontWeight: '600', color: '#94A3B8', marginTop: 14 },
  
  activitySection: { flex: 1, backgroundColor: '#FFF', borderRadius: 32, padding: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  activityList: { marginTop: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  activityIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, lineHeight: 22, color: '#475569', fontWeight: '500' },
  activityTime: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 4 },

  // Profile Strength Styles
  strengthCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  strengthValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  strengthTip: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default ProviderDashboardScreen;
