import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router'; // useRouter for potential redirects
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import { Alert } from 'react-native'; // For sign out confirmation

const amber = '#F59E0B';
const darkGray = '#1F2937';
const blue = '#3B82F6';

// Dummy listings - Keep for now, will be replaced by actual data later
const myListings = [
  {
    id: '1',
    image: 'https://via.placeholder.com/120x80.png?text=Car',
    title: 'Toyota Corolla 2020',
    price: '1,200,000',
    status: 'Active',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/120x80.png?text=Part',
    title: 'Brake Pad',
    price: '2,000',
    status: 'Sold',
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/120x80.png?text=Car',
    title: 'Mazda CX-5',
    price: '4,200,000',
    status: 'Pending',
  },
];

// Dummy favorites
const favorites = [
  {
    id: '1',
    image: 'https://via.placeholder.com/120x80.png?text=Fav1',
    title: 'Honda Civic',
    price: '2,000,000',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/120x80.png?text=Fav2',
    title: 'Engine Oil',
    price: '1,000',
  },
];

const ProfileScreen = () => {
  const { user, userProfile, signOutUser, isAuthenticating, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // const [loading, setLoading] = useState(false); // Use isAuthenticating or authLoading for auth operations
  const slideAnim = useState(new Animated.Value(600))[0];


  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Add actual data refresh logic if needed (e.g., re-fetch user listings)
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleEdit = () => {
    setEditMode(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start();
  };

  const handleCloseEdit = () => {
    Animated.timing(slideAnim, { toValue: 600, duration: 300, useNativeDriver: true }).start(() => setEditMode(false));
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOutUser();
              // Navigation to login is handled by RootLayout
            } catch (error: any) {
              Alert.alert("Sign Out Failed", error.message || "An unexpected error occurred.");
            }
          },
        },
      ]
    );
  };

  if (authLoading) {
    return (
      <LinearGradient colors={[darkGray, '#4B5563']} style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color={amber} />
      </LinearGradient>
    );
  }

  if (!user || !userProfile) {
    // This should ideally be caught by RootLayout and redirected to login
    return (
      <LinearGradient colors={[darkGray, '#4B5563']} style={styles.centeredMessageContainer}>
        <Stack.Screen options={{ title: 'Profile' }} />
        <Text style={styles.messageText}>Please log in to view your profile.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }


  return (
    <LinearGradient
      colors={[darkGray, '#4B5563']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {/* Header */}
        {/* Header: Using Stack.Screen options instead for title, back button managed by router */}
        <Stack.Screen options={{
          title: 'My Profile',
          // headerRight: () => ( // Example for a settings button if needed
          //   <TouchableOpacity onPress={() => router.push('/settings')}>
          //     <Ionicons name="settings-outline" size={24} color="#fff" />
          //   </TouchableOpacity>
          // ),
        }} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={amber}
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* User Info Card */}
          {/* User Info Card */}
          <View style={styles.profileHeaderContainer}>
            {userProfile.profilePicUrl ? (
                <Image source={{ uri: userProfile.profilePicUrl }} style={styles.avatarImage} />
            ) : (
                <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                    <Ionicons name="person-circle-outline" size={60} color="#FFFFFF" />
                </View>
            )}
            <TouchableOpacity
                style={styles.cameraIconTouchable}
                onPress={() => Alert.alert("Change Picture", "Functionality to change profile picture coming soon!")}
            >
                <Ionicons name="camera" size={20} color={darkGray} />
            </TouchableOpacity>
            {/* TODO: Add verified badge based on userProfile.isVerifiedSeller or similar */}
            {/* {userProfile.isVerifiedSeller && (
                <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                </View>
            )} */}

            <View style={styles.userInfoTextContainer}>
                <Text style={styles.userNameText}>{userProfile.name || user.displayName}</Text>
                <View style={styles.userBadgeContainer}>
                    {/* Replace user.userType with actual data if available in userProfile */}
                    {userProfile.isSeller && ( // Example: show "Seller" badge if isSeller is true
                        <View style={styles.userTypeBadge}>
                            <Text style={styles.userTypeBadgeText}>Seller</Text>
                        </View>
                    )}
                    {/* Replace user.completion with actual data */}
                    {/* <View style={styles.completionBadge}>
                        <Feather name="percent" size={14} color={amber} />
                        <Text style={styles.completionText}>80%</Text>
                    </View> */}
                </View>
                <Text style={styles.userContactText}>{user.email}</Text>
                {userProfile.phoneNumber && <Text style={styles.userContactText}>{userProfile.phoneNumber}</Text>}
                {/* Add location from userProfile if available */}
                {/* {userProfile.location && <Text style={styles.userLocationText}>{userProfile.location}</Text>} */}
            </View>
          </View>

          {/* Activity Stats - TODO: Replace with actual data */}
          <View style={styles.statsRowContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Listings</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Sold</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={amber} />
                <Text style={styles.statValueRating}>N/A</Text>
              </View>
            </View>
          </View>

          {/* My Listings */}
          <Text className="text-white text-lg font-bold mb-2 px-4">My Listings</Text>
          <FlatList
            data={myListings}
            keyExtractor={item => item.id}
            horizontal={false}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 4, marginBottom: 16 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl shadow-md mx-1 mb-3" style={{ width: '48%' }}>
                <Image
                  source={{ uri: item.image }}
                  className="w-full rounded-t-2xl"
                  style={{ height: 90, resizeMode: 'cover' }}
                />
                <View className="px-2 pb-1 pt-1 relative" style={{ minHeight: 36 }}>
                  <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-emerald-700 font-semibold text-sm" numberOfLines={1}>
                    ETB {item.price}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text
                      className={`text-xs font-bold ${
                        item.status === 'Active'
                          ? 'text-emerald-600'
                          : item.status === 'Sold'
                          ? 'text-gray-400'
                          : 'text-amber-500'
                      }`}
                    >
                      {item.status}
                    </Text>
                    <View className="flex-row">
                      <TouchableOpacity className="mr-2">
                        <Feather name="edit" size={16} color={blue} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Saved Favorites */}
          <Text className="text-white text-lg font-bold mb-2 px-4">Saved Favorites</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 16,
              paddingRight: 8,
              marginBottom: 24,
            }}
            style={{ flexGrow: 0 }}
          >
            {favorites.map(item => (
              <View
                key={item.id}
                className="bg-white rounded-2xl shadow-md mr-3"
                style={{ width: 140, minHeight: 160 }}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full rounded-t-2xl"
                  style={{ height: 80, resizeMode: 'cover' }}
                />
                <View className="px-2 pb-1 pt-1">
                  <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-emerald-700 font-semibold text-sm" numberOfLines={1}>
                    ETB {item.price}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Edit Profile Button */}
          <TouchableOpacity
            className="mx-4 mb-3 py-4 rounded-2xl bg-amber-400 items-center shadow-md"
            activeOpacity={0.85}
            onPress={handleEdit}
          >
            <Text className="text-lg font-bold text-gray-900">Edit Profile</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.signOutButton]}
            onPress={handleSignOut}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
                <ActivityIndicator color="#FFFFFF"/>
            ) : (
                <Text style={styles.actionButtonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Slide-in Edit Form */}
        {editMode && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(31,41,55,0.85)',
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ translateY: slideAnim }],
                zIndex: 10,
              },
            ]}
          >
            <View className="bg-white rounded-2xl px-6 py-8 w-11/12 shadow-lg">
              <Text className="text-xl font-bold text-gray-900 mb-4">Edit Profile</Text>
              {/* ...edit fields here... */}
              <TouchableOpacity
                className="mt-4 py-3 rounded-2xl bg-amber-400 items-center"
                onPress={handleCloseEdit}
              >
                <Text className="text-lg font-bold text-gray-900">Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-2 py-2 rounded-2xl bg-gray-200 items-center"
                onPress={handleCloseEdit}
              >
                <Text className="text-base font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Loading Spinner */}
        {loading && (
          <View className="absolute inset-0 bg-black/50 justify-center items-center" style={{ zIndex: 20 }}>
            <ActivityIndicator size="large" color={amber} />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  centeredMessageContainer: { // Added this style
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: { // Added this style
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: { // Added this style
    backgroundColor: blue, // Use defined blue color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: { // Added this style
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeaderContainer: { // Renamed from inline classNames and existing styles
    backgroundColor: 'rgba(255,255,255,0.08)', // bg-white/80 approx
    borderRadius: 16, // rounded-2xl
    marginHorizontal: 0, // mx-4 was applied to parent, now direct part of this
    marginTop: 8, // mt-2
    marginBottom: 16, // mb-4
    padding: 16, // px-4 py-4
    shadowColor: '#000',
    shadowOpacity: 0.1, // shadow-md
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center', // Centering profile pic and text
  },
  avatarImage: {
    width: 80, // Increased size
    height: 80,
    borderRadius: 40, // Half of width/height
    borderWidth: 3,
    borderColor: blue,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconTouchable: {
    position: 'absolute',
    bottom: 10, // Relative to avatar bottom
    right: '35%', // Adjust to position near avatar edge
    backgroundColor: amber,
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: darkGray, // Match background for seamless look
  },
  verifiedBadge: { // Example styling if you add it
    position: 'absolute',
    top: 5,
    left: 5, // Relative to avatar
    backgroundColor: 'white',
    borderRadius: 10,
    padding:2
  },
  userInfoTextContainer: {
    alignItems: 'center', // Center texts
  },
  userNameText: {
    fontSize: 20, // text-lg
    fontWeight: 'bold',
    color: '#FFFFFF', // text-gray-900 on light, white on dark
    marginBottom: 4,
  },
  userBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userTypeBadge: {
    marginLeft: 8, // ml-2
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
    borderRadius: 999, // rounded-full
    backgroundColor: amber, // bg-amber-400
  },
  userTypeBadgeText: {
    fontSize: 11, // text-xs
    fontWeight: 'bold',
    color: darkGray, // text-gray-900
  },
  completionBadge: { // Example
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionText: { // Example
    fontSize: 12,
    color: amber,
    marginLeft: 4,
  },
  userContactText: {
    color: '#D1D5DB', // text-gray-700 on light, lighter on dark
    fontSize: 14, // text-sm
    marginBottom: 2,
  },
  userLocationText: { // Example
    color: '#9CA3AF', // text-gray-500 on light
    fontSize: 12, // text-xs
    marginTop: 2,
  },
  statsRowContainer: { // Replaces flex-row justify-between mx-4 mb-4
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // mb-4
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)', // Lighter than profileHeader for contrast
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10, // Adjusted for smaller cards
    alignItems: 'center', // Center content
    flex: 1,
    marginHorizontal: 4, // Spacing between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    color: '#9CA3AF', // text-gray-700 font-semibold text-xs mb-1
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: '#FFFFFF', // text-gray-900
  },
  statValueRating: { // Specific for rating that might include icon
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4, // ml-1
  },
  ratingContainer: { // For Rating stat card
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Styles for My Listings and Saved Favorites will need similar conversion if kept
  // For Logout Button
  actionButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#EF4444', // red-500
    // className="mx-4 mb-8 py-4 rounded-2xl bg-white/60 items-center shadow"
    marginHorizontal: 0, // Was mx-4, now parent handles padding
    marginBottom: 32, // mb-8
    // backgroundColor: 'rgba(255,255,255,0.6)', // Original style
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF', // text-lg font-bold text-gray-600 (on light bg)
    fontSize: 17,
    fontWeight: 'bold',
  },
  // Styles from original, kept if still relevant
  menuSection: { // Copied from previous version for consistency
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#E5E7EB',
  },
   gradient: { flex: 1 }, // Already defined
   safeArea: { flex: 1 }, // Already defined
   container: { // Main container for scrollview content
    flex: 1,
    padding: 16, // Replaces mx-4 on some elements
  },
});

export default ProfileScreen;
