import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import images from '@/constant/images'; // Changed to alias

// Custom component for tabBarIcon
const amberColor = '#F59E0B'; // Consistent amber
const inactiveTabColor = '#9CA3AF'; // Tailwind gray-400, good for dark backgrounds
const darkBackgroundColor = 'rgba(31, 41, 55, 0.85)'; // Dark gray with transparency for Android tab bar
const darkerBlurTintColor = 'dark'; // For iOS BlurView

const TabBarIcon = ({ focused, icon }: any) => (
  <Image
    source={icon}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? amberColor : inactiveTabColor, // Use defined colors
    }}
    resizeMode="contain"
  />
);

const CustomTabBarBackground = (props: any) => (
  <BlurView
    intensity={90} // Slightly more intense blur
    tint={darkerBlurTintColor} // Darker tint for better harmony with dark theme
    style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]}
    {...props}
  />
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Most screens in tabs hide header, individual screens can override
        tabBarShowLabel: true,
        tabBarActiveTintColor: amberColor, // Use amber for active tint
        tabBarInactiveTintColor: inactiveTabColor, // Use light gray for inactive tint
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 10, // Adjusted bottom for aesthetics
          left: 16,
          right: 16,
          elevation: 0, // Remove platform shadow, rely on BlurView/custom shadow
          borderRadius: 20, // Slightly more rounded
          borderTopWidth: 0,
          backgroundColor: Platform.OS === 'android' ? darkBackgroundColor : 'transparent', // Darker background for Android
          overflow: 'hidden',
          // shadowColor: '#000', // Keep shadow for depth, adjust if needed
          // shadowOpacity: 0.1,
          // shadowRadius: 10,
          // shadowOffset: { width: 0, height: -3 }, // Shadow upwards
        },
        tabBarBackground: () => <CustomTabBarBackground />,
        // Default header styles for any screen within tabs that might show a header
        // These will be overridden by app/_layout.tsx global screenOptions if not specified here
        // However, explicit styling here ensures tabs have their desired look if a header is shown.
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
      <Tabs.Screen
        name="sermon"
        options={{
          headerShown: false,
          title: 'Parts',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.Sermon} />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          headerShown: false,
          title: 'List',
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
  );
};

const styles = StyleSheet.create({});

export default Layout;
