import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Removed useWindowDimensions
import { Ionicons } from '@expo/vector-icons';
import { Car } from '@/types'; // Changed to alias

// Note: This card will now take the full width offered by its parent column/container.
// If specific responsive widths like 50% on md screens are needed,
// the parent container (e.g., FlatList or View with flex-wrap) should manage column counts
// or this component would need responsive width classes like `md:w-1/2`.
// For now, it's made flexible (w-full) to fit into various grid layouts.

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
  // Removed useWindowDimensions and cardWidth calculation
  const firstImage = car.images?.length ? car.images[0] : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(car.id)}
      // Changed to dark card theme
      className="w-full bg-slate-800 rounded-xl shadow-lg mx-1.5 mb-3 overflow-hidden border border-slate-700"
    >
      {firstImage ? (
        <Image
          source={{ uri: firstImage }}
          className="w-full h-32 md:h-36 lg:h-40 xl:h-44 object-cover" // Responsive height is good
        />
      ) : (
        // Darker placeholder
        <View className="w-full h-32 md:h-36 lg:h-40 xl:h-44 bg-slate-700 flex justify-center items-center">
          <Ionicons name="image-outline" size={36} color="#cbd5e1" /> {/* slate-300 icon color */}
          <Text className="text-xs text-slate-400 mt-1">No Image</Text>
        </View>
      )}

      <View className="px-2.5 py-2">
        <Text className="text-base font-semibold text-gray-100 mb-0.5" numberOfLines={1}> {/* Text to light */}
          {car.name}
        </Text>
        <Text className="text-amber-400 font-bold text-sm mb-1"> {/* Price to amber */}
          ETB {car.formattedPrice || formatPrice(car.price)}
        </Text>

        <View className="flex-row justify-between items-center mt-0.5">
          <Text className="text-[11px] text-gray-400 max-w-[55%]" numberOfLines={1}> {/* Text to lighter gray */}
            {car.bodyType}
          </Text>
          {car.location && (
            <View className="flex-row items-center max-w-[45%]">
              <Ionicons name="location-outline" size={11} color="#94a3b8" /> {/* slate-400 icon color */}
              <Text className="ml-0.5 text-[11px] text-gray-500" numberOfLines={1}> {/* Text to lighter gray */}
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
