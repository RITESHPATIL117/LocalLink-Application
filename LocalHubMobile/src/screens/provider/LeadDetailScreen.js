import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const LeadDetailScreen = ({ route, navigation }) => {
  const { lead: passedLead } = route.params || {};

  // Mock fallback if navigated directly without params
  const lead = passedLead || {
    id: '1',
    customer: 'Amit Sharma',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 98765 43210',
    service: 'Plumbing Repair',
    time: '24 Mar 2026, 10:30 AM',
    location: 'Plot 42, Sector 5, Gurgaon',
    message: 'I have a major leaking pipe under the kitchen sink. Water is spreading to the living room. Need someone urgently who can come in the next 1 hour.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
    budget: '₹500 - ₹1,500',
    status: 'New'
  };

  const [status, setStatus] = useState(lead.status || 'New');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
        // In a real app, we would call an API here.
        await new Promise(resolve => setTimeout(resolve, 800));
        setStatus(newStatus);
    } catch (e) {
        console.error('Status update failed:', e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Customer Profile Header */}
        <AnimatedFadeIn duration={600}>
          <View style={styles.headerCard}>
            <LinearGradient 
              colors={[colors.primary, '#E65C00']} 
              start={{x:0, y:0}} end={{x:1, y:1}}
              style={styles.headerBg}
            />
            <View style={styles.headerContent}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: lead.avatar }} style={styles.avatar} />
                <View style={styles.premiumBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFF" />
                </View>
              </View>
              <Text style={styles.userName}>{lead.customer}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status === 'New' ? '#FEE2E2' : status === 'Contacted' ? '#F0F9FF' : '#F0FDF4' }]}>
                <View style={[styles.statusDot, { backgroundColor: status === 'New' ? '#EF4444' : status === 'Contacted' ? '#0EA5E9' : '#22C55E' }]} />
                <Text style={[styles.statusText, { color: status === 'New' ? '#EF4444' : status === 'Contacted' ? '#0EA5E9' : '#22C55E' }]}>
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Action Quick Bar */}
        <AnimatedFadeIn delay={150} duration={600}>
          <View style={styles.quickBar}>
            <TouchableOpacity 
              style={[styles.quickBtn, { borderRightWidth: 1, borderColor: '#F1F5F9' }]} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`tel:${lead.customerPhone}`);
              }}
            >
              <View style={[styles.btnIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="call" size={20} color="#22C55E" />
              </View>
              <Text style={styles.btnLabel}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('ChatDetail', { name: lead.customer });
              }}
            >
              <View style={[styles.btnIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#0EA5E9" />
              </View>
              <Text style={styles.btnLabel}>Message</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>

        {/* Lead Intelligence Section */}
        <AnimatedFadeIn delay={300} duration={600}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Lead Intelligence</Text>
            </View>
            
            <View style={styles.detailCard}>
               <DetailItem icon="construct-outline" label="Requested Service" value={lead.service} color={colors.primary} />
               <View style={styles.divider} />
               <DetailItem icon="time-outline" label="Arrival Requested" value={lead.time} color="#64748B" />
               <View style={styles.divider} />
               <DetailItem icon="location-outline" label="Service Location" value={lead.location} color="#64748B" />
               <View style={styles.divider} />
               <DetailItem icon="wallet-outline" label="Budget Estimate" value={lead.budget} color="#F59E0B" />
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Requirement Brief */}
        <AnimatedFadeIn delay={450} duration={600}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Customer Requirement</Text>
            </View>
            <View style={styles.messageBox}>
               <Ionicons name="quote" size={24} color={`${colors.primary}20`} style={styles.quoteIcon} />
               <Text style={styles.messageText}>{lead.message}</Text>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Lifecycle Management */}
        <AnimatedFadeIn delay={600} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Lifecycle</Text>
            <View style={styles.lifecycleGrid}>
              {['New', 'Contacted', 'Closed'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.cycleBtn, status === s && styles.activeCycleBtn]}
                  onPress={() => handleStatusChange(s)}
                  disabled={loading}
                >
                  {loading && status !== s ? (
                    <ActivityIndicator size="small" color={status === s ? '#FFF' : '#CBD5E1'} />
                  ) : (
                    <>
                      <View style={[styles.cycleDot, { backgroundColor: status === s ? '#FFF' : '#CBD5E1' }]} />
                      <Text style={[styles.cycleBtnText, status === s && styles.activeCycleBtnText]}>{s}</Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </AnimatedFadeIn>

      </ScrollView>
    </SafeAreaView>
  );
};

const DetailItem = ({ icon, label, value, color = '#6B7280' }) => (
  <View style={styles.detailItem}>
    <View style={[styles.iconBg, { backgroundColor: `${color}10` }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  headerCard: { backgroundColor: '#FFF', borderBottomLeftRadius: 36, borderBottomRightRadius: 36, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8, marginBottom: 24, overflow: 'hidden' },
  headerBg: { height: 100, width: '100%' },
  headerContent: { alignItems: 'center', marginTop: -50, paddingBottom: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 32, borderWidth: 5, borderColor: '#FFF' },
  premiumBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: colors.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  userName: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 12, letterSpacing: -0.5 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  
  quickBar: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 24, paddingVertical: 16, marginBottom: 24, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  btnIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnLabel: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  
  section: { paddingHorizontal: 24, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' },
  
  detailCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 2 },
  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 4 },
  detailItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '800', marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  
  messageBox: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#F1F5F9', position: 'relative' },
  quoteIcon: { position: 'absolute', top: 12, right: 12 },
  messageText: { fontSize: 16, color: '#475569', lineHeight: 26, fontWeight: '600', fontStyle: 'italic' },
  
  lifecycleGrid: { flexDirection: 'row', gap: 10 },
  cycleBtn: { flex: 1, height: 54, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  activeCycleBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  cycleDot: { width: 6, height: 6, borderRadius: 3 },
  cycleBtnText: { fontSize: 14, fontWeight: '900', color: '#64748B' },
  activeCycleBtnText: { color: '#FFF' }
});

export default LeadDetailScreen;
