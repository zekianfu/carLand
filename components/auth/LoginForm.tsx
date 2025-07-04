import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '@/context/AuthContext'; // Authentication context

interface LoginFormProps {
  onSwitchToSignup?: () => void; // Optional callback to navigate to Signup screen
}

// Define the structure of the form data for type safety with react-hook-form
type FormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  // Destructure methods from AuthContext
  const { signInWithEmailPassword, signInWithGoogle, isAuthenticating, authError } = useAuth();

  // Destructure methods from react-hook-form
  // control: object to connect inputs to the form
  // handleSubmit: wrapper for the onSubmit function, handles validation before calling onSubmit
  // formState: contains information about the form state, including errors
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { // Set default values for form fields
      email: '',
      password: ''
    }
  });

  /**
   * Handles form submission for email/password login.
   * This function is called by react-hook-form's handleSubmit after validation passes.
   * @param data - The validated form data (email, password).
   */
  const onSubmit = async (data: FormData) => {
    try {
      // Attempt to sign in using the credentials from the form
      await signInWithEmailPassword(data.email, data.password);
      // Navigation upon successful login is typically handled by a higher-level component
      // (e.g., RootLayout) observing changes in the authentication state (user object in AuthContext).
    } catch (error: any) {
      // Errors during login (e.g., incorrect credentials) are caught and set in AuthContext.
      // The authError from AuthContext is displayed in the UI.
      // console.error("Login onSubmit error:", error); // Optional: for debugging
    }
  };

  /**
   * Handles the Google Sign-In process.
   */
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Similar to email/password login, navigation on success is handled based on AuthContext state changes.
    } catch (error: any) {
      // Errors during Google Sign-In are set in AuthContext and displayed.
      // console.error("Google Sign-In error:", error); // Optional: for debugging
    }
  };

  return (
    <View className="w-full max-w-md px-6">
      {/* Screen Title and Subtitle */}
      <Text className="text-3xl font-bold text-white mb-2 text-center">Welcome Back!</Text>
      <Text className="text-base text-gray-300 mb-8 text-center">Log in to continue to FaithLink Cars.</Text>

      {/* Display general authentication errors from AuthContext if no specific field errors */}
      {authError && !errors.email && !errors.password && (
        <View className="mb-4 p-3 bg-red-500/30 rounded-md w-full items-center">
          <Text className="text-red-300 text-sm text-center">{authError.message}</Text>
        </View>
      )}

      {/* Email Input Field managed by react-hook-form Controller */}
      <Controller
        control={control} // Pass the control object from useForm
        rules={{ // Define validation rules for the email field
          required: 'Email is required.',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email pattern
            message: 'Invalid email address.'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => ( // render prop provides field handlers
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.email ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur} // Call onBlur to trigger validation
            onChangeText={onChange} // Use onChange to update form state
            value={value} // Controlled component value
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
        )}
        name="email" // Name of the field, must match FormData key
      />
      {/* Display validation error for email if it exists */}
      {errors.email && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.email.message}</Text>}
      {/* Placeholder View to maintain consistent spacing when no error is shown */}
      {!errors.email && <View className="h-6 mb-2" />}


      {/* Password Input Field managed by react-hook-form Controller */}
      <Controller
        control={control}
        rules={{
          required: 'Password is required.',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters.'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.password ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry // Hides password input
            textContentType="password"
          />
        )}
        name="password"
      />
      {/* Display validation error for password if it exists */}
      {errors.password && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.password.message}</Text>}
      {/* Placeholder View for consistent spacing */}
      {!errors.password && <View className="h-6 mb-4" />}


      {/* Login Button */}
      <TouchableOpacity
        className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-amber-500 active:bg-amber-600"
        onPress={handleSubmit(onSubmit)} // handleSubmit validates the form then calls onSubmit
        disabled={isAuthenticating} // Disable button while authentication is in progress
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#FFFFFF" /> // Show loading indicator
        ) : (
          <Text className="text-white text-base font-semibold">Log In</Text>
        )}
      </TouchableOpacity>

      <Text className="text-gray-400 text-sm my-4 text-center">OR</Text>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-red-600 active:bg-red-700"
        onPress={handleGoogleSignIn}
        disabled={isAuthenticating}
      >
        <Ionicons name="logo-google" size={20} color="#FFFFFF" className="mr-2.5" />
        <Text className="text-white text-base font-semibold">Sign In with Google</Text>
      </TouchableOpacity>

      {/* Link to Signup Screen */}
      <View className="flex-row mt-5 items-center justify-center">
        <Text className="text-gray-300 text-sm">Don't have an account? </Text>
        {/* Conditional rendering for navigation: use callback or Link component */}
        {onSwitchToSignup ? (
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text className="text-amber-400 text-sm font-semibold">Sign Up</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-amber-400 text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
};

export default LoginForm;
