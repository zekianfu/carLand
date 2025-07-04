import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // useRouter might still be needed
import React from 'react';
import { ScrollView, View } from 'react-native'; // ScrollView might be needed if content overflows
import { SafeAreaView } from 'react-native-safe-area-context';
import SignupForm from '@/components/auth/SignupForm'; // Ensure this path is correct

const SignupScreen: React.FC = () => {
  const router = useRouter();

  const handleNavigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <LinearGradient colors={['#1F2937', '#374151']} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* ScrollView is useful if the form content might exceed screen height, especially on smaller devices */}
        <ScrollView contentContainerClassName="grow justify-center items-center">
          <SignupForm onSwitchToLogin={handleNavigateToLogin} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignupScreen;
