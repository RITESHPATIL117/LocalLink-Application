import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';

const dummyChats = [
  {
    id: '1',
    name: 'Amit Sharma',
    lastMessage: 'When can you visit my office?',
    time: '12:45 PM',
    unread: 2,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150',
  },
  {
    id: '2',
    name: 'Neha Gupta',
    lastMessage: 'Okay, sounds good to me.',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
  },
  {
    id: '3',
    name: 'System Alerts',
    lastMessage: 'Your listing is approved!',
    time: '2 days ago',
    unread: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=150', // Logo placeholder
  }
];

const ChatListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => navigation.navigate('ChatDetail', { name: item.name })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <AnimatedFadeIn duration={500}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </AnimatedFadeIn>

      <AnimatedFadeIn delay={100} duration={500}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Search conversations..." 
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
      </AnimatedFadeIn>

      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listArea}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  iconBtn: { padding: 4 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#111827' },
  listArea: { paddingHorizontal: 24, paddingBottom: 40 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: { flex: 1, marginLeft: 16 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  timeText: { fontSize: 13, color: '#9CA3AF' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#6B7280', flex: 1, marginRight: 10 },
  unreadBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
});

export default ChatListScreen;
