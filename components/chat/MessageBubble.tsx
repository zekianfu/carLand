import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ChatMessage, Timestamp } from '../../types'; // Assuming types is at root

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  showSenderName?: boolean; // For group chats, or first message in a sequence
}

const formatTime = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return '';
  try {
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    // Fallback if toDate() is not available (e.g. already a Date object, though unlikely with Firestore types)
    if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return 'Invalid Date';
  }
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId, showSenderName }) => {
  const isCurrentUser = message.senderId === currentUserId;

  const renderMessageContent = () => {
    if (message.imageUrl) {
      return <Image source={{ uri: message.imageUrl }} style={styles.imageContent} resizeMode="cover" />;
    }
    if (message.type === 'offer' && message.text) { // Example for a special message type
        return (
            <View style={styles.offerContainer}>
                <Text style={styles.offerTitle}>Special Offer!</Text>
                <Text style={isCurrentUser ? styles.myMessageText : styles.otherMessageText}>{message.text}</Text>
            </View>
        );
    }
    return <Text style={isCurrentUser ? styles.myMessageText : styles.otherMessageText}>{message.text}</Text>;
  };

  if (message.type === 'system') {
    return (
        <View style={styles.systemMessageContainer}>
            <Text style={styles.systemMessageText}>{message.text}</Text>
        </View>
    )
  }

  return (
    <View
      style={[
        styles.messageRow,
        isCurrentUser ? styles.myMessageRow : styles.otherMessageRow,
      ]}
    >
      {!isCurrentUser && showSenderName && message.senderProfilePicUrl && (
        <Image source={{ uri: message.senderProfilePicUrl }} style={styles.avatar} />
      )}
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.myBubble : styles.otherBubble,
          message.imageUrl ? styles.imageBubble : {},
        ]}
      >
        {!isCurrentUser && showSenderName && (
          <Text style={styles.senderName}>{message.senderName || 'User'}</Text>
        )}
        {renderMessageContent()}
        <Text style={isCurrentUser ? styles.myTimeText : styles.otherTimeText}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'flex-end', // Align avatar with bottom of bubble
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5, // Align with bubble text area
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    elevation: 1, // Subtle shadow for Android
    shadowColor: '#000', // Subtle shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  myBubble: {
    backgroundColor: '#3B82F6', // Tailwind blue-500
    borderBottomRightRadius: 4, // Gives it a "tail"
  },
  otherBubble: {
    backgroundColor: '#E5E7EB', // Tailwind gray-200
    borderBottomLeftRadius: 4,
  },
  imageBubble: {
    paddingVertical: 0, // No padding for image itself
    paddingHorizontal: 0,
    backgroundColor: 'transparent', // Image takes full space
    overflow: 'hidden', // Ensure image corners are rounded
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563', // gray-600
    marginBottom: 2,
  },
  myMessageText: {
    fontSize: 15,
    color: 'white',
  },
  otherMessageText: {
    fontSize: 15,
    color: '#1F2937', // gray-800
  },
  myTimeText: {
    fontSize: 10,
    color: '#EFF6FF', // Tailwind blue-50
    alignSelf: 'flex-end',
    marginTop: 4,
    marginLeft: 5, // Space between text and time
  },
  otherTimeText: {
    fontSize: 10,
    color: '#6B7280', // Tailwind gray-500
    alignSelf: 'flex-end',
    marginTop: 4,
    marginLeft: 5,
  },
  imageContent: {
    width: 200,
    height: 150,
    borderRadius: 18, // Match bubble's border radius
  },
  // System Message
  systemMessageContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 10,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    textAlign: 'center',
  },
  // Offer Message Type Example
  offerContainer: {
    padding: 5,
    backgroundColor: 'rgba(255, 237, 213, 0.5)', // Light orange, example
    borderRadius: 8,
  },
  offerTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 3,
    color: '#9A3412' // Orange-800
  }
});

export default React.memo(MessageBubble);
