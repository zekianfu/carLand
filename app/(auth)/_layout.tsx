import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F2937', // Dark Gray
          },
          headerTintColor: '#FFFFFF', // White
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            // headerShown: false, // Optionally hide header for a more modal feel
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Create Account',
          }}
        />
      </Stack>
    </>
  );
}
