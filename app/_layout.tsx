
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native'; // For basic loading
import { AuthProvider, useAuth } from '../context/AuthContext'; // Adjusted path

import './global.css'; // Assuming this is for NativeWind or similar

// Configure Google Sign-In (as done in a previous step, ensure it's here or in App.tsx)
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'; // << REPLACE THIS

function initializeGoogleSignIn() {
  if (!WEB_CLIENT_ID || WEB_CLIENT_ID === 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com') {
    console.warn("Google Sign-In webClientId is not configured. Please replace the placeholder in app/_layout.tsx.");
    return;
  }
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  });
  console.log("Google Sign-In Configured from RootLayout");
}


const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Gets the current route segments

  useEffect(() => {
    initializeGoogleSignIn(); // Ensure Google Sign-In is configured on app start
  }, []);

  useEffect(() => {
    if (isLoading) {
      // No navigation action while loading, splash screen or initial route will be shown.
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not already in auth flow
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and somehow landed in auth flow
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    // You might have a global splash screen handled by expo-splash-screen
    // Or return a minimal loader if auth check is prolonged after splash
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If user is loaded, Stack navigator will decide which screen to show based on current route
  // The useEffect above handles redirection if necessary.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          presentation: 'modal' // Example: auth screens as modals
        }}
      />
      <Stack.Screen
        name="chat/[roomId]"
        options={{
          // Title will be set dynamically in the screen component
          headerBackTitleVisible: false,
          // Other header styling for chat room if needed
        }}
      />
      {/* Add other top-level stack screens here if any, e.g., modals, settings not in tabs */}
      {/* Example: <Stack.Screen name="settings" options={{ presentation: 'modal' }} /> */}
       <Stack.Screen
          name="buyDetial/carDetail" // Path to your car detail screen
          options={{
            // Title can be set dynamically in the screen using Stack.Screen options prop
            // or navigation.setOptions
            headerBackTitleVisible: false,
          }}
        />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});