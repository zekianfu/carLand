import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext'; // Corrected import path

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { signUpWithEmailPassword, signInWithGoogle, isAuthenticating, authError } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    // No need to call setAuthLoading(true) here, isAuthenticating from context handles it
    try {
      await signUpWithEmailPassword(email, password, displayName);
      // Successful signup will trigger onAuthStateChanged,
      // and RootLayout's useEffect will handle navigation.
      // Firestore user profile creation will be handled in Step 9 within AuthContext's signUp.
    } catch (error: any) {
      Alert.alert('Sign-up Failed', error.customData?.message || error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    // setAuthLoading(true); // Handled by isAuthenticating in context
    // Placeholder for actual Google sign-up logic (often same as sign-in)
    console.log('Attempting Google Sign-Up/Sign-In');
    // try {
    //   await signInWithGoogle(); // To be implemented in AuthContext
    try {
      await signInWithGoogle(); // This will simulate Google sign-in/sign-up with mock data.
      // Successful mock sign-in/up will update AuthContext state.
    } catch (error: any) {
      // The mock signInWithGoogle will set authError in the context.
      // Specific error codes like SIGN_IN_CANCELLED are Firebase/Google SDK specific and no longer apply.
      Alert.alert('Google Sign-Up Failed', authError?.message || error.message || 'An unexpected error occurred.');
    }
  };


  return (
    <LinearGradient colors={['#1F2937', '#374151']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerClassName="grow justify-center">
          <View className="justify-center items-center px-6 py-5"> {/* container */}
            {/* <Image source={require('../../../assets/images/logo.png')} className="w-20 h-20 mb-4" /> */}
            <Text className="text-3xl font-bold text-white mb-2 text-center">Create Account</Text> {/* title */}
            <Text className="text-base text-gray-300 mb-8 text-center">Join FaithLink Cars today!</Text> {/* subtitle */}

            {authError && ( // Displaying auth error from context
              <View className="mb-4 p-3 bg-red-500/30 rounded-md w-full items-center">
                <Text className="text-red-300 text-sm text-center">{authError.message}</Text>
              </View>
            )}

            <TextInput
              className="w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-4 border border-white/20 focus:border-amber-400" // input
              placeholder="Full Name or Display Name"
              placeholderTextColor="#9CA3AF" // gray-400
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              textContentType="name"
            />
            <TextInput
              className="w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-4 border border-white/20 focus:border-amber-400" // input
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF" // gray-400
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
            <TextInput
              className="w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-4 border border-white/20 focus:border-amber-400" // input
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#9CA3AF" // gray-400
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
            />
            <TextInput
              className="w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-5 border border-white/20 focus:border-amber-400" // input
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF" // gray-400
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
            />

            <TouchableOpacity
              className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-emerald-500 active:bg-emerald-600" // button, signupButton (emerald)
              onPress={handleSignup}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-semibold">Create Account</Text> // buttonText
              )}
            </TouchableOpacity>

            <Text className="text-gray-400 text-sm my-4">OR</Text> {/* orText */}

            <TouchableOpacity
              className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-red-600 active:bg-red-700" // button, googleButton
              onPress={handleGoogleSignUp}
              disabled={isAuthenticating}
            >
              <Ionicons name="logo-google" size={20} color="#FFFFFF" className="mr-2.5" /> {/* buttonIcon */}
              <Text className="text-white text-base font-semibold">Sign Up with Google</Text> {/* buttonText */}
            </TouchableOpacity>

            <View className="flex-row mt-5 items-center"> {/* footer */}
              <Text className="text-gray-300 text-sm">Already have an account? </Text> {/* footerText */}
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-amber-400 text-sm font-semibold">Log In</Text> {/* linkText (amber) */}
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// StyleSheet.create block removed as all styles are converted to NativeWind classes.

export default SignupScreen;
