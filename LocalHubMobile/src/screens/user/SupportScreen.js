import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const SupportScreen = ({ navigation }) => {
  const faqs = [
    { q: 'How do I book a service?', a: 'Select a category, choose a business, and tap the "Book Now" button on the details page.' },
    { q: 'How can I register my business?', a: 'Sign up as a "Provider" or contact our sales team at sales@localhub.com.' },
    { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption for all your data.' },
  ];

  return (
    <SafeAreaView style={globalStyles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Ionicons name="chatbubbles-outline" size={80} color={colors.primary} />
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>We&apos;re here 24/7 to assist you</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, i) => (
            <View key={i} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:support@localhub.com')}>
            <Ionicons name="mail-outline" size={20} color="#FFF" />
            <Text style={styles.contactBtnText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactBtn, styles.callBtn]} onPress={() => Linking.openURL('tel:+919876543210')}>
            <Ionicons name="call-outline" size={20} color="#FFF" />
            <Text style={styles.contactBtnText}>Call Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 16, color: '#111827' },
  content: { padding: 20 },
  heroSection: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 16 },
  heroSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  faqItem: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 12 },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 6 },
  faqAnswer: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  contactBtn: { 
    flexDirection: 'row', 
    backgroundColor: colors.primary, 
    height: 56, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12,
    gap: 10
  },
  callBtn: { backgroundColor: '#10B981' },
  contactBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default SupportScreen;
