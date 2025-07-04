

import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import './global.css';



export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          // headerBackTitleVisible is deprecated and can be removed or replaced if needed
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
        {/* Add other top-level stack screens here if any */}
      </Stack>
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