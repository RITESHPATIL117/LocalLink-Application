import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { logout } from '../../store/authSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProviderProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    phone: '+91 98765 43210',
    bio: 'Experienced plumber with over 10 years of experience in residential and commercial services.',
    businessName: 'SuperFast Plumbing',
  });

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Elite Profile Header */}
        <AnimatedFadeIn duration={600}>
          <View style={styles.header}>
            <LinearGradient 
              colors={[colors.primary, '#E65C00']} 
              start={{x:0, y:0}} end={{x:1, y:1}}
              style={styles.headerBg}
            />
            <View style={styles.headerContent}>
              <TouchableOpacity 
                activeOpacity={0.9} 
                style={styles.profilePicContainer}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400' }} 
                  style={styles.profilePic} 
                />
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={18} color="#FFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.userName}>{profile.name}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.statusBadge}>
                   <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                   <Text style={styles.statusText}>Verified Professional</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedFadeIn>

        <View style={styles.contentArea}>
          <AnimatedFadeIn delay={200} duration={600}>
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Account Identity</Text>
              </View>
              <ProfileInput label="Full Name" value={profile.name} icon="person" onChange={(v) => setProfile({...profile, name: v})} />
              <ProfileInput label="Email Address" value={profile.email} icon="mail" editable={false} />
              <ProfileInput label="Phone Number" value={profile.phone} icon="call" onChange={(v) => setProfile({...profile, phone: v})} keyboardType="phone-pad" />
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={400} duration={600}>
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Business Portfolio</Text>
              </View>
              <ProfileInput label="Brand Name" value={profile.businessName} icon="business" onChange={(v) => setProfile({...profile, businessName: v})} />
              <ProfileInput label="Professional Bio" value={profile.bio} icon="document-text" onChange={(v) => setProfile({...profile, bio: v})} multiline />
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={600} duration={600}>
            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Toast.show({ type: 'success', text1: 'Profile Secured', text2: 'Your updates are now live.' });
              }}
            >
              <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={StyleSheet.absoluteFill} borderRadius={16} />
              <Text style={styles.saveBtnText}>Save Securely</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                dispatch(logout());
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Relinquish Session</Text>
            </TouchableOpacity>
          </AnimatedFadeIn>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileInput = ({ label, value, onChange, icon, editable = true, multiline = false, keyboardType = 'default' }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelRow}>
        <Ionicons name={icon} size={14} color="#94A3B8" />
        <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput
      style={[styles.input, multiline && { height: 120, textAlignVertical: 'top' }, !editable && styles.disabledInput]}
      value={value}
      onChangeText={onChange}
      editable={editable}
      multiline={multiline}
      keyboardType={keyboardType}
      placeholderTextColor="#94A3B8"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFF', borderBottomLeftRadius: 36, borderBottomRightRadius: 36, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8, overflow: 'hidden' },
  headerBg: { height: 120, width: '100%' },
  headerContent: { alignItems: 'center', marginTop: -60, paddingBottom: 30 },
  profilePicContainer: { position: 'relative', marginBottom: 16 },
  profilePic: { width: 120, height: 120, borderRadius: 40, borderWidth: 6, borderColor: '#FFF' },
  editBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  userName: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 8, letterSpacing: -0.5 },
  badgeRow: { flexDirection: 'row', gap: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3EE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: '900', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  contentArea: { padding: 24, paddingBottom: 100 },
  formSection: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' },
  
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, marginLeft: 2 },
  label: { fontSize: 12, fontWeight: '800', color: '#64748B' },
  input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 15, fontWeight: '700', color: '#1E293B', borderWidth: 1.5, borderColor: '#F1F5F9' },
  disabledInput: { backgroundColor: '#F1F5F9', color: '#94A3B8' },
  
  saveBtn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  logoutText: { fontSize: 15, fontWeight: '800', color: '#EF4444' }
});

export default ProviderProfileScreen;
