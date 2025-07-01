import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

const darkGray = '#1F2937';
const blue = '#3B82F6';
const amber = '#F59E0B';
const softGray = '#F3F4F6';

// Dummy chat partner and product
const chatPartner = {
  name: 'Mekdes T.',
  profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
  online: true,
  userType: 'Seller',
};

const product = {
  image: 'https://via.placeholder.com/120x80.png?text=Car',
  title: 'Toyota Corolla 2020',
  price: '1,200,000',
};

// Dummy messages
const initialMessages = [
  {
    id: '1',
    text: 'Hi, is this car still available?',
    sent: false,
    time: '09:30',
    seen: true,
    date: 'Today',
  },
  {
    id: '2',
    text: 'Yes, it is! Would you like to see it?',
    sent: true,
    time: '09:31',
    seen: true,
    date: 'Today',
  },
  {
    id: '3',
    text: 'Can I come by this afternoon?',
    sent: false,
    time: '09:32',
    seen: false,
    date: 'Today',
  },
];

// Divider logic for Today/Yesterday
const groupMessagesByDate = (messages: any[]) => {
  const grouped: any[] = [];
  let lastDate = '';
  messages.forEach(msg => {
    if (msg.date !== lastDate) {
      grouped.push({ type: 'divider', date: msg.date, id: `divider-${msg.date}` });
      lastDate = msg.date;
    }
    grouped.push(msg);
  });
  return grouped;
};

const Chats = () => {
  const [messages, setMessages] = useState(groupMessagesByDate(initialMessages));
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showProduct, setShowProduct] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Simulate typing indicator
  useEffect(() => {
    if (input.length > 0) setTyping(true);
    else setTyping(false);
  }, [input]);

  // Scroll to bottom on new message
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: input,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seen: false,
      date: 'Today',
    };
    setMessages(prev => groupMessagesByDate([...prev.filter(m => m.type !== 'divider'), newMsg]));
    setInput('');
    setTyping(false);
    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: 'Sure, see you then!',
        sent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
        date: 'Today',
      };
      setMessages(prev => groupMessagesByDate([...prev.filter(m => m.type !== 'divider'), reply]));
    }, 1200);
  };

  // Render message bubble
  const renderMessage = ({ item }: any) => {
    if (item.type === 'divider') {
      return (
        <View className="items-center my-2">
          <View className="bg-white/70 px-4 py-1 rounded-full shadow">
            <Text className="text-xs text-gray-500">{item.date}</Text>
          </View>
        </View>
      );
    }
    return (
      <View
        className={`mb-2 px-2 flex-row ${item.sent ? 'justify-end' : 'justify-start'}`}
        style={{ alignItems: 'flex-end' }}
      >
        {!item.sent && (
          <Image
            source={{ uri: chatPartner.profilePic }}
            style={{ width: 28, height: 28, borderRadius: 14, marginRight: 4 }}
          />
        )}
        <View
          style={[
            styles.bubble,
            item.sent
              ? {
                  backgroundColor: blue,
                  alignSelf: 'flex-end',
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderBottomRightRadius: 18,
                }
              : {
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  alignSelf: 'flex-start',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderBottomRightRadius: 18,
                },
            { maxWidth: '80%' },
          ]}
        >
          <Text
            className={`text-base ${item.sent ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Inter', fontWeight: '500' }}
          >
            {item.text}
          </Text>
          <View className="flex-row items-center mt-1 justify-end">
            <Text
              className={`text-xs ${item.sent ? 'text-blue-100' : 'text-gray-500'}`}
              style={{ fontFamily: 'Inter' }}
            >
              {item.time}
            </Text>
            {item.sent && (
              <Ionicons
                name={item.seen ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={item.seen ? amber : '#fff'}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[darkGray, '#4B5563']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-4 pb-2 bg-transparent">
          <TouchableOpacity onPress={() => {}} className="mr-3">
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: chatPartner.profilePic }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
          <View className="flex-1">
            <Text className="text-white text-base font-bold">{chatPartner.name}</Text>
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-1 ${
                  chatPartner.online ? 'bg-emerald-400' : 'bg-gray-400'
                }`}
              />
              <Text className="text-xs text-gray-300">
                {chatPartner.online ? 'Online' : 'Last seen 2h ago'}
              </Text>
            </View>
            <Text className="text-xs text-amber-400" numberOfLines={1}>
              {product.title}
            </Text>
          </View>
          <TouchableOpacity className="mr-2">
            <Ionicons name="call-outline" size={22} color={blue} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Product Quick View */}
        {showProduct && (
          <TouchableOpacity
            className="mx-4 mb-2"
            activeOpacity={0.9}
            onPress={() => {}}
          >
            <View className="bg-white/80 rounded-2xl flex-row items-center px-3 py-2 shadow-md">
              <Image
                source={{ uri: product.image }}
                style={{ width: 56, height: 40, borderRadius: 10, marginRight: 10 }}
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                  {product.title}
                </Text>
                <Text className="text-emerald-700 font-semibold text-sm" numberOfLines={1}>
                  ETB {product.price}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowProduct(false)}>
                <Feather name="chevron-up" size={22} color={darkGray} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Chat Body */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing Indicator */}
        {typing && (
          <View className="flex-row items-center px-4 mb-2">
            <Text className="text-xs text-blue-200">You are typing…</Text>
            <Animated.View style={{ marginLeft: 6 }}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </Animated.View>
          </View>
        )}

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
          style={{}}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.85)', 'rgba(243,244,246,0.85)']}
            style={[
              styles.inputBar,
              {
                marginBottom: Platform.OS === 'ios' ? 24 : 12, // Move above nav bar
              },
            ]}
          >
            <TouchableOpacity>
              <Feather name="paperclip" size={22} color={blue} />
            </TouchableOpacity>
            <TextInput
              className="flex-1 mx-2 px-3 py-2 rounded-full bg-white/70 text-base text-gray-900"
              placeholder="Type a message…"
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              style={{ minHeight: 40, maxHeight: 80 }}
              multiline
            />
            <TouchableOpacity
              className="ml-2 px-3 py-2 rounded-full bg-blue-500"
              activeOpacity={0.85}
              onPress={handleSend}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 6,
    marginBottom: 6,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: blue,
    marginHorizontal: 2,
    alignSelf: 'center',
  },
});

export default Chats;