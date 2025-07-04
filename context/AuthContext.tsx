import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

// Define a more structured User type
export interface User {
  id?: string; // Google User ID
  email?: string;
  name?: string;
  photoUrl?: string;
  accessToken?: string;
  // Add other fields as needed from Google or your app's user profile
  // For email/password users, structure might be different or overlap
  isEmailPasswordUser?: boolean;
  displayName?: string; // For email/password users specifically if name from Google is separate
}

interface AuthContextType {
  user: User | null; // Use the User interface
  isLoading: boolean; // Combined loading state for initial auth check and active authentication
  isAuthenticating: boolean; // Specifically for active login/signup process
  authError: Error | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // This will trigger the promptAsync
  signOutUser: () => Promise<void>;
  // userProfile might be needed if you fetch more details from your own backend
  // userProfile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Dummy users for demo purposes (move outside component to persist across renders)
const mockUsers: { [key: string]: { email: string; displayName: string } } = {
  'user1': { email: 'test@example.com', displayName: 'Test User' },
  'user2': { email: 'demo@example.com', displayName: 'Demo User' },
};

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

  const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Add to mock users (for demo only, not persistent)
      mockUsers[email] = { email, displayName }; // Keep mock user structure simple
      setUser({
        email: email,
        name: displayName, // Use 'name' for consistency with Google profile
        isEmailPasswordUser: true
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
      const foundUser = Object.values(mockUsers).find(u => u.email === email);
      if (foundUser) {
        setUser({
          email: foundUser.email,
          name: foundUser.displayName, // Use 'name'
          isEmailPasswordUser: true
        });
        setAuthError(null);
      } else {
        throw new Error('User not found or incorrect password'); // Generic message for security
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
