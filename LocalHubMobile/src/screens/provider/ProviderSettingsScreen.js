import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProviderSettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="notifications-outline" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Communications</Text>
        </View>
        <View style={styles.settingsCard}>
          <SettingRow 
            icon="notifications" 
            label="Push Delivery" 
            desc="Get instant lead & payment alerts"
            value={notifications} 
            onToggle={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotifications(v);
            }} 
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="mail" 
            label="Electronic Mail" 
            desc="Monthly performance summaries"
            value={emailAlerts} 
            onToggle={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEmailAlerts(v);
            }} 
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Ionicons name="shield-outline" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
        </View>
        <View style={styles.settingsCard}>
          <ActionRow 
             icon="lock-closed" 
             label="Credentials" 
             desc="Update your secure password"
             onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Toast.show({ type: 'info', text1: 'Cloud Vault', text2: 'Credential management is syncing.' });
             }} 
          />
          <View style={styles.divider} />
          <ActionRow 
             icon="finger-print" 
             label="Biometric Access" 
             desc="Unlock app with FaceID / TouchID"
             onPress={() => {
                Haptics.selectionAsync();
                Toast.show({ type: 'info', text1: 'Biometrics', text2: 'Hardware handshake in progress.' });
             }} 
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Ionicons name="help-buoy-outline" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Assistance & Legal</Text>
        </View>
        <View style={styles.settingsCard}>
          <ActionRow icon="help-circle" label="Knowledge Base" desc="Frequently asked questions" onPress={() => navigation.navigate('Support')} />
          <View style={styles.divider} />
          <ActionRow icon="document-text" label="Subscription Terms" desc="View your service agreement" onPress={() => {}} />
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            dispatch(logout());
            navigation.navigate('Login');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{marginRight: 10}}/>
          <Text style={styles.logoutText}>Terminate Session</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>LocalHub Elite Pro • v2.1.0-gold</Text>
          <Text style={styles.copyright}>PURPLE LABS • © 2026</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const SettingRow = ({ icon, label, desc, value, onToggle }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
    <Switch 
      value={value} 
      onValueChange={onToggle}
      trackColor={{ false: '#E2E8F0', true: `${colors.primary}40` }}
      thumbColor={value ? colors.primary : '#FFF'}
    />
  </View>
);

const ActionRow = ({ icon, label, desc, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  scrollArea: { padding: 24, paddingBottom: 100 },
  
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 10, marginLeft: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' },
  
  settingsCard: { backgroundColor: '#FFF', borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 15, elevation: 2, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  label: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  desc: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  divider: { height: 1.5, backgroundColor: '#F8FAFC', marginHorizontal: 20 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', marginVertical: 10, padding: 20, borderRadius: 24, borderWidth: 1.5, borderColor: '#F1F5F9', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  logoutText: { color: '#EF4444', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  
  footer: { alignItems: 'center', paddingVertical: 40 },
  version: { fontSize: 12, color: '#94A3B8', fontWeight: '800', letterSpacing: 0.5 },
  copyright: { fontSize: 10, color: '#CBD5E1', marginTop: 6, fontWeight: '900', letterSpacing: 1.5 },
});

export default ProviderSettingsScreen;
