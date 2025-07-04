import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useState } from 'react';
import { addMockUser, findMockUserByEmail } from '../mockData/users';

WebBrowser.maybeCompleteAuthSession();

// Define a more structured User type
export interface User {
  id?: string; // Google User ID or Firebase UID
  email?: string;
  name?: string;
  photoUrl?: string;
  accessToken?: string;
  isEmailPasswordUser?: boolean;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
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
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    // IMPORTANT: User must fill these with their own Google Cloud OAuth 2.0 client IDs
    // For Expo Go, expoClientId might be sufficient if configured in Google Cloud.
    // For dev builds and production, ensure iosClientId, androidClientId, and webClientId are correctly set up.
    expoClientId: 'YOUR_EXPO_GO_CLIENT_ID.apps.googleusercontent.com', // e.g., from Google Cloud credentials for "Web application" type if using Expo Go proxy
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Often same as expoClientId or a separate one for web
    scopes: ['profile', 'email'], // Request user profile and email
  });

  React.useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        if (authentication?.accessToken) {
          setIsAuthenticating(true);
          // Fetch user profile from Google
          try {
            const googleUserInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
              headers: { Authorization: `Bearer ${authentication.accessToken}` },
            });
            const googleUserInfo = await googleUserInfoResponse.json();
            setUser({
              id: googleUserInfo.id,
              email: googleUserInfo.email,
              name: googleUserInfo.name || googleUserInfo.given_name,
              photoUrl: googleUserInfo.picture,
              accessToken: authentication.accessToken,
            });
            setAuthError(null);
          } catch (e) {
            console.error("Failed to fetch Google user info", e);
            setAuthError(e as Error);
            setUser(null); // Clear partial auth data
          } finally {
            setIsAuthenticating(false);
          }
        }
      } else if (response?.type === 'error') {
        console.error("Google Auth Error:", response.error);
        setAuthError(response.error);
        setIsAuthenticating(false);
      } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
        // User dismissed or cancelled the login flow
        setIsAuthenticating(false);
      }
    };

    handleGoogleResponse();
  }, [response]);

  const signInWithGoogle = async () => {
    setIsAuthenticating(true); // Indicate that an authentication process is starting
    setAuthError(null);
    try {
      await promptAsync();
    } catch (e) {
      setAuthError(e as Error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Use the robust mock user system for email/password auth
  const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Check if user already exists
      const existing = findMockUserByEmail(email);
      if (existing) throw new Error('User already exists');
      // Create new mock user and profile
      const newUser = {
        uid: email,
        email,
        displayName,
        photoURL: '',
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        providerId: 'password',
        password,
      };
      const newProfile = {
        id: email,
        email,
        name: displayName,
        profilePicUrl: '',
        phoneNumber: '',
        joinedAt: { toDate: () => new Date() },
        isSeller: false,
        bio: '',
        location: '',
      };
      addMockUser(newUser, newProfile);
      setUser({
        id: newUser.uid,
        email: newUser.email,
        name: newUser.displayName,
        photoUrl: newUser.photoURL,
        isEmailPasswordUser: true,
        displayName: newUser.displayName,
      });
      setAuthError(null);
    } catch (e) {
      setAuthError(e as Error);
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const foundUser = findMockUserByEmail(email);
      if (foundUser && foundUser.password === password) {
        setUser({
          id: foundUser.uid,
          email: foundUser.email,
          name: foundUser.displayName,
          photoUrl: foundUser.photoURL,
          isEmailPasswordUser: true,
          displayName: foundUser.displayName,
        });
        setAuthError(null);
      } else {
        throw new Error('User not found or incorrect password');
      }
    } catch (e) {
      setAuthError(e as Error);
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOutUser = async () => {
    setIsAuthenticating(true);
    try {
      if (user?.accessToken) { // If it was a Google sign-in
        // Attempt to revoke the token
        await Google.revokeAsync({
          token: user.accessToken,
        }, { // Discovery document might be needed if not cached or for specific scenarios
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
          revocationEndpoint: 'https://oauth2.googleapis.com/revoke' // Standard Google revocation endpoint
        });
      }
    } catch (e) {
      console.error("Error during token revocation:", e);
      // Don't let revocation error stop sign out from app UI
    } finally {
      setUser(null); // Clear user from state regardless of revocation result
      setIsAuthenticating(false);
      // Any other cleanup like clearing async storage if tokens were persisted there
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoadingInitial || isAuthenticating,
    isAuthenticating,
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
