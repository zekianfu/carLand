

import { AuthProvider } from '@/context/AuthContext';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native'; // Added View, Text for loading state
import { useFonts } from 'expo-font';
import './global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // IMPORTANT: Replace these with actual paths to your Inter font files in assets/fonts/
    // e.g., 'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'), // Placeholder, using SpaceMono
    'Inter-Bold': require('@/assets/fonts/SpaceMono-Regular.ttf'),    // Placeholder, using SpaceMono
    // Add other weights/styles if needed
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // You can return a loading indicator here if needed
    // For simplicity, returning null or a basic loading view
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Fonts...</Text>
      </View>
    );
  }

  // If there was an error loading fonts, you might want to render a fallback or error message
  if (fontError) {
    console.error("Font loading error:", fontError);
    // Render fallback UI or default to system fonts
    // For now, we'll proceed, and Tailwind will use fallback sans-serif
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="chat/[roomId]"
          options={{
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="buyDetial/partDetail"
          options={{
            title: 'Part Details',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="buyDetial/carDetail"
          options={{
            title: 'Car Details',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937', // Match headerStyle for consistency
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
  }
});