import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'; // Removed StyleSheet
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
// Removed StyleSheet import, NativeWind classes will be used directly.
import { LinearGradient } from 'expo-linear-gradient';

import ChatListItem from '@/components/chat/ChatListItem'; // Adjusted path
import { ChatRoom, UserProfile } from '@/types'; // Adjusted path
import { subscribeToUserChatRooms } from '@/backend/services/firebaseService'; // Adjusted path
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
      <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-2.5 text-base text-gray-100">Loading...</Text>
      </LinearGradient>
    );
  }

  // If not logged in (and auth check is complete), show login prompt or error.
  // This state should ideally be prevented by root layout redirects.
  if (!user) {
     return (
      <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1 justify-center items-center p-5">
        <Text className="text-base text-red-300 text-center mb-4">{error || "Please log in to see your chats."}</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="bg-amber-500 py-3 px-8 rounded-lg mt-2">
            <Text className="text-white text-base font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // If logged in, but data is still loading for chats
  if (loadingData) {
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-2.5 text-base text-gray-100">Loading Chats...</Text>
      </LinearGradient>
    );
  }

  if (error && !loadingData) { // Show error only if not loading
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1 justify-center items-center p-5">
        <Text className="text-base text-red-300 text-center">{error}</Text>
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
    <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1">
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: 'My Chats' }} />
      {chatRooms.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-lg font-semibold text-gray-300 mb-2">You have no active chats.</Text>
          <Text className="text-sm text-gray-400 text-center">Start a conversation from a car or parts listing!</Text>
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
          // Use contentContainerStyle for padding inside the scroll area of FlatList
          contentContainerStyle={{ paddingBottom: 20, paddingTop:8 }} // Added paddingTop for spacing from header
        />
      )}
    </SafeAreaView>
    </LinearGradient>
  );
};

// StyleSheet.create block removed as styles are converted to NativeWind classes.

export default ChatListScreen;
