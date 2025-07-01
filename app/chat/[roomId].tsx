import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


import MessageBubble from '../../../components/chat/MessageBubble'; // Adjusted path
import { ChatMessage, UserProfile } from '../../../types'; // Adjusted path
import {
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  // getUserProfile, // No longer needed here as profile comes from context
} from '../../../services/firebaseService'; // Adjusted path
import { useAuth } from '../../../context/AuthContext'; // Import useAuth

// Mock current user ID will be removed.

const ChatRoomScreen: React.FC = () => {
  const router = useRouter();
  const { user, userProfile, isLoading: authIsLoading } = useAuth(); // Get auth state
  const params = useLocalSearchParams<{
    roomId?: string; // This is the dynamic segment from the filename [roomId].tsx
    chatRoomId?: string; // This might be passed if roomId isn't the primary key from params
    otherUserId?: string;
    otherUserName?: string;
    otherUserProfilePic?: string;
  }>();

  const roomId = params.roomId || params.chatRoomId; // Prefer [roomId] from path
  const otherUserName = params.otherUserName || 'Chat';
  const otherUserProfilePic = params.otherUserProfilePic;


  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lastVisibleDoc, setLastVisibleDoc] = useState<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // No longer need to fetch currentUserProfile separately, it comes from useAuth()

  // Subscribe to messages
  useEffect(() => {
    if (authIsLoading) { // Wait for auth state
        setLoading(true);
        return;
    }
    if (!user) {
        setError("Please log in to view chat messages.");
        setLoading(false);
        // router.replace('/(auth)/login'); // Or handle redirect more globally
        return;
    }
    if (!roomId) {
      setError("Chat room ID not found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setMessages([]);
    setLastVisibleDoc(null);
    setHasMoreMessages(true);

    const unsubscribe = subscribeToMessages(
      roomId,
      (fetchedMessages, newLastVisible, moreAvailable) => {
        // Prepend older messages, append new ones (logic depends on how subscribeToMessages returns them)
        // Assuming subscribeToMessages for initial load gives newest, and pagination older.
        // For now, simple set for initial, prepend for loadMore.
        setMessages(prev => {
            // Basic deduplication and ordering, assuming fetchedMessages are sorted ascending (oldest to newest)
            const messageMap = new Map(prev.map(m => [m.id, m]));
            fetchedMessages.forEach(m => messageMap.set(m.id, m));
            return Array.from(messageMap.values()).sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
        });
        if (!loadingMore) { // Only update if it's not a "load more" operation that sets its own lastVisible
            setLastVisibleDoc(newLastVisible);
        }
        setHasMoreMessages(moreAvailable);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [roomId]);

  // Mark messages as read when screen is focused or messages change
  useEffect(() => {
    if (roomId && messages.length > 0 && user) { // Ensure user exists
      markMessagesAsRead(roomId, user.uid);
    }
    // Potentially use useIsFocused from @react-navigation/native if using tabs for more precise focusing
  }, [roomId, messages, user]);


  const handleLoadMoreMessages = useCallback(() => {
    if (!hasMoreMessages || loadingMore || !roomId || !lastVisibleDoc || !user) return; // Ensure user exists

    setLoadingMore(true);
    const unsubscribe = subscribeToMessages(
      roomId,
      (olderMessages, newLastVisible, moreAvailable) => {
        setMessages((prevMessages) => [...olderMessages, ...prevMessages]); // Prepend older messages
        setLastVisibleDoc(newLastVisible);
        setHasMoreMessages(moreAvailable);
        setLoadingMore(false);
        unsubscribe(); // Unsubscribe after fetching the page
      },
      (err) => {
        console.error("Error loading more messages:", err);
        setLoadingMore(false);
        unsubscribe();
      },
      lastVisibleDoc // Pass the last visible doc for pagination
    );
  }, [hasMoreMessages, loadingMore, roomId, lastVisibleDoc, user]);


  const handleSendMessage = async () => {
    if (newMessageText.trim() === '' || !roomId || !user || !userProfile) {
        // If user or userProfile is null, they shouldn't be able to send.
        // This state should ideally be prevented by earlier checks or UI disabling.
        if(!user) Alert.alert("Error", "You must be logged in to send messages.");
        return;
    }

    const messageData: Pick<ChatMessage, 'text' | 'senderId' | 'senderName' | 'senderProfilePicUrl' | 'type'> = {
      text: newMessageText.trim(),
      senderId: user.uid, // Use actual user ID
      senderName: userProfile.name || user.displayName || 'User', // Use Firestore profile name or fallback
      senderProfilePicUrl: userProfile.profilePicUrl || user.photoURL || undefined, // Use Firestore profile pic or fallback
      type: 'user',
    };

    try {
      setNewMessageText(''); // Clear input immediately
      await sendMessage(roomId, messageData);
      // flatListRef.current?.scrollToEnd({ animated: true }); // Message will appear via onSnapshot
    } catch (e) {
      console.error("Error sending message:", e);
      // Optionally, re-set text if send fails: setNewMessageText(messageData.text);
      alert("Failed to send message.");
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]); // Scroll to end when new messages are added


  if (!roomId) { // Should be caught by useEffect earlier, but good check
    return (
        <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.errorContainer}>
            <Stack.Screen options={{ title: "Error" }} />
            <Text style={styles.errorText}>Chat room not specified.</Text>
        </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1F2937', '#4B5563']} style={{flex:1}}>
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
            title: '', // Clear default title
            headerTitle: () => ( // Custom header title component
                <View style={styles.headerTitleContainer}>
                    {otherUserProfilePic && <Image source={{uri: otherUserProfilePic}} style={styles.headerAvatar} />}
                    <Text style={styles.headerName}>{otherUserName}</Text>
                </View>
            ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
      >
        {loading && messages.length === 0 ? (
          <View style={styles.centeredMessage}><ActivityIndicator size="large" color="#F59E0B" /></View>
        ) : error ? (
          <View style={styles.centeredMessage}><Text style={styles.errorText}>{error}</Text></View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} currentUserId={user!.uid} /> // user is guaranteed to exist here by earlier checks
            )}
            contentContainerStyle={styles.listContentContainer}
            ListHeaderComponent={
              loadingMore ? <ActivityIndicator size="small" color="#FFF" style={{ marginVertical: 10 }} /> : null
            }
            onStartReached={handleLoadMoreMessages} // Using onStartReached for loading older (top)
            onStartReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            // onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })} // Initial scroll
            // onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Subsequent scrolls
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessageText}
            onChangeText={setNewMessageText}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={newMessageText.trim() === ''}>
            <Ionicons name="send" size={22} color={newMessageText.trim() === '' ? "#6B7280" : "#FFFFFF"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#111827', // Dark background for chat room
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF', // White for dark header
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FCA5A5', // Tailwind red-300
    fontSize: 16,
  },
  listContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151', // Tailwind gray-700 (darker border for dark theme)
    backgroundColor: '#1F2937', // Tailwind gray-800 (darker input area)
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120, // Allow for multiple lines
    backgroundColor: '#374151', // Tailwind gray-700
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10, // Adjust for multiline
    fontSize: 15,
    color: '#F3F4F6', // Tailwind gray-100
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#3B82F6', // Tailwind blue-500
  },
});

export default ChatRoomScreen;
