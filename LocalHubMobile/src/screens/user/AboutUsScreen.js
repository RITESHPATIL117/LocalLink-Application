import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const { width } = Dimensions.get('window');

const AboutUsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, '#E65C00']}
          style={styles.heroSection}
        >
          <AnimatedFadeIn duration={800}>
            <View style={styles.heroContent}>
              <View style={styles.logoIconBg}>
                <Ionicons name="location" size={40} color="#FFF" />
              </View>
              <Text style={styles.heroTitle}>LocalHub</Text>
              <Text style={styles.heroSubtitle}>Connecting You to the Best Local Services</Text>
            </View>
          </AnimatedFadeIn>
        </LinearGradient>

        <View style={styles.contentPadding}>
          <AnimatedFadeIn delay={200}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Mission</Text>
              <Text style={styles.paragraph}>
                At LocalHub, our mission is to empower local communities by providing a seamless, trusted platform where quality service providers and customers can connect effortlessly. We believe in the power of local businesses and aim to give them the digital presence they deserve.
              </Text>
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={400}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why Choose Us?</Text>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Verified Professionals</Text>
                  <Text style={styles.featureDesc}>Every business on our platform goes through a rigorous verification process.</Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="star" size={24} color={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Quality Guaranteed</Text>
                  <Text style={styles.featureDesc}>Read authentic reviews and ratings from your community to make informed decisions.</Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="flash" size={24} color={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Instant Booking</Text>
                  <Text style={styles.featureDesc}>Connect with providers instantly through our built-in chat and call features.</Text>
                </View>
              </View>
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={600}>
            <View style={styles.statsCard}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>10k+</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNum}>500+</Text>
                <Text style={styles.statLabel}>Partners</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNum}>50+</Text>
                <Text style={styles.statLabel}>Cities</Text>
              </View>
            </View>
          </AnimatedFadeIn>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ in India</Text>
            <Text style={styles.versionText}>LocalHub v1.2.0 Premium</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF' },
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
  heroSection: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { alignItems: 'center' },
  logoIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: { fontSize: 42, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginTop: 8 },
  contentPadding: { padding: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 16 },
  paragraph: { fontSize: 16, color: '#4B5563', lineHeight: 26 },
  featureRow: { flexDirection: 'row', marginBottom: 20 },
  featureIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: `${colors.primary}10`, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16 
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  featureDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  statsCard: { 
    flexDirection: 'row', 
    backgroundColor: '#111827', 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: '600' },
  statDivider: { width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },
  footer: { alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 14, color: '#4B5563', fontWeight: '600' },
  versionText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
});

export default AboutUsScreen;
