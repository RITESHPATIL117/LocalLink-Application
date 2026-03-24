import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const LeadDetailScreen = ({ route, navigation }) => {
  const { leadId = '1' } = route.params || {};
  const [status, setStatus] = useState('New');
  const [loading, setLoading] = useState(false);

  // Mock lead data
  const lead = {
    id: leadId,
    user: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '+91 98765 43210',
    service: 'Plumbing Repair',
    date: '24 Mar 2026, 10:30 AM',
    location: 'Plot 42, Sector 5, Gurgaon',
    message: 'I have a major leaking pipe under the kitchen sink. Water is spreading to the living room. Need someone urgently who can come in the next 1 hour.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
    budget: '₹500 - ₹1,500',
  };

  const handleStatusChange = (newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setStatus(newStatus);
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Customer Header */}
        <AnimatedFadeIn duration={500}>
          <View style={styles.customerHeader}>
            <Image source={{ uri: lead.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{lead.user}</Text>
            <View style={[
              styles.statusBadge, 
              status === 'New' ? styles.badgeNew : status === 'Contacted' ? styles.badgeContacted : styles.badgeClosed
            ]}>
              <Text style={[
                styles.statusText,
                status === 'New' ? styles.textNew : status === 'Contacted' ? styles.textContacted : status === 'Closed' ? styles.textClosed : {}
              ]}>{status.toUpperCase()}</Text>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Contact Actions */}
        <AnimatedFadeIn delay={150} duration={500}>
          <View style={styles.contactRow}>
            <TouchableOpacity 
              style={styles.contactBtn} 
              onPress={() => navigation.navigate('ChatDetail', { name: lead.user })}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
              <Text style={styles.contactBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contactBtn} 
              onPress={() => Linking.openURL(`tel:${lead.phone}`)}
            >
              <Ionicons name="call" size={20} color="#10B981" />
              <Text style={[styles.contactBtnText, { color: '#10B981' }]}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFadeIn>

        {/* Service Details */}
        <AnimatedFadeIn delay={300} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Requested</Text>
            <View style={styles.detailCard}>
              <DetailItem icon="construct" label="Service" value={lead.service} />
              <DetailItem icon="calendar" label="Requested On" value={lead.date} />
              <DetailItem icon="location" label="Location" value={lead.location} />
              <DetailItem icon="wallet" label="Estimate Budget" value={lead.budget} color="#F59E0B" />
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Customer Message */}
        <AnimatedFadeIn delay={450} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Message</Text>
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>"{lead.message}"</Text>
            </View>
          </View>
        </AnimatedFadeIn>

        {/* Status Actions */}
        <AnimatedFadeIn delay={600} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.statusGrid}>
              {['New', 'Contacted', 'Closed'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusOption, status === s && styles.activeStatusOption]}
                  onPress={() => handleStatusChange(s)}
                  disabled={loading}
                >
                  {loading && status !== s ? (
                    <ActivityIndicator size="small" color={status === s ? '#FFF' : '#6B7280'} />
                  ) : (
                    <Text style={[styles.statusOptionText, status === s && styles.activeStatusOptionText]}>{s}</Text>
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
  container: {
    backgroundColor: '#F9FAFB',
  },
  customerHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeNew: { backgroundColor: '#EEF2FF' },
  badgeContacted: { backgroundColor: '#FEF3C7' },
  badgeClosed: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 12, fontWeight: '800' },
  textNew: { color: '#4F46E5' },
  textContacted: { color: '#D97706' },
  textClosed: { color: '#6B7280' },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactBtnText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  messageCard: {
    backgroundColor: '#FFF3EE',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFE4D6',
  },
  messageText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeStatusOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeStatusOptionText: {
    color: '#FFF',
  },
});

export default LeadDetailScreen;
