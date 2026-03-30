import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const dummyNotifications = [
  {
    id: '1',
    title: 'New Lead Received!',
    message: 'Amit Sharma is interested in your Plumbing services.',
    time: '2 mins ago',
    type: 'lead',
    icon: 'people',
    unread: true,
  },
  {
    id: '2',
    title: 'Listing Approved!',
    message: 'Your business "SuperFast Plumbing" is now live.',
    time: '1 hour ago',
    type: 'system',
    icon: 'checkmark-circle',
    unread: false,
  },
  {
    id: '3',
    title: 'Payment Received',
    message: '₹1,200 has been added to your balance.',
    time: 'Yesterday',
    type: 'payment',
    icon: 'wallet',
    unread: false,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(dummyNotifications);

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const renderItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 80} duration={600}>
      <TouchableOpacity 
        style={[styles.notifCard, item.unread && styles.unreadCard]}
        onPress={() => {
            Haptics.selectionAsync();
            // In a real app, mark this specific one as read
        }}
      >
        <View style={[styles.iconWrapper, { backgroundColor: item.type === 'lead' ? '#F0F9FF' : item.type === 'payment' ? '#F0FDF4' : '#FFFBEB' }]}>
          <Ionicons 
            name={item.icon} 
            size={22} 
            color={item.type === 'lead' ? '#0EA5E9' : item.type === 'payment' ? '#22C55E' : '#D97706'} 
          />
        </View>
        
        <View style={styles.notifContent}>
          <View style={styles.notifMeta}>
            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.timeLabel}>{item.time}</Text>
          </View>
          <Text style={styles.messagePreview} numberOfLines={2}>{item.message}</Text>
          
          <View style={styles.cardFooter}>
             <View style={styles.typeBadge}>
                <View style={[styles.typeDot, { backgroundColor: item.type === 'lead' ? '#0EA5E9' : item.type === 'payment' ? '#22C55E' : '#D97706' }]} />
                <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
             </View>
             {item.unread && (
                <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.newBadge}>
                    <Text style={styles.newText}>NEW</Text>
                </LinearGradient>
             )}
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>System Alerts</Text>
        <TouchableOpacity 
          style={styles.markBtn} 
          onPress={handleMarkAllRead}
        >
          <Ionicons name="checkmark-done-circle" size={18} color={colors.primary} />
          <Text style={styles.markRead}>Clear Unread</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>All Clear!</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1.5, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  markBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3EE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  markRead: { color: colors.primary, fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  listContainer: { padding: 20, paddingBottom: 100 },
  notifCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 28, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2 },
  unreadCard: { backgroundColor: '#F8FAFC', borderColor: `${colors.primary}20` },
  
  iconWrapper: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  notifContent: { flex: 1 },
  notifMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  notifTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', flex: 1, marginRight: 10 },
  timeLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '800' },
  messagePreview: { fontSize: 14, color: '#64748B', lineHeight: 20, fontWeight: '600', marginBottom: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 6 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 },
  
  newBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  newText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#94A3B8', fontWeight: '800', marginTop: 16 }
});

export default NotificationsScreen;
