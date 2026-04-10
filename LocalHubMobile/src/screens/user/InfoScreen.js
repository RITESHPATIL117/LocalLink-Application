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
          <Text style={styles.lastUpdated}>Version 1.0.4 • Last updated March 28, 2026</Text>
          
          <Text style={styles.paragraph}>
            By utilizing the LocalHub Mobile Application (&quot;the Service&quot;), you signify your irrevocable acceptance of these {title}. If you do not agree, please discontinue use immediately.
          </Text>

          <View style={styles.legalSection}>
            <Text style={styles.subTitle}>1. Scope of Service</Text>
            <Text style={styles.paragraph}>
              LocalHub serves as an intermediary platform connecting users with local service professionals (&quot;Providers&quot;). While we verify professional credentials, LocalHub does not guarantee the quality, safety, or legality of the services performed.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.subTitle}>2. User Obligations</Text>
            <Text style={styles.paragraph}>
              You must provide accurate information durante registration. You are solely responsible for all activity that occurs under your account. Fraudulent activity will result in immediate termination.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.subTitle}>3. Lead Generation & Booking</Text>
            <Text style={styles.paragraph}>
              Sending a &quot;Request&quot; creates a lead for the Provider. A booking is only confirmed once both parties agree on terms. LocalHub is not a party to any contract between you and the Provider.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.subTitle}>4. Payments & Refunds</Text>
            <Text style={styles.paragraph}>
              Payment terms are negotiated between the User and the Provider. For &quot;Pay After Service&quot; options, users are legally bound to fulfill payment once the agreed-upon work is completed to specified standards.
            </Text>
          </View>

          <View style={styles.legalSection}>
            <Text style={styles.subTitle}>5. Data Protection</Text>
            <Text style={styles.paragraph}>
              We collect data to improve your experience. Our use of your personal information is governed by our Global Privacy Standard. We never sell your data to third-party advertisers.
            </Text>
          </View>

          <Text style={styles.customContent}>
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
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 32, 
    padding: 28, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 20, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 10, letterSpacing: -0.5 },
  lastUpdated: { fontSize: 13, color: '#94A3B8', marginBottom: 30, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  legalSection: { marginBottom: 24, paddingLeft: 0 },
  subTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 10 },
  paragraph: { fontSize: 15, color: '#475569', lineHeight: 26, fontWeight: '500' },
  customContent: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginTop: 20 },
  footer: { marginTop: 32, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
});

export default InfoScreen;
