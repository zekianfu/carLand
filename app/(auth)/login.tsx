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
import { useAuth } from '../../context/AuthContext'; // Path assuming context is two levels up

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
    <LinearGradient colors={['#1F2937', '#374151']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* <Image source={require('../../../assets/images/logo.png')} style={styles.logo} /> */}
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to continue to FaithLink Cars.</Text>

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
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={isAuthenticating} // Also disable while any auth operation is in progress
          >
            {/* Add ActivityIndicator for Google Sign In if isAuthenticating and this specific button was pressed */}
            <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
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
    color: '#D1D5DB', // gray-300
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
  loginButton: {
    backgroundColor: '#3B82F6', // blue-500
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
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    marginVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#D1D5DB', // gray-300
    fontSize: 14,
  },
  linkText: {
    color: '#60A5FA', // blue-400
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
