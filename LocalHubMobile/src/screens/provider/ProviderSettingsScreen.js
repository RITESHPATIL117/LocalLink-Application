import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const ProviderSettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            <SettingRow 
              icon="notifications" 
              label="Push Notifications" 
              value={notifications} 
              onToggle={setNotifications} 
            />
            <SettingRow 
              icon="mail" 
              label="Email Alerts" 
              value={emailAlerts} 
              onToggle={setEmailAlerts} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          <View style={styles.settingsCard}>
            <ActionRow icon="lock-closed" label="Change Password" onPress={() => {}} />
            <ActionRow icon="shield-checkmark" label="Two-Factor Auth" onPress={() => {}} />
            <ActionRow icon="eye-off" label="Privacy Settings" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            <ActionRow icon="help-circle" label="Help Center" onPress={() => {}} />
            <ActionRow icon="chatbubble" label="Contact Support" onPress={() => {}} />
            <ActionRow icon="document-text" label="Terms & Conditions" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>LocalHub Provider v1.0.4</Text>
          <Text style={styles.copyright}>© 2026 LocalHub Inc.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const SettingRow = ({ icon, label, value, onToggle }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Switch 
      value={value} 
      onValueChange={onToggle}
      trackColor={{ false: '#E2E8F0', true: `${colors.primary}80` }}
      thumbColor={value ? colors.primary : '#FFF'}
    />
  </View>
);

const ActionRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  settingsCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF3EE', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  label: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  footer: { alignItems: 'center', paddingVertical: 40 },
  version: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  copyright: { fontSize: 12, color: '#CBD5E1', marginTop: 4 },
});

export default ProviderSettingsScreen;
