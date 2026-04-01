import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');

const WelcomeModal = ({ isProvider = false }) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    const hasSeen = await AsyncStorage.getItem('hasSeenWelcome');
    if (!hasSeen) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
      ]).start();
    }
  };

  const handleClose = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={20} style={styles.overlay}>
        <Animated.View style={[styles.modalCard, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.gradient}>
            
            <View style={styles.header}>
              <View style={[styles.iconBg, { backgroundColor: isProvider ? colors.secondary + '15' : colors.primary + '15' }]}>
                <Ionicons name={isProvider ? "business" : "sparkles"} size={32} color={isProvider ? colors.secondary : colors.primary} />
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>
              {isProvider ? "Empower Your Business" : "Discover Local Expertise"}
            </Text>
            <Text style={styles.desc}>
              {isProvider 
                ? "Join thousands of experts on LocalHub. Connect with customers and grow your professional presence in your city."
                : "Find trusted cleaning, plumbing, and 100+ other local services. Verified pros, direct chat, and transparent reviews."}
            </Text>

            <View style={styles.featureList}>
                <View style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.featureText}>{isProvider ? "Direct Lead Management" : "Verified Professional Network"}</Text>
                </View>
                <View style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.featureText}>{isProvider ? "Real-time Analytics Feed" : "Secure In-App Messaging"}</Text>
                </View>
                <View style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.featureText}>Premium Support 24/7</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleClose}>
              <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.btnGradient}>
                <Text style={styles.btnText}>Got It, Let's Go!</Text>
              </LinearGradient>
            </TouchableOpacity>

          </LinearGradient>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: width * 0.88, backgroundColor: '#FFF', borderRadius: 32, overflow: 'hidden', elevation: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 30 },
  gradient: { padding: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  iconBg: { width: 64, height: 64, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { padding: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 12, letterSpacing: -0.5 },
  desc: { fontSize: 16, color: '#64748B', lineHeight: 24, marginBottom: 24 },
  featureList: { marginBottom: 30 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { fontSize: 14, color: '#475569', fontWeight: '500', marginLeft: 10 },
  primaryBtn: { height: 56, borderRadius: 16, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});

export default WelcomeModal;
