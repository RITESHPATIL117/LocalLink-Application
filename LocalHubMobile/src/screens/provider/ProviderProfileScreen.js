import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { logout } from '../../store/authSlice';

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
        
        {/* Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.profilePicContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200' }} 
              style={styles.profilePic} 
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userRole}>Business Owner</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <ProfileInput label="Full Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} />
          <ProfileInput label="Email Address" value={profile.email} editable={false} />
          <ProfileInput label="Phone Number" value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} keyboardType="phone-pad" />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <ProfileInput label="Business Name" value={profile.businessName} onChange={(v) => setProfile({...profile, businessName: v})} />
          <ProfileInput label="About Business" value={profile.bio} onChange={(v) => setProfile({...profile, bio: v})} multiline />
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => dispatch(logout())}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileInput = ({ label, value, onChange, editable = true, multiline = false, keyboardType = 'default' }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
      value={value}
      onChangeText={onChange}
      editable={editable}
      multiline={multiline}
      keyboardType={keyboardType}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF' },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profilePicContainer: { position: 'relative', marginBottom: 16 },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF3EE' },
  editBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  userName: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  userRole: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  formSection: { padding: 24, borderBottomWidth: 8, borderBottomColor: '#F9FAFB' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 8, marginLeft: 2 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#F3F4F6' },
  saveBtn: { margin: 24, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, marginBottom: 40 },
  logoutText: { marginLeft: 8, fontSize: 15, fontWeight: '700', color: '#EF4444' }
});

export default ProviderProfileScreen;
