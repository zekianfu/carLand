import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext'; // Corrected import path

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { signInWithEmailPassword, signInWithGoogle, isAuthenticating, authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    // Error from previous attempt is cleared by AuthProvider on new attempt
    // No need to call setAuthLoading(true) here, isAuthenticating from context handles it
    try {
      await signInWithEmailPassword(email, password);
      // Successful login will trigger onAuthStateChanged in AuthContext,
      // and RootLayout's useEffect will handle navigation.
    } catch (error: any) {
      // Error is already set in AuthContext, show it to user
      // Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
      // The authError from context can be displayed in the UI directly if desired.
      // For now, an alert is fine.
      Alert.alert('Login Failed', error.customData?.message || error.message || 'An unexpected error occurred. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    // setAuthLoading(true); // Handled by isAuthenticating in context
    // Placeholder for actual Google sign-in logic
    console.log('Attempting Google Sign-In');
    // try {
    //   await signInWithGoogle(); // To be implemented in AuthContext
    // } catch (error: any) {
    //   Alert.alert('Google Sign-In Failed', error.message || 'An unexpected error occurred.');
    // }
    try {
      await signInWithGoogle();
      // Successful mock sign-in will update AuthContext state.
      // Navigation should be handled based on user state changes in a higher-order component or layout.
    } catch (error: any) {
      // The mock signInWithGoogle will set authError in the context.
      // We can display that error or a generic one.
      // The specific error codes like SIGN_IN_CANCELLED are Firebase/Google SDK specific and no longer apply.
      Alert.alert('Google Sign-In Failed', authError?.message || error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <LinearGradient colors={['#1F2937', '#374151']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center"> {/* Outer container for centering */}
          <View className="w-full max-w-md px-6"> {/* Inner container with max-width and padding */}
            {/* <Image source={require('../../../assets/images/logo.png')} style={styles.logo} /> */}
            <Text className="text-3xl font-bold text-white mb-2 text-center">Welcome Back!</Text> {/* title */}
          <Text className="text-base text-gray-300 mb-8 text-center">Log in to continue to FaithLink Cars.</Text> {/* subtitle */}

          {authError && ( // Displaying auth error from context
            <View className="mb-4 p-3 bg-red-500/30 rounded-md w-full items-center">
              <Text className="text-red-300 text-sm text-center">{authError.message}</Text>
            </View>
          )}

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
            className="w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-5 border border-white/20 focus:border-amber-400" // input
            placeholder="Password"
            placeholderTextColor="#9CA3AF" // gray-400
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />

          <TouchableOpacity
            className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-amber-500 active:bg-amber-600" // button, loginButton (amber)
            onPress={handleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">Log In</Text> // buttonText
            )}
          </TouchableOpacity>

          <Text className="text-gray-400 text-sm my-4">OR</Text> {/* orText */}

          <TouchableOpacity
            className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-red-600 active:bg-red-700" // button, googleButton (Google Red)
            onPress={handleGoogleSignIn}
            disabled={isAuthenticating}
          >
            {/* Consider a specific loading state for Google if isAuthenticating and google sign in initiated */}
            <Ionicons name="logo-google" size={20} color="#FFFFFF" className="mr-2.5" /> {/* buttonIcon */}
            <Text className="text-white text-base font-semibold">Sign In with Google</Text> {/* buttonText */}
          </TouchableOpacity>

          <View className="flex-row mt-5 items-center"> {/* footer */}
            <Text className="text-gray-300 text-sm">Don't have an account? </Text> {/* footerText */}
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-amber-400 text-sm font-semibold">Sign Up</Text> {/* linkText (amber) */}
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// StyleSheet.create block removed as all styles are converted to NativeWind classes.

export default LoginScreen;
