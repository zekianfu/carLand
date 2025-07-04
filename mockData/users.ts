import { FirebaseUser, UserProfile } from '../types'; // Adjust path as necessary
import { Timestamp } from '../utils/timestamp'; // Mock Timestamp

// Mock FirebaseUser type (subset of what @react-native-firebase/auth User provides)
export const mockUsers: Record<string, FirebaseUser> = {
  'user1@example.com': {
    uid: 'user1@example.com',
    email: 'user1@example.com',
    displayName: 'Alice Wonderland',
    photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date('2023-01-01T10:00:00Z').toISOString(),
      lastSignInTime: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    providerId: 'password',
    password: 'password',
  } as FirebaseUser,
  'user2@example.com': {
    uid: 'user2@example.com',
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
    password: 'password',
  } as FirebaseUser,
};


export const mockUserProfiles: Record<string, UserProfile> = {
  'user1@example.com': {
    id: 'user1@example.com',
    email: 'user1@example.com',
    name: 'Alice Wonderland',
    profilePicUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    phoneNumber: '123-456-7890',
    joinedAt: Timestamp.fromDate(new Date('2023-01-01T10:00:00Z')),
    isSeller: true,
    bio: 'Loves to drive and explore new places. Looking for a reliable SUV.',
    location: 'Wonderland, CA',
  },
  'user2@example.com': {
    id: 'user2@example.com',
    email: 'user2@example.com',
    name: 'Bob The Builder',
    profilePicUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    phoneNumber: '987-654-3210',
    joinedAt: Timestamp.fromDate(new Date('2023-01-15T11:00:00Z')),
    isSeller: false,
    bio: 'Passionate about vintage cars and restoration projects.',
    location: 'Builder City, TX',
  },
  'user3@example.com': {
    id: 'user3@example.com',
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
  // Ensure email is used as the primary key and for uid/id fields.
  // For this mock system, we assume user.email is always provided for new users.
  if (!user.email) {
    console.error("addMockUser Error: user.email is missing. Cannot add user.");
    return;
  }
  const emailKey = user.email;

  // Check for duplicates in initial mock users and newly added mock users
  if (mockUsers[emailKey] || newMockUsers[emailKey]) {
    console.error(`addMockUser Error: User with email ${emailKey} already exists.`);
    return; // Or throw new Error(`User with email ${emailKey} already exists.`);
  }

  // Define default profile values
  const defaultProfileValues: Partial<UserProfile> = {
    profilePicUrl: 'https://via.placeholder.com/150/000000/FFFFFF/?text=User', // Default avatar
    isSeller: false,
    bio: 'New user of the platform.',
    location: 'Not specified',
    joinedAt: Timestamp.now(), // Set join date to now if not provided
  };

  // Merge provided profile with defaults. Provided values will override defaults.
  const completeProfile: UserProfile = {
    ...defaultProfileValues,
    ...profile, // User-provided profile data
    id: emailKey, // Ensure ID is set to emailKey
    email: emailKey, // Ensure email is set
    // Ensure `name` and `phoneNumber` are present, or handle if they can be optional
    // For now, assuming `profile` input to `addMockUser` will include `name` and `phoneNumber`
    // as they are not optional in UserProfile type.
    // `joinedAt` will be overridden by profile.joinedAt if it exists, otherwise default is used.
  };

  newMockUsers[emailKey] = { ...user, uid: emailKey, email: emailKey } as FirebaseUser;
  newMockUserProfiles[emailKey] = completeProfile;
  console.log(`Mock user ${emailKey} added successfully with profile:`, completeProfile);
};

export const findMockUserByEmail = (email: string): FirebaseUser | null => {
  const existingUser = Object.values(mockUsers).find(u => u.email === email);
  if (existingUser) return { ...existingUser } as FirebaseUser; // Cast to FirebaseUser
  const newUser = Object.values(newMockUsers).find(u => u.email === email);
  return newUser ? { ...newUser } as FirebaseUser : null; // Cast to FirebaseUser
};

export const findMockUserProfileByEmail = (email: string): UserProfile | null => {
  // Directly use email to lookup in mockUserProfiles and newMockUserProfiles
  const profile = mockUserProfiles[email] || newMockUserProfiles[email];
  return profile ? { ...profile } : null;
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
