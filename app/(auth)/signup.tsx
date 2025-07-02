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
import { useAuth } from '../../context/AuthContext'; // Path assuming context is two levels up

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
    <LinearGradient colors={['#1F2937', '#374151']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* <Image source={require('../../../assets/images/logo.png')} style={styles.logo} /> */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join FaithLink Cars today!</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name or Display Name"
              placeholderTextColor="#9CA3AF"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              textContentType="name"
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword" // Helps with password managers
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
            />

            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={handleSignup}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={handleGoogleSignUp}
                disabled={isAuthenticating} // Also disable while any auth operation is in progress
            >
                {/* Add ActivityIndicator for Google Sign Up if isAuthenticating and this specific button was pressed */}
                <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sign Up with Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Log In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20, // Added padding for scroll view content
  },
  logo: {
    width: 80, // Smaller logo for signup
    height: 80,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#10B981', // emerald-500
  },
  googleButton: {
    backgroundColor: '#EA4335', // Google Red
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 10,
  },
  orText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  linkText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignupScreen;
