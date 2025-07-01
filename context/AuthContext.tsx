import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'; // Firebase REMOVED
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; // Firebase REMOVED

import { UserProfile, FirebaseUser } from '../types'; // Adjusted to use FirebaseUser from types
// import firestore from '@react-native-firebase/firestore'; // Firebase REMOVED
import {
  mockUserProfiles,
  mockFirebaseUsers,
  getMockUserProfile,
  getMockFirebaseUser,
  addMockUser,
  findMockUserByEmail,
  findMockUserProfileByEmail,
  resetNewMockUsers,
} from '../mockData/users';
import { Timestamp } from '../utils/timestamp';

// const USERS_COLLECTION = 'users'; // Firebase REMOVED

// Define the shape of the context value
interface AuthContextType {
  user: FirebaseUser | null; // Changed from FirebaseAuthTypes.User
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  authError: Error | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null); // Changed from FirebaseAuthTypes.User
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Firebase REMOVED: updateUserProfileInFirestore function is removed
  // Mock user profile fetching will be done directly in auth functions

  useEffect(() => {
    // Simulate initial auth check (e.g., from async storage, but here just set to not loading)
    setIsLoadingInitial(true);
    // console.log("AuthContext: Simulating initial auth state check.");
    // In a real offline app, you might load a persisted user session here.
    // For this mock, we start with no user.
    setUser(null);
    setUserProfile(null);
    setIsLoadingInitial(false);
    // Firebase REMOVED: auth().onAuthStateChanged listener removed
  }, []);

  const signInWithEmailPassword = async (email: string, password: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    console.log(`AuthContext: Attempting mock sign-in for ${email}`);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundUser = findMockUserByEmail(email);
      // In a real app, you'd also check the password. Here, we'll assume email match is enough for mock.
      if (foundUser) {
        const foundProfile = findMockUserProfileByEmail(email);
        setUser(foundUser);
        setUserProfile(foundProfile);
        console.log(`AuthContext: Mock sign-in successful for ${email}`);
      } else {
        console.log(`AuthContext: Mock sign-in failed for ${email} - user not found.`);
        throw new Error('Invalid email or password.');
      }
    } catch (error: any) {
      console.error("Mock Email SignIn Error:", error);
      setAuthError(error);
      setUser(null);
      setUserProfile(null);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    console.log(`AuthContext: Attempting mock sign-up for ${email}`);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (findMockUserByEmail(email)) {
        throw new Error('Email already in use.');
      }

      const newUid = `mockuid_${Date.now()}`;
      const creationTime = new Date().toISOString();
      const newMockAuthUser: FirebaseUser = {
        uid: newUid,
        email: email,
        displayName: displayName,
        photoURL: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`, // Generic pic
        emailVerified: false, // Or true, depending on flow
        isAnonymous: false,
        metadata: { creationTime, lastSignInTime: creationTime },
        providerId: 'password',
        // Add other necessary FirebaseUser fields as defined in your types/index.ts
      };

      const newMockProfile: UserProfile = {
        id: newUid,
        email: email,
        name: displayName,
        profilePicUrl: newMockAuthUser.photoURL,
        phoneNumber: '',
        joinedAt: Timestamp.now(), // Using mock Timestamp
        isSeller: false, // Default
        bio: `Welcome, ${displayName}!`,
        location: 'Mock City',
      };

      addMockUser(newMockAuthUser, newMockProfile); // Add to our in-session mock users
      setUser(newMockAuthUser);
      setUserProfile(newMockProfile);
      console.log(`AuthContext: Mock sign-up successful for ${email}`);

    } catch (error: any) {
      console.error("Mock Email SignUp Error:", error);
      setAuthError(error);
      setUser(null);
      setUserProfile(null);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    console.log("AuthContext: Attempting mock Google sign-in.");
    try {
      // Simulate Google Sign-In flow and delay
      await new Promise(resolve => setTimeout(resolve, 700));

      // For mock, let's pick the first user or create a new one if none exist
      let googleUser = getMockFirebaseUser('user1') || Object.values(mockFirebaseUsers)[0];
      let googleProfile = getMockUserProfile('user1') || Object.values(mockUserProfiles)[0];

      if (!googleUser) { // If no pre-defined users, create a generic Google user
        const googleUid = 'mockgoogleuid_g1';
        const creationTime = new Date().toISOString();
        googleUser = {
          uid: googleUid,
          email: 'googleuser@example.com',
          displayName: 'Google User',
          photoURL: 'https://randomuser.me/api/portraits/men/5.jpg',
          emailVerified: true,
          isAnonymous: false,
          metadata: { creationTime, lastSignInTime: creationTime },
          providerId: 'google.com',
        };
        googleProfile = {
          id: googleUid,
          email: 'googleuser@example.com',
          name: 'Google User',
          profilePicUrl: googleUser.photoURL,
          joinedAt: Timestamp.now(),
          isSeller: false,
        };
        addMockUser(googleUser, googleProfile);
      }

      setUser(googleUser);
      setUserProfile(googleProfile);
      console.log("AuthContext: Mock Google sign-in successful.");

    } catch (error: any) {
      // Firebase REMOVED: GoogleSignin status codes (error.code) not applicable here like statusCodes.SIGN_IN_CANCELLED
      console.error("Mock Google SignIn Error:", error);
      setAuthError(error);
      setUser(null);
      setUserProfile(null);
      // Simulate that only actual errors are thrown, not cancellations
      // if (error.message !== 'Mock Google Sign-In Cancelled') {
      throw error;
      // }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOutUser = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    console.log("AuthContext: Attempting mock sign-out.");
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Firebase REMOVED: GoogleSignin.revokeAccess(), GoogleSignin.signOut(), auth().signOut()

      setUser(null);
      setUserProfile(null);
      resetNewMockUsers(); // Clear any users created during the session
      console.log("AuthContext: Mock sign-out successful.");
    } catch (error: any) {
      console.error("Mock Sign Out Error:", error);
      setAuthError(error);
      // Decide if sign-out errors should be thrown to UI (less common for sign-out)
    } finally {
      setIsAuthenticating(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading: isLoadingInitial || isAuthenticating, // isLoading should reflect both initial and ongoing auth
    isAuthenticating, // Keep this for specific UI elements if needed
    authError,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signInWithGoogle,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
