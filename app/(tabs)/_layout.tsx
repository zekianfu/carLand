import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import images from '../../constant/images'; // Corrected path

// Custom component for tabBarIcon
const TabBarIcon = ({ focused, icon }: any) => (
  <Image
    source={icon}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#007AFF' : '#222',
    }}
    resizeMode="contain"
  />
);

const CustomTabBarBackground = (props: any) => (
  <BlurView
    intensity={80}
    tint="light"
    style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: 'hidden' }]}
    {...props}
  />
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#222',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          elevation: 0,
          borderRadius: 16,
          borderTopWidth: 0,
          backgroundColor: Platform.OS === 'android' ? 'rgba(75, 75, 75, 0.39)' : 'transparent',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        tabBarBackground: () => <CustomTabBarBackground />,
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
