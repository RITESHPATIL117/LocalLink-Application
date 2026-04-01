import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Linking, Platform, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import colors from '../styles/colors';
import * as Haptics from 'expo-haptics';

const SUPPORT_OPTIONS = [
  {
    id: 'call',
    title: 'Call Support',
    subtitle: 'Speak with our elite concierge',
    icon: 'call',
    color: '#10B981',
    action: () => Linking.openURL('tel:+1234567890'),
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Us',
    subtitle: 'Quick chat for fast resolutions',
    icon: 'logo-whatsapp',
    color: '#25D366',
    action: () => Linking.openURL('whatsapp://send?phone=+1234567890'),
  },
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'For detailed queries & feedback',
    icon: 'mail',
    color: '#3B82F6',
    action: () => Linking.openURL('mailto:support@localhub.com'),
  },
  {
    id: 'faq',
    title: 'Help Center',
    subtitle: 'Browse our extensive FAQs',
    icon: 'help-circle',
    color: colors.primary,
    action: () => {}, // Navigate if available
  }
];

const SupportModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.blur} onPress={onClose}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
          )}
        </Pressable>
        
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Quick Help Hub</Text>
            <Text style={styles.subtitle}>How can we assist you today?</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {SUPPORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.option}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  opt.action();
                }}
              >
                <View style={[styles.iconBg, { backgroundColor: `${opt.color}15` }]}>
                  <Ionicons name={opt.icon} size={24} color={opt.color} />
                </View>
                <View style={styles.optContent}>
                  <Text style={styles.optTitle}>{opt.title}</Text>
                  <Text style={styles.optSubtitle}>{opt.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            ))}

            <View style={styles.termsBox}>
              <Text style={styles.termsText}>
                By contacting support, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optContent: {
    flex: 1,
  },
  optTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  optSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  termsBox: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  closeBtn: {
    marginHorizontal: 20,
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default SupportModal;
