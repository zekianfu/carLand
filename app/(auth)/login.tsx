import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // useRouter might still be needed for onSwitchToSignup if not passed
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '@/components/auth/LoginForm'; // Ensure this path is correct

const LoginScreen: React.FC = () => {
  const router = useRouter();

  // Example of how navigation could be passed if LoginForm doesn't use Link directly
  const handleNavigateToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <LinearGradient colors={['#1F2937', '#374151']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center">
          <LoginForm onSwitchToSignup={handleNavigateToSignup} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
