import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import chatService from '../../services/chatService';

const ChatDetailScreen = ({ route, navigation }) => {
  const { name = 'Customer', chatId = null } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello, are you available today for a plumbing leak?', sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Yes, I can come by at around 2 PM.', sender: 'me', time: '10:35 AM' },
    { id: '3', text: 'That works great! See you then.', sender: 'other', time: '10:40 AM' },
  ]);

  const flatListRef = useRef();

  React.useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      const res = await chatService.getMessages(chatId);
      if (Array.isArray(res?.data) && res.data.length > 0) {
        const normalized = res.data.map((item, index) => ({
          id: String(item.id ?? item.message_id ?? `${Date.now()}-${index}`),
          text: item.text ?? item.message ?? '',
          sender: item.sender ?? (item.sender_id ? 'other' : 'me'),
          time: item.time ?? item.created_at ?? 'Now',
        }));
        setMessages(normalized);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSend = () => {
    if (message.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: 'Just now',
    };
    setMessages([...messages, newMessage]);
    if (chatId) {
      chatService.sendMessage(chatId, message).catch(() => {});
    }
    setMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageWrapper, 
      item.sender === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myText : styles.otherText
        ]}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['bottom']}>
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="Type a message..." 
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity onPress={handleSend} disabled={message.trim() === ''}>
               <Ionicons name="send" size={24} color={message.trim() === '' ? '#CBD5E1' : colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  messageList: { padding: 20 },
  messageWrapper: { marginBottom: 20, width: '100%' },
  myMessageWrapper: { alignItems: 'flex-end' },
  otherMessageWrapper: { alignItems: 'flex-start' },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    position: 'relative',
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#FFF' },
  otherText: { color: '#1E293B' },
  timeText: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  attachBtn: { marginRight: 12 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: '#1E293B',
    marginRight: 8,
  },
});

export default ChatDetailScreen;
