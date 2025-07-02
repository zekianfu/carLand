import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: any;
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
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      setUser({ accessToken: authentication?.accessToken });
      setAuthError(null);
    } else if (response?.type === 'error') {
      setAuthError(response.error);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    setIsAuthenticating(true);
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
      mockUsers[email] = { email, displayName };
      setUser({ email, displayName });
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
        setUser(foundUser);
        setAuthError(null);
      } else {
        throw new Error('User not found');
      }
    } catch (e) {
      setAuthError(e as Error);
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOutUser = async () => {
    setUser(null);
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
