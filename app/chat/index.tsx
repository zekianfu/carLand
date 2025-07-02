import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import ChatListItem from '@/components/chat/ChatListItem'; // Adjusted path
import { ChatRoom, UserProfile } from '@/types'; // Adjusted path
import { subscribeToUserChatRooms } from '@/services/firebaseService'; // Adjusted path
import { useAuth } from '@/context/AuthContext'; // Import useAuth

// Mock current user - Will be removed

const ChatListScreen: React.FC = () => {
  const router = useRouter();
  const { user, userProfile, isLoading: authIsLoading } = useAuth(); // Get authenticated user

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Separate loading state for chat rooms
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authIsLoading) { // Wait for auth state to be determined
      setLoadingData(true);
      return;
    }
    if (!user || !userProfile) {
      // This case should ideally be handled by RootLayout redirecting to login.
      // If somehow reached, show error or prompt to login.
      setError("Please log in to view your chats.");
      setLoadingData(false);
      setChatRooms([]); // Clear any stale data
      return;
    }

    setLoadingData(true);
    const unsubscribe = subscribeToUserChatRooms(
      user.uid, // Use actual user ID
      (rooms) => {
        setChatRooms(rooms);
        setLoadingData(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching chat rooms:", err);
        setError("Failed to load chats.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, userProfile, authIsLoading]); // Depend on user and userProfile

  const handleChatItemPress = (
    roomId: string,
    otherParticipantName: string,
    otherParticipantPic?: string,
    otherParticipantId?: string,
  ) => {
    router.push({
      pathname: `/chat/${roomId}`,
      params: {
        chatRoomId: roomId,
        otherUserId: otherParticipantId,
        otherUserName: otherParticipantName,
        otherUserProfilePic: otherParticipantPic || '',
       },
    });
  };

  // Show loader while auth state is initially loading
  if (authIsLoading || (!user && loadingData)) { // Also show loader if user is null but we are still in initial data load phase
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  // If not logged in (and auth check is complete), show login prompt or error.
  // This state should ideally be prevented by root layout redirects.
  if (!user) {
     return (
      <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.fullScreenLoader}>
        <Text style={styles.errorText}>{error || "Please log in to see your chats."}</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // If logged in, but data is still loading for chats
  if (loadingData) {
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading Chats...</Text>
      </LinearGradient>
    );
  }

  if (error && !loadingData) { // Show error only if not loading
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.fullScreenLoader}>
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  // At this point, user is logged in and chat data fetch attempt is complete.
  const currentUserForListItem: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'> = {
    id: user.uid,
    name: userProfile?.name || user.displayName || 'Me',
    profilePicUrl: userProfile?.profilePicUrl || user.photoURL || undefined,
  };

  return (
    <LinearGradient colors={['#1F2937', '#4B5563']} style={{flex:1}}>
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'My Chats' }} />
      {chatRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no active chats.</Text>
          <Text style={styles.emptySubText}>Start a conversation from a car listing!</Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              chatRoom={item}
              currentUser={currentUserForListItem} // Use actual current user data
              onPress={handleChatItemPress}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#F3F4F6', // Tailwind gray-100
  },
  errorText: {
    fontSize: 16,
    color: '#FCA5A5', // Tailwind red-300
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D1D5DB', // Tailwind gray-300
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF', // Tailwind gray-400
    textAlign: 'center',
  },
  listContentContainer: {
    paddingBottom: 20,
    // backgroundColor: '#111827' // Example: Dark background for list items if needed
  }
});

export default ChatListScreen;
