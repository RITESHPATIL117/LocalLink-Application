import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import SkeletonLoader from '../../components/SkeletonLoader';
import chatService from '../../services/chatService';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ChatListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await chatService.getChats();
      setChats(res.data || []);
    } catch (e) {
      console.log('Error fetching chats:', e);
      Toast.show({ type: 'error', text1: 'Connection Lost', text2: 'Unable to stream messages.' });
    } finally {
      setLoading(false);
    }
  };

  const renderChatItem = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 50} duration={600}>
      <TouchableOpacity 
        style={[styles.chatCard, item.unread > 0 && styles.unreadCard]} 
        activeOpacity={0.8}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('ChatDetail', { name: item.name, chatId: item.id });
        }}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150' }} style={styles.avatar} />
          {item.isOnline && (
            <View style={styles.onlinePill}>
              <LinearGradient colors={['#10B981', '#059669']} style={StyleSheet.absoluteFill} borderRadius={5} />
            </View>
          )}
        </View>
        
        <View style={styles.chatBody}>
          <View style={styles.chatMeta}>
            <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.timeStamp}>{item.time}</Text>
          </View>
          <View style={styles.chatPreviewRow}>
            <Text style={[styles.lastMsg, item.unread > 0 && styles.unreadMsg]} numberOfLines={1}>
                {item.lastMessage || 'Start a conversation...'}
            </Text>
            {item.unread > 0 && (
              <LinearGradient colors={[colors.primary, '#E65C00']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unread}</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <AnimatedFadeIn duration={500}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Ionicons name="create-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </AnimatedFadeIn>

      <AnimatedFadeIn delay={100} duration={500}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Search leads..." 
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </AnimatedFadeIn>

      {loading ? (
        <View style={styles.listArea}>
          <SkeletonLoader width="100%" height={90} borderRadius={20} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="100%" height={90} borderRadius={20} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="100%" height={90} borderRadius={20} />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => (item.id || Math.random()).toString()}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listArea}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="chatbubbles-outline" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Secure Messaging</Text>
              <Text style={styles.emptySubtitle}>Your end-to-end encrypted lead conversations will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  searchSection: { paddingHorizontal: 24, paddingTop: 16, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 16, height: 54, borderWidth: 1.5, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#1E293B' },
  
  listArea: { paddingHorizontal: 20, paddingBottom: 100 },
  chatCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  unreadCard: { backgroundColor: '#F8FAFC', borderColor: `${colors.primary}20` },
  
  avatarWrapper: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 20 },
  onlinePill: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: '#FFF' },
  
  chatBody: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  chatMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  userName: { fontSize: 17, fontWeight: '900', color: '#1E293B', letterSpacing: -0.3 },
  timeStamp: { fontSize: 12, color: '#94A3B8', fontWeight: '800' },
  
  chatPreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMsg: { fontSize: 14, color: '#64748B', flex: 1, fontWeight: '600' },
  unreadMsg: { color: '#1E293B', fontWeight: '800' },
  
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginLeft: 8 },
  unreadCount: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 30, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, fontWeight: '600' }
});

export default ChatListScreen;
