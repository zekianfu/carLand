
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native'; // For basic loading
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Changed to alias
import { LinearGradient } from 'expo-linear-gradient'; // Added for consistent background
// import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Removed import

import './global.css'; // Assuming this is for NativeWind or similar

// Configuration for @react-native-google-signin/google-signin removed.
// const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
// function initializeGoogleSignIn() { ... }

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Gets the current route segments

  // useEffect for initializeGoogleSignIn removed.

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
      <LinearGradient
        colors={['#1F2937', '#4B5563']} // darkGray and lighter cool gray
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#F59E0B" /> // Amber color
        <Text style={styles.loadingText}>Loading App...</Text>
      </LinearGradient>
    );
  }

  // If user is loaded, Stack navigator will decide which screen to show based on current route
  // The useEffect above handles redirection if necessary.
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1F2937' }, // Dark gray background for headers
        headerTintColor: '#FFFFFF', // White color for header text and icons
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false, // Auth screens will define their own header if needed within app/(auth)/_layout.tsx
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="chat/[roomId]"
        options={({ route }) => ({
          // Title can be set dynamically in the screen component using navigation.setOptions
          // For now, we use a generic title or leave it to the component.
          // title: route.params?.otherUserName || 'Chat', // Example if passing params
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
        })}
      />
      <Stack.Screen
        name="buyDetial/partDetail" // Corrected path from previous step
        options={{
          title: 'Part Details', // Default title
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
        }}
      />
       <Stack.Screen
          name="buyDetial/carDetail"
          options={{
            title: 'Car Details', // Default title
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }}
        />
      {/* Add other top-level stack screens here if any, e.g., modals, settings not in tabs */}
      {/* Example: <Stack.Screen name="settings" options={{ presentation: 'modal', headerStyle: { backgroundColor: '#1F2937'}, headerTintColor: '#FFFFFF' }} /> */}
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
    // backgroundColor is now handled by LinearGradient
  },
  loadingText: { // Added style for loading text
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF', // White text on dark gradient
  }
});