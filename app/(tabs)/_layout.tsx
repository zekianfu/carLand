import images from '@/constant/images'; // Changed to alias
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

// Custom component for tabBarIcon
const amberColor = '#F59E0B'; // Consistent amber
const inactiveTabColor = '#9CA3AF'; // Tailwind gray-400, good for dark backgrounds
const darkBackgroundColor = 'rgba(31, 41, 55, 0.85)'; // Dark gray with transparency for Android tab bar
const darkerBlurTintColor = 'dark'; // For iOS BlurView

import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const TabBarIcon = ({ focused, icon, vectorIconName }: { focused: boolean; icon?: any; vectorIconName?: keyof typeof Ionicons.glyphMap }) => {
  if (vectorIconName) {
    return (
      <Ionicons
        name={vectorIconName}
        size={26} // Adjusted size for vector icons to better match image icons
        color={focused ? amberColor : inactiveTabColor}
      />
    );
  }
  if (icon) {
    return (
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? amberColor : inactiveTabColor,
        }}
        resizeMode="contain"
      />
    );
  }
  return null; // Or a default placeholder icon
};


const CustomTabBarBackground = (props: any) => (
  <BlurView
    intensity={90} // Slightly more intense blur
    tint={darkerBlurTintColor} // Darker tint for better harmony with dark theme
    style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]}
    {...props}
  />
);

import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';

import { useState } from 'react';
function AuthRedirector() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  // Mark as ready after first mount (after navigator is mounted)
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || isLoading) {
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router, ready]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#1F2937', '#4B5563']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#FFFFFF' }}>Loading App...</Text>
      </LinearGradient>
    );
  }
  return null;
}

const Layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: amberColor,
          tabBarInactiveTintColor: inactiveTabColor,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 20 : 10,
            left: 16,
            right: 16,
            elevation: 0,
            borderRadius: 20,
            borderTopWidth: 0,
            backgroundColor: Platform.OS === 'android' ? darkBackgroundColor : 'transparent',
            overflow: 'hidden',
          },
          tabBarBackground: () => <CustomTabBarBackground />,
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={images.home} />
            ),
          }}
        />
        {/* New Listings Tab */}
        <Tabs.Screen
          name="listings" // This should match the filename app/(tabs)/listings.tsx
          options={{
            headerShown: false, // We set the header inside listings.tsx using Stack.Screen
            title: 'Cars',    // Tab title
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} vectorIconName="car-sport-outline" />
            ),
          }}
        />
        <Tabs.Screen
          name="sermon"
          options={{
            headerShown: false,
            title: 'Parts', // This seems to be a placeholder from the original app
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={images.Sermon} />
            ),
          }}
        />
        <Tabs.Screen
          name="event"
          options={{
            headerShown: false,
            title: 'List', // This seems to be a placeholder from the original app
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={images.Event} />
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            headerShown: false,
            title: 'Chats',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={images.Groups} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={images.Profile} />
            ),
          }}
        />
      </Tabs>
      <AuthRedirector />
    </>
  );
};

// Remove duplicate export if present
// export default Layout;

const styles = StyleSheet.create({});

export default Layout; // Ensure only one default export
