// types/index.ts

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Firestore Timestamp type
export type Timestamp = FirebaseFirestoreTypes.Timestamp;

// --- User / Seller ---
// Represents the structure of a User/Seller document in Firestore
// This can be used for both general users and sellers.
export interface UserProfile {
  id: string; // Document ID from Firestore (could be the same as Firebase Auth UID)
  name: string;
  profilePicUrl?: string;
  phoneNumber: string;
  email?: string; // Optional, ensure it's captured during auth if needed
  joinedAt: Timestamp;
  // Seller-specific fields (optional if not all users are sellers)
  isSeller?: boolean;
  averageRating?: number; // e.g., 4.5
  reviewCount?: number; // e.g., 10
  isVerifiedSeller?: boolean; // e.g., ID verified seller
  // For chat presence
  isOnline?: boolean;
  lastSeen?: Timestamp;
}

// Represents a subset of the Firebase Auth User object
// Used for mocking and potentially for type consistency within the app
// if not directly using the SDK's User type everywhere.
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerId: string;
  // Mock-specific or app-specific extension:
  password?: string; // Used in mock data, not a real Firebase Auth User property client-side
  // Add any other fields your app directly uses from the Firebase auth user object
  // For example, if you use functions like `getIdToken()`:
  // getIdToken?: (forceRefresh?: boolean) => Promise<string>;
  // reload?: () => Promise<void>;
  // delete?: () => Promise<void>;
  // etc.
  // For this mock, we'll keep it to properties.
}


// --- Car Listing ---
// Represents the structure of a Car document in Firestore
export interface Car {
  id: string; // Document ID from Firestore
  name: string; // e.g., "Toyota Corolla"
  make: string; // e.g., "Toyota"
  model: string; // e.g., "Corolla"
  year: number; // e.g., 2021
  price: number; // Store as a number for easier querying/sorting, e.g., 1200000
  formattedPrice?: string; // Optional: for display, e.g., "1,200,000 ETB" - can be generated on client
  bodyType: string; // e.g., "Sedan", "SUV", "Hatchback", "Pickup"
  condition: 'New' | 'Used' | 'Reconditioned'; // Or other relevant conditions
  mileage: number; // e.g., 50000 (in km or miles)
  formattedMileage?: string; // Optional: "50,000 km"
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  engineDisplacement?: string; // e.g., "1.8L" or "1800cc"
  exteriorColor: string;
  interiorColor?: string;
  location: string; // e.g., "Addis Ababa, Bole"
  description: string;
  features?: string[]; // e.g., ["Air Conditioning", "Power Steering", "Sunroof"]
  images: string[]; // Array of URLs to car images
  sellerId: string; // ID of the seller (references a document in the 'users' or 'sellers' collection)
  sellerName?: string; // Denormalized for quick display on car cards
  sellerProfilePicUrl?: string; // Denormalized for quick display
  isNegotiable: boolean;
  status: 'Available' | 'Sold' | 'Pending'; // Listing status
  postedAt: Timestamp; // Firestore Timestamp of when the listing was created
  updatedAt?: Timestamp; // Firestore Timestamp of the last update
  searchKeywords?: string[]; // For text search (lowercase: make, model, year, bodyType, location etc.)
}

// For filter options on car listings
export interface CarFilters {
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  // Add other filterable fields like make, model, year range, etc.
}

// For pagination state (generic, can be used for cars or messages)
// Using DocumentSnapshot for lastVisible as it's often directly used by Firestore queries.
export interface PaginationState<TDoc extends FirebaseFirestoreTypes.DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot> {
  lastVisible: TDoc | null;
  loadingMore: boolean;
  hasMore: boolean;
}


// --- Real-time Chat ---

// Represents a single message within a chat room
export interface ChatMessage {
  id: string; // Document ID from Firestore
  roomId: string; // ID of the chat room this message belongs to
  senderId: string; // User ID of the message sender
  senderName?: string; // Denormalized for display
  senderProfilePicUrl?: string; // Denormalized
  text?: string; // Message content (text)
  imageUrl?: string; // If the message is an image
  timestamp: Timestamp; // When the message was sent
  isReadBy?: string[]; // Array of user IDs who have read this message (more robust for group)
  // Potentially system messages, etc.
  type?: 'user' | 'system' | 'image' | 'offer'; // 'offer' could be for car price offers
}

// Represents a chat room or conversation between users
export interface ChatRoom {
  id: string; // Document ID from Firestore (can be a composite ID or a unique generated ID)
  // Array of user IDs participating in this chat.
  // For 1-on-1 chat, this would be [userId1, userId2].
  // Firestore security rules often use this for access control.
  participantIds: string[];
  // Optional: Store participant summary details for quick display in chat list
  // This is denormalization and needs to be updated if user profiles change.
  participantsSummary: Array<{
    userId: string;
    name: string;
    profilePicUrl?: string;
    // Potentially isOnline status if needed for chat list display
  }>;
  lastMessage?: { // Denormalized data of the last message for chat list previews
    id?: string; // ID of the last message
    text?: string;
    senderId?: string;
    senderName?: string; // Denormalized from UserProfile
    timestamp: Timestamp;
    imageUrl?: string;
    type?: 'user' | 'system' | 'image' | 'offer';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp; // Timestamp of the last message or activity, for sorting rooms
  // For unread counts (per user in the chat room)
  // e.g., unreadMessages: { userId1: 2, userId2: 0 }
  // This is tricky to maintain accurately and atomically with distributed clients.
  // Often, unread status is better managed client-side or with functions.
  unreadMessages?: { [userId: string]: number }; // Number of unread messages for each user
  // If the chat is related to a specific car listing
  relatedCarId?: string;
  relatedCarName?: string; // Denormalized
  relatedCarImage?: string; // Denormalized (first image URL)
  // Typing indicators: { userId1: true, userId2: false }
  typingUserIds?: { [userId: string]: boolean };
}

// User-specific data related to a chat room, often stored in a subcollection
// e.g., /users/{userId}/chatRoomMetadata/{roomId}
// This helps in querying all chat rooms for a user with their specific metadata.
export interface UserChatRoomMetadata {
    id: string; // Corresponds to ChatRoom.id
    userId: string; // The user this metadata belongs to
    otherParticipantIds: string[]; // IDs of other participants, useful for 1-on-1 context
    otherParticipantsSummary?: Array<{ // Summary of other participants for display
        userId: string;
        name: string;
        profilePicUrl?: string;
    }>;
    lastReadTimestamp?: Timestamp; // Last timestamp the user read messages in this room
    unreadCount: number; // Calculated unread count for this user in this room
    isArchived?: boolean;
    isMuted?: boolean;
    // Denormalized fields from ChatRoom for easy listing and sorting
    lastMessageSnippet?: string;
    lastMessageTimestamp?: Timestamp;
    relatedCarId?: string;
    relatedCarName?: string;
    relatedCarImage?: string;
}
