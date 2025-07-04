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
  // ScrollView import removed as it's not used directly here; parent screen handles scrolling
} from 'react-native';
import { useAuth } from '@/context/AuthContext'; // Authentication context

interface SignupFormProps {
  onSwitchToLogin?: () => void; // Optional callback to navigate to Login screen
}

// Define the structure of the form data for type safety with react-hook-form
type FormData = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  // Destructure methods from AuthContext
  const { signUpWithEmailPassword, signInWithGoogle, isAuthenticating, authError } = useAuth();

  // Destructure methods from react-hook-form
  // control: object to connect inputs to the form
  // handleSubmit: wrapper for the onSubmit function, handles validation
  // watch: function to observe field values, useful for conditional validation (e.g., confirm password)
  // formState: contains information about the form state, including errors
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { // Set default values for form fields
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch the 'password' field value to use for 'confirmPassword' validation
  const passwordValue = watch('password');

  /**
   * Handles form submission for email/password signup.
   * This function is called by react-hook-form's handleSubmit after validation passes.
   * @param data - The validated form data (displayName, email, password, confirmPassword).
   */
  const onSubmit = async (data: FormData) => {
    try {
      // Attempt to sign up using the credentials from the form
      await signUpWithEmailPassword(data.email, data.password, data.displayName);
      // Navigation upon successful signup is typically handled by a higher-level component
      // observing changes in the authentication state (user object in AuthContext).
    } catch (error: any) {
      // Errors during signup (e.g., email already exists) are caught and set in AuthContext.
      // The authError from AuthContext is displayed in the UI.
      // console.error("Signup onSubmit error:", error); // Optional: for debugging
    }
  };

  /**
   * Handles the Google Sign-Up/Sign-In process.
   * Typically, Google sign-up and sign-in use the same flow.
   */
  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle(); // Uses the same Google sign-in flow from AuthContext
      // Navigation on success is handled based on AuthContext state changes.
    } catch (error: any) {
      // Errors during Google Sign-Up are set in AuthContext and displayed.
      // console.error("Google Sign-Up error:", error); // Optional: for debugging
    }
  };

  return (
    <View className="w-full max-w-md px-6 py-5">
      {/* Screen Title and Subtitle */}
      <Text className="text-3xl font-bold text-white mb-2 text-center">Create Account</Text>
      <Text className="text-base text-gray-300 mb-8 text-center">Join FaithLink Cars today!</Text>

      {/* Display general authentication errors from AuthContext if no specific field errors */}
      {authError && !errors.email && !errors.password && !errors.displayName && !errors.confirmPassword && (
        <View className="mb-4 p-3 bg-red-500/30 rounded-md w-full items-center">
          <Text className="text-red-300 text-sm text-center">{authError.message}</Text>
        </View>
      )}

      {/* Display Name Input Field */}
      <Controller
        control={control}
        rules={{ required: 'Display name is required.' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.displayName ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Full Name or Display Name"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            textContentType="name"
          />
        )}
        name="displayName"
      />
      {errors.displayName && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.displayName.message}</Text>}
      {!errors.displayName && <View className="h-6 mb-2" />}

      {/* Email Input Field */}
      <Controller
        control={control}
        rules={{
          required: 'Email is required.',
          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.email ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
        )}
        name="email"
      />
      {errors.email && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.email.message}</Text>}
      {!errors.email && <View className="h-6 mb-2" />}

      {/* Password Input Field */}
      <Controller
        control={control}
        rules={{
          required: 'Password is required.',
          minLength: { value: 6, message: 'Password must be at least 6 characters.' }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.password ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Password (min. 6 characters)"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            textContentType="newPassword" // Use newPassword for signup context
          />
        )}
        name="password"
      />
      {errors.password && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.password.message}</Text>}
      {!errors.password && <View className="h-6 mb-2" />}

      {/* Confirm Password Input Field */}
      <Controller
        control={control}
        rules={{
          required: 'Please confirm your password.',
          validate: value => value === passwordValue || 'Passwords do not match.' // Custom validation against watched passwordValue
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full h-12 bg-white/10 rounded-lg px-4 text-base text-white mb-1 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} focus:border-amber-400`}
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            textContentType="newPassword"
          />
        )}
        name="confirmPassword"
      />
      {errors.confirmPassword && <Text className="text-red-400 text-xs mt-1 mb-3 ml-1">{errors.confirmPassword.message}</Text>}
      {!errors.confirmPassword && <View className="h-6 mb-4" />}


      {/* Create Account Button */}
      <TouchableOpacity
        className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-emerald-500 active:bg-emerald-600"
        onPress={handleSubmit(onSubmit)} // handleSubmit validates then calls onSubmit
        disabled={isAuthenticating} // Disable button during authentication
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#FFFFFF" /> // Show loading indicator
        ) : (
          <Text className="text-white text-base font-semibold">Create Account</Text>
        )}
      </TouchableOpacity>

      <Text className="text-gray-400 text-sm my-4 text-center">OR</Text>

      {/* Google Sign-Up Button */}
      <TouchableOpacity
        className="w-full h-12 rounded-lg justify-center items-center flex-row mb-4 bg-red-600 active:bg-red-700"
        onPress={handleGoogleSignUp}
        disabled={isAuthenticating}
      >
        <Ionicons name="logo-google" size={20} color="#FFFFFF" className="mr-2.5" />
        <Text className="text-white text-base font-semibold">Sign Up with Google</Text>
      </TouchableOpacity>

      {/* Link to Login Screen */}
      <View className="flex-row mt-5 items-center justify-center">
        <Text className="text-gray-300 text-sm">Already have an account? </Text>
        {onSwitchToLogin ? (
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text className="text-amber-400 text-sm font-semibold">Log In</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-amber-400 text-sm font-semibold">Log In</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
};

export default SignupForm;
