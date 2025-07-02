import React from 'react';
import { Redirect } from 'expo-router';

const GroupsScreenRedirect = () => {
  // This screen is part of the (tabs) layout, registered as "groups".
  // We want the "Chats" tab to lead to the chat list at app/chat/index.tsx.
  // Expo Router handles routes based on file structure.
  // Redirect to '/chat' which should be resolved to app/chat/index.tsx.
  return <Redirect href="/chat" />;
};

export default GroupsScreenRedirect;