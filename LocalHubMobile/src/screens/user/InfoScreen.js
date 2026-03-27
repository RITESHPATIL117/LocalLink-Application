import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const InfoScreen = ({ route, navigation }) => {
  const { title, content } = route.params || { 
    title: 'Terms of Service', 
    content: 'Default terms and conditions content for LocalHub. This is a placeholder for legal documentation.' 
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.lastUpdated}>Last updated: March 2026</Text>
          
          <Text style={styles.paragraph}>
            Welcome to LocalHub. By accessing or using our platform, you agree to be bound by these {title.toLowerCase()}.
          </Text>

          <Text style={styles.subTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            LocalHub provides a platform for service discovery and connection. These terms govern your access to and use of our mobile application and related services.
          </Text>

          <Text style={styles.subTitle}>2. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            Users are responsible for maintaining the confidentiality of their account information. You agree to provide accurate and complete information when registering.
          </Text>

          <Text style={styles.subTitle}>3. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data.
          </Text>

          <Text style={styles.subTitle}>4. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            LocalHub is a marketplace connecting users and providers. We are not responsible for the quality of services provided by third-party professionals.
          </Text>

          <Text style={styles.paragraph}>
            {content}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 LocalHub India. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  backBtn: { padding: 4 },
  scrollContent: { padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 8 },
  lastUpdated: { fontSize: 13, color: '#9CA3AF', marginBottom: 24, fontWeight: '600' },
  subTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 16 },
  footer: { marginTop: 32, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
});

export default InfoScreen;
