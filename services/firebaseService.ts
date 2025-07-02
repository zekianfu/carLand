// services/firebaseService.ts -- MOCK IMPLEMENTATION
// This file now uses mock data and simulates the behavior of Firebase services.
// All direct Firebase SDK imports and calls have been removed.
// Comments like "// Firebase REMOVED:" indicate where original Firebase logic was.

import { Car, CarFilters, ChatMessage, ChatRoom, UserProfile } from '../types';
import { Timestamp } from '../utils/timestamp'; // Using mock Timestamp

// Mock data imports
import { addMockCar as addMockCarInternal, deleteMockCar as deleteMockCarInternal, getMockCarById, getMockCars, updateMockCar as updateMockCarInternal } from '../mockData/cars';
import {
  addMockMessage as addMockMessageInternal,
  getMockMessages,
  getMockUserChatRooms,
  getOrCreateMockChatRoom,
  markMockMessagesAsRead as markMockMessagesAsReadInternal,
} from '../mockData/chat';
import { getMockUserProfile } from '../mockData/users';

// --- Helper Functions ---

/**
 * Gets a Timestamp for the current time using mock Timestamp.
 * @returns {Timestamp} Current mock timestamp.
 */
export const getCurrentTimestamp = (): Timestamp => {
  // Firebase REMOVED: firestore.Timestamp.now();
  return Timestamp.now();
};

// --- User Profile Functions ---

/**
 * Fetches a user profile by their ID from mock data.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<UserProfile | null>} The user profile or null if not found.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log(`MockService: Fetching user profile for ID: ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
  try {
    const profile = getMockUserProfile(userId);
    // To re-add Firebase: const docSnap = await firestore().collection('users').doc(userId).get();
    if (profile) {
      return profile;
    }
    console.log(`MockService: User profile not found for ID: ${userId}`);
    return null;
  } catch (error) {
    console.error("MockService: Error fetching user profile:", error);
    throw error; // Re-throw to be handled by the caller
  }
};

// --- Car Listing Functions ---

const DEFAULT_CAR_LISTINGS_LIMIT = 10;

/**
 * Fetches car listings from mock data.
 * Pagination uses `lastVisibleId` (a string car ID) instead of a Firestore DocumentSnapshot.
 * @param {(cars: Car[], newLastVisibleId: string | null, hasMore: boolean) => void} onResult - Callback for results.
 * @returns {() => void} Unsubscribe function (noop for mock).
 */
export const subscribeToCars = (
  filters: CarFilters = {},
  lastVisibleId: string | null = null,
  limit: number = DEFAULT_CAR_LISTINGS_LIMIT,
  onResult: (cars: Car[], newLastVisibleId: string | null, hasMore: boolean) => void,
  onError: (error: Error) => void
): (() => void) => {
  console.log('MockService: Subscribing to cars with filters:', filters, 'lastVisibleId:', lastVisibleId);
  setTimeout(() => {
    try {
      // To re-add Firebase: Setup Firestore query with filters, orderBy, startAfter, limit.
      // const query = firestore().collection('cars').orderBy('postedAt', 'desc')...;
      // query.onSnapshot(querySnapshot => { ... });
      const { cars, newLastVisibleId: nextId, hasMore } = getMockCars(filters, limit, lastVisibleId || undefined);
      onResult(cars, nextId, hasMore);
    } catch (error: any) {
      console.error("MockService: Error in subscribeToCars:", error);
      onError(error);
    }
  }, 100); // Simulate delay

  return () => console.log('MockService: Unsubscribed from cars (noop).');
};

/**
 * Fetches a single car by its ID from mock data.
 */
export const fetchCarById = async (carId: string): Promise<Car | null> => { // Name changed to avoid conflicts if getCarById is used elsewhere non-async
  console.log(`MockService: Fetching car by ID: ${carId}`);
  await new Promise(resolve => setTimeout(resolve, 50));
  try {
    // To re-add Firebase: const docSnap = await firestore().collection('cars').doc(carId).get();
    const car = getMockCarById(carId);
    if (!car) console.warn(`MockService: Car not found with ID: ${carId}`);
    return car;
  } catch (error) {
    console.error("MockService: Error fetching car by ID:", error);
    throw error;
  }
};

/**
 * "Subscribes" to a single car by its ID from mock data (one-time fetch).
 */
export const subscribeToCarById = (
  carId: string,
  onResult: (car: Car | null) => void,
  onError: (error: Error) => void
): (() => void) => {
  console.log(`MockService: Subscribing to car by ID: ${carId}`);
  setTimeout(() => {
    try {
      // To re-add Firebase: firestore().collection('cars').doc(carId).onSnapshot(docSnap => { ... });
      const car = getMockCarById(carId);
      if (!car) console.warn(`MockService: Car not found with ID (real-time mock): ${carId}`);
      onResult(car);
    } catch (error: any) {
      console.error("MockService: Error in subscribeToCarById:", error);
      onError(error);
    }
  }, 80);

  return () => console.log(`MockService: Unsubscribed from car ${carId} (noop).`);
};

/**
 * Adds a new car listing to the mock data (in-memory).
 */
export const addListing = async (
    carData: Omit<Car, 'id' | 'postedAt' | 'searchKeywords' | 'ownerName' | 'ownerProfilePic' | 'userId' | 'isSold'>,
    userId: string
): Promise<Car> => {
    console.log('MockService: Adding new car listing for user:', userId);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
        const ownerProfile = getMockUserProfile(userId);
        if (!ownerProfile) throw new Error(`User profile not found for userId ${userId}`);
        // To re-add Firebase: const docRef = await firestore().collection('cars').add({ ... });
        const newCar = addMockCarInternal(carData, userId, ownerProfile.name, ownerProfile.profilePicUrl);
        return newCar;
    } catch (error) {
        console.error("MockService: Error adding car listing:", error);
        throw error;
    }
};

/**
 * Updates an existing car listing in the mock data.
 */
export const updateListing = async (
    carId: string,
    data: Partial<Omit<Car, 'id' | 'postedAt' | 'userId' | 'ownerName' | 'ownerProfilePic' | 'searchKeywords' | 'isSold'>>
): Promise<Car | null> => {
    console.log(`MockService: Updating car listing ${carId}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
        // To re-add Firebase: await firestore().collection('cars').doc(carId).update(data);
        const updated = updateMockCarInternal(carId, data);
        if (!updated) console.warn(`MockService: Car ${carId} not found or not updatable.`);
        return updated;
    } catch (error) {
        console.error("MockService: Error updating listing:", error);
        throw error;
    }
};

/**
 * Deletes a car listing from the mock data.
 */
export const deleteListing = async (carId: string): Promise<boolean> => {
    console.log(`MockService: Deleting car listing ${carId}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
        // To re-add Firebase: await firestore().collection('cars').doc(carId).delete();
        const deleted = deleteMockCarInternal(carId);
        if (!deleted) console.warn(`MockService: Car ${carId} not found for deletion.`);
        return deleted;
    } catch (error) {
        console.error("MockService: Error deleting listing:", error);
        throw error;
    }
};

// --- Chat Functions ---
const DEFAULT_MESSAGES_LIMIT = 20;

/**
 * Creates or gets an existing 1-on-1 chat room from mock data.
 */
export const getOrCreateOneOnOneChatRoom = async (
  currentUserId: string,
  otherUserId: string,
  currentUserProfileSummary: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'>,
  otherUserProfileSummary: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'>,
  relatedCarData?: { carId: string; carName: string; carImage?: string; }
): Promise<string> => {
  console.log(`MockService: Getting/creating chat room for ${currentUserId} and ${otherUserId}`);
  await new Promise(resolve => setTimeout(resolve, 70));
  try {
    // To re-add Firebase: Implement logic to get or create room doc in Firestore.
    const room = getOrCreateMockChatRoom(currentUserId, otherUserId, currentUserProfileSummary, otherUserProfileSummary, relatedCarData);
    return room.id;
  } catch (error) {
    console.error("MockService: Error getting or creating chat room:", error);
    throw error;
  }
};

/**
 * Sends a message to a chat room using mock data.
 */
export const sendMessage = async (
  roomId: string,
  messageData: Pick<ChatMessage, 'text' | 'imageUrl' | 'type' | 'senderId' | 'senderName' | 'senderProfilePicUrl'>,
): Promise<ChatMessage> => {
  console.log(`MockService: Sending message to room ${roomId}`);
  await new Promise(resolve => setTimeout(resolve, 60));
  try {
    // To re-add Firebase: await firestore().collection('chatRooms').doc(roomId).collection('messages').add(newMessage);
    // Also update room's lastMessage, updatedAt, unread counts (ideally via a Firebase Function).
    const newMessage = addMockMessageInternal(roomId, messageData);
    return newMessage;
  } catch (error) {
    console.error("MockService: Error sending message:", error);
    throw error;
  }
};

/**
 * Subscribes to messages in a chat room from mock data.
 * Pagination uses `lastVisibleMessageId`.
 */
export const subscribeToMessages = (
  roomId: string,
  onResult: (messages: ChatMessage[], newLastVisibleId: string | null, hasMore: boolean) => void,
  onError: (error: Error) => void,
  lastVisibleMessageId: string | null = null,
  limit: number = DEFAULT_MESSAGES_LIMIT
): (() => void) => {
  console.log(`MockService: Subscribing to messages for room ${roomId}, lastVisibleId: ${lastVisibleMessageId}`);
  setTimeout(() => {
    try {
      // To re-add Firebase: Setup Firestore query for messages subcollection.
      // query.onSnapshot(querySnapshot => { ... });
      const { messages, newLastVisibleId, hasMore } = getMockMessages(roomId, limit, lastVisibleMessageId || undefined);
      onResult(messages, newLastVisibleId, hasMore);
    } catch (error: any) {
      console.error("MockService: Error in subscribeToMessages:", error);
      onError(error);
    }
  }, 120);

  return () => console.log(`MockService: Unsubscribed from messages in room ${roomId} (noop).`);
};

/**
 * Subscribes to the current user's chat rooms from mock data.
 */
export const subscribeToUserChatRooms = (
  currentUserId: string,
  onResult: (chatRooms: ChatRoom[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  console.log(`MockService: Subscribing to chat rooms for user ${currentUserId}`);
  setTimeout(() => {
    try {
      // To re-add Firebase: Setup Firestore query for chatRooms where participantIds array-contains currentUserId.
      // query.onSnapshot(querySnapshot => { ... });
      const rooms = getMockUserChatRooms(currentUserId);
      onResult(rooms);
    } catch (error: any) {
      console.error("MockService: Error in subscribeToUserChatRooms:", error);
      onError(error);
    }
  }, 90);

  return () => console.log(`MockService: Unsubscribed from user chat rooms for ${currentUserId} (noop).`);
};

/**
 * Marks messages in a room as read by the current user in mock data.
 */
export const markMessagesAsRead = async (roomId: string, currentUserId: string): Promise<void> => {
  console.log(`MockService: Marking messages as read in room ${roomId} for user ${currentUserId}`);
  await new Promise(resolve => setTimeout(resolve, 40));
  try {
    // To re-add Firebase: Update unreadMessages count in room doc.
    // Or update isReadBy array in message docs (more complex).
    markMockMessagesAsReadInternal(roomId, currentUserId);
  } catch (error) {
    console.error("MockService: Error marking messages as read:", error);
  }
};

// --- (Optional) User Presence ---
// Stubs for user presence and typing indicators. Implement with mock state if UI depends on them.

export const updateUserPresence = async (userId: string, isOnline: boolean): Promise<void> => {
  // Firebase REMOVED: Firestore update for user presence.
  console.log(`MockService: updateUserPresence for ${userId}, isOnline: ${isOnline} (noop).`);
  // Mock implementation: Could update a property on the mock user profile if needed.
  // e.g., const profile = getMockUserProfile(userId); if (profile) { profile.isOnline = isOnline; profile.lastSeen = Timestamp.now(); }
  return Promise.resolve();
};

export const setTypingIndicator = async (roomId: string, userId: string, isTyping: boolean): Promise<void> => {
  // Firebase REMOVED: Firestore update for typing indicators in a room.
  console.log(`MockService: setTypingIndicator for room ${roomId}, user ${userId}, isTyping: ${isTyping} (noop).`);
  // Mock implementation: Could update a property on the mock chat room if needed.
  // e.g., const room = ...; if (room) { room.typingUserIds[userId] = isTyping; }
  return Promise.resolve();
};
