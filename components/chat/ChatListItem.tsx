import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChatRoom, UserProfile, Timestamp } from '../../types'; // Assuming types is at root

interface ChatListItemProps {
  chatRoom: ChatRoom;
  currentUser: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'>; // Basic current user info
  onPress: (roomId: string, otherParticipantName: string, otherParticipantPic?: string, otherParticipantId?: string) => void;
}

const formatLastMessageTime = (timestamp?: Timestamp): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();

  // Check if it's today
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Check if it was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  // Otherwise, show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};


const ChatListItem: React.FC<ChatListItemProps> = ({ chatRoom, currentUser, onPress }) => {
  // Determine the "other" participant for display (assuming 1-on-1 chat focus for this item)
  const otherParticipantSummary = chatRoom.participantsSummary?.find(p => p.userId !== currentUser.id);

  const displayName = otherParticipantSummary?.name || chatRoom.relatedCarName || 'Chat';
  const displayImage = otherParticipantSummary?.profilePicUrl || chatRoom.relatedCarImage; // Prioritize user pic

  const lastMessageText = chatRoom.lastMessage?.type === 'image'
    ? '📷 Image'
    : chatRoom.lastMessage?.type === 'offer'
    ? `💰 Offer: ${chatRoom.lastMessage?.text?.substring(0,20) || 'Sent an offer'}`
    : chatRoom.lastMessage?.text || 'No messages yet...';

  const lastMessageTime = formatLastMessageTime(chatRoom.lastMessage?.timestamp);

  const unreadCount = chatRoom.unreadMessages?.[currentUser.id] || 0;

  const handlePress = () => {
    onPress(
        chatRoom.id,
        otherParticipantSummary?.name || 'Chat User', // Pass other user's name for chat screen header
        otherParticipantSummary?.profilePicUrl,
        otherParticipantSummary?.userId
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>
              {displayName.substring(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText} numberOfLines={1}>{displayName}</Text>
          {chatRoom.lastMessage?.timestamp && (
            <Text style={styles.timeText}>{lastMessageTime}</Text>
          )}
        </View>
        <View style={styles.messageRow}>
          <Text style={[styles.lastMessageText, unreadCount > 0 && styles.unreadText]} numberOfLines={1}>
            {chatRoom.lastMessage?.senderId === currentUser.id && 'You: '}
            {lastMessageText}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </View>
         {/* Optional: Display related car info if it's a chat about a car */}
         {chatRoom.relatedCarName && !otherParticipantSummary && ( // Show only if not clearly a user-to-user chat name
            <Text style={styles.relatedCarText} numberOfLines={1}>
                About: {chatRoom.relatedCarName}
            </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // gray-100
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#D1D5DB', // gray-300
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600', // semibold
    color: '#1F2937', // gray-800
    flexShrink: 1, // Allow name to shrink if time text is long
    marginRight: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280', // gray-500
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#4B5563', // gray-600
    flex: 1, // Take available space before badge
    marginRight: 5,
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  unreadBadge: {
    backgroundColor: '#3B82F6', // blue-500
    borderRadius: 10,
    minWidth: 20, // Ensure circle shape for single digit
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  relatedCarText: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    fontStyle: 'italic',
    marginTop: 2,
  }
});

export default React.memo(ChatListItem);
