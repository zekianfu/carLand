import React from 'react';
import { View, Text } from 'react-native'; // Removed StyleSheet
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Added LinearGradient

const PartDetail = () => {
  const params = useLocalSearchParams();
  const { partId, partName, partPrice, partType, partImageKey, partLocation } = params;

  // In a real app, you would use partId to fetch more details if needed
  // For now, we'll just display the passed parameters

  return (
    <LinearGradient
      colors={['#1F2937', '#4B5563']} // Dark gradient from profile.tsx
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-4"> {/* styles.container */}
          <Text className="text-2xl font-bold mb-6 text-white text-center">Part Details</Text> {/* styles.title, added mb-6, text-center */}

          <View className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <View className="flex-row mb-3 pb-3 border-b border-gray-700 items-center"> {/* styles.detailItem */}
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">ID:</Text> {/* styles.label, w-28 for more space */}
              <Text className="text-base text-gray-100 shrink">{Array.isArray(partId) ? partId.join(', ') : partId}</Text> {/* styles.value */}
            </View>
            <View className="flex-row mb-3 pb-3 border-b border-gray-700 items-center">
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">Name:</Text>
              <Text className="text-base text-gray-100 shrink">{Array.isArray(partName) ? partName.join(', ') : partName}</Text>
            </View>
            <View className="flex-row mb-3 pb-3 border-b border-gray-700 items-center">
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">Price:</Text>
              <Text className="text-base text-amber-400 shrink">ETB {Array.isArray(partPrice) ? partPrice.join(', ') : partPrice}</Text> {/* Price styled with amber */}
            </View>
            <View className="flex-row mb-3 pb-3 border-b border-gray-700 items-center">
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">Type:</Text>
              <Text className="text-base text-gray-100 shrink">{Array.isArray(partType) ? partType.join(', ') : partType}</Text>
            </View>
            <View className="flex-row mb-3 pb-3 border-b border-gray-700 items-center">
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">Image Key:</Text>
              <Text className="text-base text-gray-100 shrink">{Array.isArray(partImageKey) ? partImageKey.join(', ') : partImageKey}</Text>
            </View>
            <View className="flex-row items-center"> {/* Last item, no border bottom or mb */}
              <Text className="text-base font-semibold text-gray-400 mr-2 w-28">Location:</Text>
              <Text className="text-base text-gray-100 shrink">{Array.isArray(partLocation) ? partLocation.join(', ') : partLocation}</Text>
            </View>
          </View>
          {/* Add more details display here as needed, following the pattern above */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// StyleSheet.create block removed

export default PartDetail;
