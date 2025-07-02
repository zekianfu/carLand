import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../types'; // adjust path as needed

interface CarCardProps {
  car: Car;
  onPress: (carId: string) => void;
}

// Helper to format price nicely
const formatPrice = (price: number): string =>
  price
    .toLocaleString('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace('ETB', '')
    .trim();

const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const { width } = useWindowDimensions();
  const cardWidth = width >= 768 ? width / 2 - 24 : width - 24; // padding-aware

  const firstImage = car.images?.length ? car.images[0] : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(car.id)}
      style={{ width: cardWidth }}
      className="bg-white rounded-xl shadow-md mx-1.5 mb-3 overflow-hidden"
    >
      {firstImage ? (
        <Image
          source={{ uri: firstImage }}
          className="w-full h-32 md:h-36 lg:h-40 xl:h-44 object-cover"
        />
      ) : (
        <View className="w-full h-32 md:h-36 lg:h-40 xl:h-44 bg-gray-200 flex justify-center items-center">
          <Ionicons name="image-outline" size={36} color="#9ca3af" />
          <Text className="text-xs text-gray-400 mt-1">No Image</Text>
        </View>
      )}

      <View className="px-2.5 py-2">
        <Text className="text-base font-semibold text-gray-900 mb-0.5" numberOfLines={1}>
          {car.name}
        </Text>
        <Text className="text-emerald-700 font-bold text-sm mb-1">
          ETB {car.formattedPrice || formatPrice(car.price)}
        </Text>

        <View className="flex-row justify-between items-center mt-0.5">
          <Text className="text-[11px] text-gray-600 max-w-[55%]" numberOfLines={1}>
            {car.bodyType}
          </Text>
          {car.location && (
            <View className="flex-row items-center max-w-[45%]">
              <Ionicons name="location-outline" size={11} color="#6b7280" />
              <Text className="ml-0.5 text-[11px] text-gray-500" numberOfLines={1}>
                {car.location.split(',')[0]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CarCard);
