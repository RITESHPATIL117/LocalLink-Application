import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [location, setLocation] = React.useState(true);

  const SettingItem = ({ icon, title, type = 'chevron', value, onValueChange }) => (
    <TouchableOpacity style={styles.item} disabled={type === 'switch'}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {type === 'chevron' && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D5DB', true: `${colors.primary}80` }}
          thumbColor={value ? colors.primary : '#F3F4F6'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <SettingItem icon="person-outline" title="Edit Profile" />
          <SettingItem icon="lock-closed-outline" title="Change Password" />
          <SettingItem icon="shield-checkmark-outline" title="Privacy Policy" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App Settings</Text>
          <SettingItem 
            icon="notifications-outline" 
            title="Push Notifications" 
            type="switch" 
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem 
            icon="location-outline" 
            title="Location Access" 
            type="switch" 
            value={location}
            onValueChange={setLocation}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>More</Text>
          <SettingItem icon="information-circle-outline" title="About LocalHub" />
          <SettingItem icon="document-text-outline" title="Terms of Service" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 16, color: '#111827' },
  content: { padding: 20 },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 14 },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#FFF', 
    padding: 14, 
    paddingRight: 8,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  logoutBtn: { marginTop: 10, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 16 }
});

export default SettingsScreen;
