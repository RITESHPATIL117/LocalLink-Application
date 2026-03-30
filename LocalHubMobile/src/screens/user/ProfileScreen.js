import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { logout } from '../../store/authSlice';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import Button from '../../components/Button';
import { useFavorites } from '../../hooks/useFavorites';

const menuGroups = [
  {
    title: 'ACCOUNT',
    items: [
      { id: 'personal', icon: 'person-outline', title: 'Personal Information', color: '#3B82F6' },
      { id: 'requests', icon: 'document-text-outline', title: 'My Requests', color: '#10B981' },
      { id: 'favorites', icon: 'heart-outline', title: 'Saved Items', color: '#EF4444' },
      { id: 'settings', icon: 'settings-outline', title: 'Settings', color: '#4B5563' },
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { id: 'reviews', icon: 'star-outline', title: 'My Reviews', color: '#F59E0B' },
      { id: 'recent', icon: 'time-outline', title: 'Recent Searches', color: '#6366F1' },
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { id: 'help', icon: 'help-circle-outline', title: 'Help & Support', color: '#6B7280' },
      { id: 'terms', icon: 'shield-checkmark-outline', title: 'Terms & Privacy', color: '#6B7280' },
    ]
  }
];


const ProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { favorites } = useFavorites();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[globalStyles.container, styles.guestContainer]}>
        <AnimatedFadeIn duration={600}>
          <View style={styles.guestContent}>
            <View style={styles.guestIconBg}>
              <Ionicons name="person-circle-outline" size={120} color={colors.primary} />
            </View>
            <Text style={styles.guestTitle}>Join LocalHub</Text>
            <Text style={styles.guestDesc}>
              Log in to save your favorite businesses, track your service requests, and leave helpful reviews for the community.
            </Text>
            <TouchableOpacity 
              style={styles.guestLoginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.guestLoginText}>Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      {/* Header with Menu */}
      <View style={[styles.pageHeader, isDesktop && styles.pageHeaderDesktop]}>
        {!isDesktop && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
        )}
        <Text style={styles.pageTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.maxContainer}>
          {/* Profile Header Card */}
          <AnimatedFadeIn duration={500}>
            <View style={styles.profileHeader}>
              <View style={styles.profileTop}>
                <View style={styles.avatarWrapper}>
                  <Image 
                    source={{ uri: user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0F172A&color=fff&size=200` }}
                    style={styles.avatar}
                  />
                  <TouchableOpacity 
                    style={styles.editBadge}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Ionicons name="camera" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.userName}>{user?.name || 'Local User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || 'user@localhub.com'}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'USER'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsRow}>
                <TouchableOpacity style={styles.statItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Text style={styles.statVal}>12</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity style={styles.statItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Text style={styles.statVal}>{favorites.length}</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity style={styles.statItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Text style={styles.statVal}>8</Text>
                  <Text style={styles.statLabel}>Requests</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedFadeIn>

          {/* Menu Groups */}
          <View style={styles.menuWrapper}>
            {menuGroups.map((group, groupIdx) => (
              <AnimatedFadeIn key={group.title} delay={200 + groupIdx * 100} duration={500}>
                <View style={styles.groupSection}>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  <View style={styles.cardGroup}>
                    {group.items.map((item, itemIdx) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.menuItem, itemIdx === group.items.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => {
                          if (item.id === 'personal') navigation.navigate('EditProfile');
                          if (item.id === 'requests') navigation.navigate('RequestsTab');
                          if (item.id === 'favorites') navigation.navigate('FavoritesTab');
                          if (item.id === 'settings') navigation.navigate('Settings');
                          if (item.id === 'help') navigation.navigate('Support');
                          if (item.id === 'reviews') navigation.navigate('RequestsTab'); // Or dedicated reviews if created
                          if (item.id === 'recent') navigation.navigate('HomeTab');
                          if (item.id === 'terms') navigation.navigate('Info', { title: 'Terms & Privacy' });
                        }}
                      >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                          <Ionicons name={item.icon} size={20} color={item.color} />
                        </View>
                        <Text style={styles.menuText}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </AnimatedFadeIn>
            ))}

            <AnimatedFadeIn delay={600}>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <View style={styles.logoutIconBg}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
              
              <Text style={styles.versionText}>LocalHub v1.2.0 • Build 2026</Text>
            </AnimatedFadeIn>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  pageHeaderDesktop: {
    paddingHorizontal: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  scrollContent: { paddingBottom: 20 },
  maxContainer: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  guestContainer: { backgroundColor: '#FFF', justifyContent: 'center' },
  guestContent: { alignItems: 'center', padding: 32 },
  guestIconBg: { width: 180, height: 180, borderRadius: 90, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  guestTitle: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 16 },
  guestDesc: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 26, marginBottom: 40 },
  guestLoginBtn: { backgroundColor: colors.primary, width: '100%', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 12 },
  guestLoginText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  profileHeader: { 
    margin: 20, 
    borderRadius: 28, 
    padding: 24, 
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 24, 
    elevation: 8 
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 84, height: 84, borderRadius: 28, borderWidth: 3, borderColor: 'rgba(255,255,255,0.1)' },
  editBadge: { position: 'absolute', bottom: -2, right: -2, width: 34, height: 34, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0F172A' },
  headerText: { marginLeft: 18, flex: 1 },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: '500' },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  roleText: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, paddingVertical: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  statDivider: { width: 1, height: '50%', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
  menuWrapper: { paddingHorizontal: 20 },
  groupSection: { marginBottom: 28 },
  groupTitle: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 14, marginLeft: 6 },
  cardGroup: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    overflow: 'hidden', 
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 0,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  iconContainer: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1F2937' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 24, shadowColor: '#EF4444', shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  logoutIconBg: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  versionText: { textAlign: 'center', fontSize: 11, color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 30 }
});

export default ProfileScreen;
