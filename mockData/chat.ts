import { ChatMessage, ChatRoom, UserProfile } from '../types'; // Adjust path as necessary
import { Timestamp } from '../utils/timestamp'; // Mock Timestamp
import { mockUserProfiles, getMockUserProfile } from './users';

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'user1_user2', // Alice and Bob
    participantIds: ['user1', 'user2'].sort(),
    participantsSummary: [
      { userId: 'user1', name: 'Alice Wonderland', profilePicUrl: mockUserProfiles['user1'].profilePicUrl },
      { userId: 'user2', name: 'Bob The Builder', profilePicUrl: mockUserProfiles['user2'].profilePicUrl },
    ].sort((a,b) => a.userId.localeCompare(b.userId)),
    createdAt: Timestamp.fromDate(new Date('2023-10-20T10:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2023-10-28T10:05:00Z')),
    lastMessage: {
      text: 'Hey Bob, are you interested in the Civic?',
      senderId: 'user1',
      senderName: 'Alice Wonderland',
      timestamp: Timestamp.fromDate(new Date('2023-10-28T10:05:00Z')),
      type: 'user',
    },
    unreadMessages: { user1: 0, user2: 1 },
    relatedCarId: 'car1', // Civic
    relatedCarName: 'Honda Civic 2020',
    relatedCarImage: 'https://example.com/civic.jpg',
  },
  {
    id: 'user1_user3', // Alice and Charlie
    participantIds: ['user1', 'user3'].sort(),
    participantsSummary: [
      { userId: 'user1', name: 'Alice Wonderland', profilePicUrl: mockUserProfiles['user1'].profilePicUrl },
      { userId: 'user3', name: 'Charlie Brown', profilePicUrl: mockUserProfiles['user3'].profilePicUrl },
    ].sort((a,b) => a.userId.localeCompare(b.userId)),
    createdAt: Timestamp.fromDate(new Date('2023-10-22T15:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2023-10-27T18:30:00Z')),
    lastMessage: {
      text: 'Thanks for the info on the Explorer!',
      senderId: 'user1',
      senderName: 'Alice Wonderland',
      timestamp: Timestamp.fromDate(new Date('2023-10-27T18:30:00Z')),
      type: 'user',
    },
    unreadMessages: { user1: 0, user3: 0 },
    // No specific car, general chat
  },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  'user1_user2': [ // Messages for Alice and Bob's room
    {
      id: 'msg1_u1u2',
      roomId: 'user1_user2',
      senderId: 'user1',
      senderName: 'Alice Wonderland',
      senderProfilePicUrl: mockUserProfiles['user1'].profilePicUrl,
      text: 'Hey Bob, are you interested in the Civic?',
      timestamp: Timestamp.fromDate(new Date('2023-10-28T10:05:00Z')),
      type: 'user',
      isReadBy: ['user1'],
    },
    {
      id: 'msg2_u1u2',
      roomId: 'user1_user2',
      senderId: 'user2',
      senderName: 'Bob The Builder',
      senderProfilePicUrl: mockUserProfiles['user2'].profilePicUrl,
      text: 'Hi Alice, yes, I saw the listing. Can you tell me more about its condition?',
      timestamp: Timestamp.fromDate(new Date('2023-10-28T10:00:00Z')), // Older than msg1
      type: 'user',
      isReadBy: ['user1', 'user2'],
    },
  ],
  'user1_user3': [ // Messages for Alice and Charlie's room
    {
      id: 'msg1_u1u3',
      roomId: 'user1_user3',
      senderId: 'user3',
      senderName: 'Charlie Brown',
      senderProfilePicUrl: mockUserProfiles['user3'].profilePicUrl,
      text: 'Hey Alice, I saw you sold the Explorer, congrats!',
      timestamp: Timestamp.fromDate(new Date('2023-10-27T18:25:00Z')),
      type: 'user',
      isReadBy: ['user1', 'user3'],
    },
    {
      id: 'msg2_u1u3',
      roomId: 'user1_user3',
      senderId: 'user1',
      senderName: 'Alice Wonderland',
      senderProfilePicUrl: mockUserProfiles['user1'].profilePicUrl,
      text: 'Thanks for the info on the Explorer!', // This matches lastMessage in room
      timestamp: Timestamp.fromDate(new Date('2023-10-27T18:30:00Z')),
      type: 'user',
      isReadBy: ['user1', 'user3'],
    },
  ],
};

// Sort messages in each room by timestamp ascending (oldest first for display)
for (const roomId in mockMessages) {
  mockMessages[roomId].sort((a, b) => (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime());
}


// In-memory store for new rooms and messages created during the session
let newMockChatRooms: ChatRoom[] = [];
let newMockMessages: Record<string, ChatMessage[]> = {};


export const getMockUserChatRooms = (currentUserId: string): ChatRoom[] => {
  const allRooms = [...mockChatRooms, ...newMockChatRooms];
  return allRooms
    .filter(room => room.participantIds.includes(currentUserId))
    .map(room => ({ // Create a copy
        ...room,
        // Update unread count dynamically for the current user based on actual messages
        unreadMessages: {
            ...room.unreadMessages,
            [currentUserId]: (mockMessages[room.id] || []).concat(newMockMessages[room.id] || [])
                .filter(msg => msg.senderId !== currentUserId && !msg.isReadBy.includes(currentUserId)).length
        }
    }))
    .sort((a, b) => (b.updatedAt as Date).getTime() - (a.updatedAt as Date).getTime()); // Newest updated first
};

const generateMockOneOnOneRoomId = (userId1: string, userId2: string): string => {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};

export const getOrCreateMockChatRoom = (
  currentUserId: string,
  otherUserId: string,
  currentUserProfileSummary: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'>,
  otherUserProfileSummary: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'>,
  relatedCarData?: { carId: string; carName: string; carImage?: string; }
): ChatRoom => {
  const roomId = generateMockOneOnOneRoomId(currentUserId, otherUserId);
  const existingRoom = [...mockChatRooms, ...newMockChatRooms].find(r => r.id === roomId);

  if (existingRoom) {
    return { ...existingRoom }; // Return a copy
  }

  const now = Timestamp.now();
  const newRoom: ChatRoom = {
    id: roomId,
    participantIds: [currentUserId, otherUserId].sort(),
    participantsSummary: [
        { userId: currentUserProfileSummary.id, name: currentUserProfileSummary.name, profilePicUrl: currentUserProfileSummary.profilePicUrl },
        { userId: otherUserProfileSummary.id, name: otherUserProfileSummary.name, profilePicUrl: otherUserProfileSummary.profilePicUrl },
    ].sort((a,b) => a.userId.localeCompare(b.userId)),
    createdAt: now,
    updatedAt: now,
    lastMessage: undefined, // No messages yet
    unreadMessages: { [currentUserId]: 0, [otherUserId]: 0 },
    ...(relatedCarData && { // Spread relatedCarData if provided
        relatedCarId: relatedCarData.carId,
        relatedCarName: relatedCarData.carName,
        relatedCarImage: relatedCarData.carImage,
    })
  };
  newMockChatRooms.push(newRoom);
  if (!newMockMessages[roomId]) {
    newMockMessages[roomId] = [];
  }
  return { ...newRoom }; // Return a copy
};


export const getMockMessages = (
  roomId: string,
  limit: number = 20,
  lastVisibleMessageId?: string
): { messages: ChatMessage[], newLastVisibleId: string | null, hasMore: boolean } => {
  const roomMessages = (mockMessages[roomId] || []).concat(newMockMessages[roomId] || []);
  // Sort descending to easily get latest for pagination (opposite of display order)
  roomMessages.sort((a, b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime());

  let startIndex = 0;
  if (lastVisibleMessageId) {
    const lastIdx = roomMessages.findIndex(m => m.id === lastVisibleMessageId);
    if (lastIdx !== -1) {
      startIndex = lastIdx + 1;
    }
  }

  const paginatedMessages = roomMessages.slice(startIndex, startIndex + limit + 1);
  const hasMore = paginatedMessages.length > limit;

  if (hasMore) {
    paginatedMessages.pop();
  }

  const newLastVisibleId = paginatedMessages.length > 0 ? paginatedMessages[paginatedMessages.length - 1].id : null;

  // Return in ascending order for display
  return { messages: paginatedMessages.map(m => ({...m})).reverse(), newLastVisibleId, hasMore };
};

export const addMockMessage = (
  roomId: string,
  messageData: Pick<ChatMessage, 'text' | 'imageUrl' | 'type' | 'senderId' | 'senderName' | 'senderProfilePicUrl'>
): ChatMessage => {
  const now = Timestamp.now();
  const senderProfile = getMockUserProfile(messageData.senderId);

  const newMessage: ChatMessage = {
    ...messageData,
    id: `msg${Date.now()}${Math.floor(Math.random() * 1000)}`,
    roomId,
    timestamp: now,
    isReadBy: [messageData.senderId], // Sender has read it
    type: messageData.imageUrl ? 'image' : (messageData.type || 'user'), // Default to user if not image
    senderName: messageData.senderName || senderProfile?.name || 'Unknown User',
    senderProfilePicUrl: messageData.senderProfilePicUrl || senderProfile?.profilePicUrl,
  };

  if (!newMockMessages[roomId]) {
    newMockMessages[roomId] = [];
  }
  newMockMessages[roomId].push(newMessage);

  // Update the corresponding chat room's last message and updatedAt
  const roomIndex = newMockChatRooms.findIndex(r => r.id === roomId);
  if (roomIndex !== -1) {
    newMockChatRooms[roomIndex].lastMessage = {
      text: newMessage.text,
      imageUrl: newMessage.imageUrl,
      senderId: newMessage.senderId,
      senderName: newMessage.senderName,
      timestamp: newMessage.timestamp,
      type: newMessage.type,
    };
    newMockChatRooms[roomIndex].updatedAt = now;
    // Increment unread count for other participants
    newMockChatRooms[roomIndex].participantIds.forEach(pid => {
        if (pid !== newMessage.senderId) {
            newMockChatRooms[roomIndex].unreadMessages[pid] = (newMockChatRooms[roomIndex].unreadMessages[pid] || 0) + 1;
        }
    });

  } else {
    const baseRoomIndex = mockChatRooms.findIndex(r => r.id === roomId);
    if (baseRoomIndex !== -1) {
        // To avoid mutating original mockChatRooms, copy it and update if necessary
        // This part can get complex if we want to reflect updates on the base mockChatRooms
        // For simplicity, we'll assume most interactions happen with rooms in newMockChatRooms or newly fetched ones
        // A more robust solution might involve a unified store for rooms.
        // For now, let's update the original mockChatRooms if found (less ideal for true "mock" immutability)
         mockChatRooms[baseRoomIndex].lastMessage = {
            text: newMessage.text,
            imageUrl: newMessage.imageUrl,
            senderId: newMessage.senderId,
            senderName: newMessage.senderName,
            timestamp: newMessage.timestamp,
            type: newMessage.type,
        };
        mockChatRooms[baseRoomIndex].updatedAt = now;
        mockChatRooms[baseRoomIndex].participantIds.forEach(pid => {
            if (pid !== newMessage.senderId) {
                mockChatRooms[baseRoomIndex].unreadMessages[pid] = (mockChatRooms[baseRoomIndex].unreadMessages[pid] || 0) + 1;
            }
        });
    }
  }

  return { ...newMessage }; // Return a copy
};

export const markMockMessagesAsRead = (roomId: string, currentUserId: string): void => {
    const allMessagesForRoom = (mockMessages[roomId] || []).concat(newMockMessages[roomId] || []);
    allMessagesForRoom.forEach(msg => {
        if (msg.senderId !== currentUserId && !msg.isReadBy.includes(currentUserId)) {
            msg.isReadBy.push(currentUserId);
        }
    });

    // Update unread count in the room object
    const room = [...mockChatRooms, ...newMockChatRooms].find(r => r.id === roomId);
    if (room) {
        room.unreadMessages[currentUserId] = 0;
        // If the room is from newMockChatRooms, update it there
        const newRoomIdx = newMockChatRooms.findIndex(r => r.id === roomId);
        if (newRoomIdx > -1) {
            newMockChatRooms[newRoomIdx].unreadMessages[currentUserId] = 0;
        }
        // If the room is from mockChatRooms, update it there (with caveats about immutability)
        const baseRoomIdx = mockChatRooms.findIndex(r => r.id === roomId);
        if (baseRoomIdx > -1) {
            mockChatRooms[baseRoomIdx].unreadMessages[currentUserId] = 0;
        }
    }
};

export const resetNewMockChatData = () => {
    newMockChatRooms = [];
    newMockMessages = {};
};

// Note: ChatMessage, ChatRoom types should be from `../types`.
// Timestamp mock needs to be consistent.
// UserProfile snippets are used in ChatRoom.participantsSummary.
// `lastMessage` in ChatRoom is a summary of the latest ChatMessage.
// `unreadMessages` is a map of userId to count.
// Initial messages are sorted ascending by time for display.
// `getMockUserChatRooms` sorts rooms by `updatedAt` descending.
// `addMockMessage` also updates the room's last message and unread counts.
// This mock is session-based for new data (newMockChatRooms, newMockMessages).
// `getMockMessages` implements basic pagination.
// `markMockMessagesAsRead` updates the `isReadBy` array and room's unread count.
// Added `resetNewMockChatData` for session cleanup.
// `addMockMessage` now correctly sets senderName and senderProfilePicUrl from messageData or fallback to profile.
// `getOrCreateMockChatRoom` now correctly uses profile summaries.
// `addMockMessage` updates `unreadMessages` for both `newMockChatRooms` and `mockChatRooms`.
// `markMockMessagesAsRead` also updates `unreadMessages` for both room lists.
// `getMockUserChatRooms` dynamically calculates unread messages for the current user.
// Initial messages in mockMessages are sorted ascending.
// Functions return copies of objects where appropriate.
