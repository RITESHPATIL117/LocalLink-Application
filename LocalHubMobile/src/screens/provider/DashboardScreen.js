import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import businessOwnerService from '../../services/businessOwnerService';
import leadService from '../../services/leadService';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const sidebarMenu = [
  { id: 'dashboard', title: 'Dashboard', icon: 'grid-outline' },
  { id: 'listings', title: 'My Listings', icon: 'list-outline' },
  { id: 'leads', title: 'Leads', icon: 'people-outline' },
  { id: 'reviews', title: 'Reviews', icon: 'star-outline' },
  { id: 'analytics', title: 'Analytics', icon: 'bar-chart-outline' },
  { id: 'subscription', title: 'Subscription', icon: 'card-outline' },
  { id: 'settings', title: 'Settings', icon: 'settings-outline' },
];

const statCards = [
  { id: '1', title: 'Total Leads', value: '1,248', trend: '+12%', isUp: true, icon: 'people', color: colors.primary },
  { id: '2', title: 'Active Leads', value: '45', trend: '+5%', isUp: true, icon: 'flash', color: '#F59E0B' },
  { id: '3', title: 'Profile Views', value: '8,392', trend: '-2%', isUp: false, icon: 'eye', color: '#10B981' },
];

const recentActivity = [
  { id: 'a1', user: 'Amit Sharma', action: 'Requested a quote for Plumbing Services', time: '2 mins ago', icon: 'chatbubble-ellipses', color: colors.primary },
  { id: 'a2', user: 'Neha Gupta', action: 'Left a 5-star review', time: '1 hour ago', icon: 'star', color: '#F59E0B' },
  { id: 'a3', user: 'Vikas Patil', action: 'Viewed your profile', time: '3 hours ago', icon: 'eye', color: '#10B981' },
  { id: 'a4', user: 'System', action: 'Your listing "SuperFast Plumbing" was approved', time: '1 day ago', icon: 'checkmark-circle', color: '#3B82F6' },
];

const chartData = [
  { label: 'Jan', value: 20 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 80 },
  { label: 'May', value: 99 },
  { label: 'Jun', value: 55 },
  { label: 'Jul', value: 65 },
  { label: 'Aug', value: 70 },
  { label: 'Sep', value: 85 },
  { label: 'Oct', value: 95 },
  { label: 'Nov', value: 110 },
  { label: 'Dec', value: 105 },
];

const ProviderDashboardScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({ totalLeads: 0, activeLeads: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || [];
      
      let totalLeadsCount = 0;
      let activeLeadsCount = 0;
      let totalViews = 0;

      // Fetch leads and views for all owned businesses
      await Promise.all(
        businesses.map(async (biz) => {
          totalViews += biz.views || 0;
          try {
            const leadsRes = await leadService.getLeadsByBusiness(biz.id);
            const leads = leadsRes.data || [];
            totalLeadsCount += leads.length;
            activeLeadsCount += leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
          } catch (e) {
            // ignore lead fetch error per business
          }
        })
      );

      setStats({ 
        totalLeads: totalLeadsCount, 
        activeLeads: activeLeadsCount, 
        views: totalViews 
      });
    } catch (error) {
      console.log('Error fetching provider stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const businessName = user?.name || "Provider"; 
  const profilePic = user?.profilePic || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200";

  const currentStatCards = [
    { id: '1', title: 'Total Leads', value: stats.totalLeads.toLocaleString(), trend: '+12%', isUp: true, icon: 'people', color: colors.primary },
    { id: '2', title: 'Active Leads', value: stats.activeLeads.toString(), trend: '+5%', isUp: true, icon: 'flash', color: '#F59E0B' },
    { id: '3', title: 'Profile Views', value: stats.views.toLocaleString(), trend: '-2%', isUp: false, icon: 'eye', color: '#10B981' },
  ];

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
        if (item.id === 'listings') {
          navigation.navigate('AddBusiness');
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
            <Text style={styles.greetingGreeting}>Good Morning,</Text>
            <Text style={styles.greetingTitle}>{businessName}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.badge} />
              <Ionicons name="notifications" size={20} color="#FFF" />
            </TouchableOpacity>
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          </View>
        </View>

        <View style={styles.contentPadding}>
          
          {/* Stats Cards */}
          {loading ? (
             <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
             <View style={styles.statsContainer}>
              {currentStatCards.map(stat => (
                <View key={stat.id} style={styles.statCard}>
                  <View style={styles.statTop}>
                    <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                      <Ionicons name={stat.icon} size={22} color={stat.color} />
                    </View>
                    <View style={[styles.trendBadge, { backgroundColor: stat.isUp ? '#ECFDF5' : '#FEF2F2' }]}>
                      <Ionicons name={stat.isUp ? 'trending-up' : 'trending-down'} size={12} color={stat.isUp ? '#10B981' : '#EF4444'} />
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
                <Text style={styles.sectionTitle}>Lead Analytics</Text>
                <TouchableOpacity style={styles.dropdownMini}>
                  <Text style={styles.dropdownMiniText}>This Year</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.customChartContainer}>
                {chartData.map((dataPoint, index) => {
                  const heightPct = (dataPoint.value / 110) * 100;
                  const isCurrent = index === 10; // Making November highlighted
                  return (
                    <View key={index} style={styles.barItem}>
                       {isCurrent && <Text style={styles.barValue}>{dataPoint.value}</Text>}
                       <View style={[
                         styles.barFill, 
                         { height: `${heightPct}%` },
                         isCurrent && { backgroundColor: colors.primary, opacity: 1 }
                        ]} />
                       <Text style={[styles.barLabel, isCurrent && { color: colors.primary, fontWeight: '700' }]}>{dataPoint.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
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
                        <Text style={{fontWeight: '700', color: colors.text}}>{act.user} </Text>
                        {act.action}
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
    backgroundColor: '#F3F4F6', // Lighter, more premium background
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
    backgroundColor: colors.primary,
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
    backgroundColor: '#FFF3EE', // Very faint primary hue
    borderRightColor: colors.primary,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 14,
  },
  activeMenuText: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    borderColor: 'rgba(255,255,255,0.5)',
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
    minWidth: Platform.OS === 'web' && width < 1000 ? '48%' : 100, // Handle desktop stacking
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
    fontSize: 12,
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
    marginRight: isLargeScreen ? 24 : 16,
    width: 28,
    height: '100%',
  },
  barFill: {
    width: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    opacity: 0.15, // Muted generally
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
    color: colors.primary,
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

export default ProviderDashboardScreen;
