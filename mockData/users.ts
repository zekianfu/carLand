import { FirebaseUser, UserProfile } from '../types'; // Adjust path as necessary
import { Timestamp } from '../utils/timestamp'; // Mock Timestamp

// Mock FirebaseUser type (subset of what @react-native-firebase/auth User provides)
export const mockUsers: Record<string, FirebaseUser> = {
  'user1': {
    uid: 'user1',
    email: 'user1@example.com',
    displayName: 'Alice Wonderland',
    photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date('2023-01-01T10:00:00Z').toISOString(),
      lastSignInTime: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    providerId: 'password', // or 'google.com'
    // Add other properties if your app uses them from the FirebaseUser object
  } as FirebaseUser, // Cast to FirebaseUser to satisfy type, actual FirebaseUser is more complex
  'user2': {
    uid: 'user2',
    email: 'user2@example.com',
    displayName: 'Bob The Builder',
    photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date('2023-01-15T11:00:00Z').toISOString(),
      lastSignInTime: new Date('2023-10-25T11:00:00Z').toISOString(),
    },
    providerId: 'password',
  } as FirebaseUser,
};


export const mockUserProfiles: Record<string, UserProfile> = {
  'user1': {
    id: 'user1',
    email: 'user1@example.com',
    name: 'Alice Wonderland',
    profilePicUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    phoneNumber: '123-456-7890',
    joinedAt: Timestamp.fromDate(new Date('2023-01-01T10:00:00Z')),
    isSeller: true,
    bio: 'Loves to drive and explore new places. Looking for a reliable SUV.',
    location: 'Wonderland, CA',
    // lastSeen: Timestamp.fromDate(new Date('2023-10-26T10:00:00Z')),
    // isOnline: true,
  },
  'user2': {
    id: 'user2',
    email: 'user2@example.com',
    name: 'Bob The Builder',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    phoneNumber: '987-654-3210',
    joinedAt: Timestamp.fromDate(new Date('2023-01-15T11:00:00Z')),
    isSeller: false,
    bio: 'Passionate about vintage cars and restoration projects.',
    location: 'Builder City, TX',
    // lastSeen: Timestamp.fromDate(new Date('2023-10-25T11:00:00Z')),
    // isOnline: false,
  },
  'user3': {
    id: 'user3',
    email: 'user3@example.com',
    name: 'Charlie Brown',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    phoneNumber: '555-555-5555',
    joinedAt: Timestamp.fromDate(new Date('2023-02-01T09:00:00Z')),
    isSeller: true,
    bio: 'Selling my trusty sedan. Well-maintained and ready for a new owner.',
    location: 'Springfield, IL',
  }
};

// Helper to get a UserProfile, ensuring it's a new object (immutable pattern)
export const getMockUserProfile = (userId: string): UserProfile | null => {
  const profile = mockUserProfiles[userId];
  return profile ? { ...profile } : null;
};

// Helper to get a FirebaseUser, ensuring it's a new object
export const getMockFirebaseUser = (userId: string): FirebaseUser | null => {
  const user = mockUsers[userId];
  return user ? { ...user } : null;
};

// In-memory store for new users during a session
let newMockUsers: Record<string, FirebaseUser> = {};
let newMockUserProfiles: Record<string, UserProfile> = {};

export const addMockUser = (user: FirebaseUser, profile: UserProfile) => {
  newMockUsers[user.uid] = { ...user } as FirebaseUser; // Cast to FirebaseUser
  newMockUserProfiles[profile.id] = { ...profile };
};

export const findMockUserByEmail = (email: string): FirebaseUser | null => {
  const existingUser = Object.values(mockUsers).find(u => u.email === email);
  if (existingUser) return { ...existingUser } as FirebaseUser; // Cast to FirebaseUser
  const newUser = Object.values(newMockUsers).find(u => u.email === email);
  return newUser ? { ...newUser } as FirebaseUser : null; // Cast to FirebaseUser
};

export const findMockUserProfileByEmail = (email: string): UserProfile | null => {
  const userId = findMockUserByEmail(email)?.uid;
  if (userId) {
    return getMockUserProfile(userId) || (newMockUserProfiles[userId] ? { ...newMockUserProfiles[userId] } : null);
  }
  return null;
};

export const resetNewMockUsers = () => {
    newMockUsers = {};
    newMockUserProfiles = {};
};
// NOTE: The FirebaseUser type from '@react-native-firebase/auth' is quite complex.
// For this mock, we're only including properties that are likely used.
// If you encounter type errors related to FirebaseUser, you may need to add more properties
// to the mockUsers objects or adjust the FirebaseUser type in your `types/index.ts`.
// The `as FirebaseUser` cast is used to satisfy the type, but the actual Firebase SDK User object
// has many more methods and properties.
// The UserProfile type should ideally come from your `types/index.ts`.
// The Timestamp type needs a mock implementation if it's not a simple Date object.
// Example:
// export const Timestamp = {
//   now: () => new Date(),
//   fromDate: (date: Date) => date,
//   toDate: (timestamp: Date) => timestamp, // Assuming it's just a Date for mock
// };
// This should be in a shared utility or directly in types.
// For now, assuming `../types` includes a compatible UserProfile and FirebaseUser (potentially simplified).
// And `../utils/timestamp` provides a mock Timestamp.
// If `UserProfile` expects `FirebaseFirestoreTypes.Timestamp`, you'll need to mock that.
// For simplicity, let's assume `joinedAt` etc. can be Date objects or a simple mock structure.
// If `FirebaseUser` is imported from `@react-native-firebase/auth` directly in other files,
// this mock might not be sufficient if those files expect the full class instance.
// The goal is to provide enough structure for the AuthContext and UI to function.

// Placeholder for FirebaseUser if not defined in types/index.ts
// export interface FirebaseUser {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   emailVerified: boolean;
//   isAnonymous: boolean;
//   metadata: {
//     creationTime?: string;
//     lastSignInTime?: string;
//   };
//   providerId: string;
//   // Add any other fields your app directly uses from the Firebase auth user object
// }
