import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Added MaterialCommunityIcons
import { Car } from '@/types';

const AMBER_COLOR = '#F59E0B'; // Consistent amber
const TEXT_LIGHT = '#E5E7EB'; // Light text (gray-200)
const TEXT_MUTED = '#9CA3AF'; // Muted text (gray-400)
const TEXT_DARK = '#1F2937'; // Dark text for status badge
const CARD_BG_DARK = '#1F2937'; // Darker card background (slate-800 equivalent)
const CARD_BORDER_DARK = '#374151'; // Slightly lighter border (slate-700 equivalent)

interface CarCardProps {
  car: Car;
  onPress: (carId: string) => void;
}

const formatPrice = (price: number): string => {
  if (isNaN(price)) return 'N/A';
  return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatMileage = (mileage?: number): string => {
  if (mileage === undefined || isNaN(mileage)) return 'N/A';
  return `${mileage.toLocaleString('en-US')} ${mileage === 0 ? 'km (New)' : 'km'}`;
};

const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const firstImage = car.images?.length ? car.images[0] : null;

  // Determine status color
  let statusColor = 'bg-green-500'; // Available
  if (car.status === 'Sold') statusColor = 'bg-red-500';
  if (car.status === 'Pending') statusColor = 'bg-yellow-500';


  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(car.id)}
      // Base styling for the card, designed to be full width of its grid column
      // Hover effects for web/desktop
      className={`
        w-full bg-[${CARD_BG_DARK}] rounded-lg shadow-lg overflow-hidden
        border border-[${CARD_BORDER_DARK}]
        transition-all duration-200 ease-in-out
        ${Platform.OS === 'web' ? 'hover:shadow-amber-500/40 hover:shadow-2xl hover:border-amber-500' : ''}
      `}
    >
      {/* Image Section */}
      <View className="relative">
        {firstImage ? (
          <Image
            source={{ uri: firstImage }}
            // Responsive height, larger base, cover content
            className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover"
          />
        ) : (
          <View className={`w-full h-48 sm:h-52 md:h-56 lg:h-60 bg-slate-700 flex justify-center items-center`}>
            <Ionicons name="car-sport-outline" size={60} color={TEXT_MUTED} />
            <Text className={`text-sm text-[${TEXT_MUTED}] mt-1`}>No Image</Text>
          </View>
        )}
        {/* Status Badge */}
        {car.status && (
          <View className={`absolute top-2 right-2 px-2.5 py-1 rounded-full ${statusColor} shadow-md`}>
            <Text className={`text-xs font-semibold text-white`}>{car.status}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-3 md:p-4">
        {/* Title and Price Row */}
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className={`text-lg md:text-xl font-bold text-[${TEXT_LIGHT}] flex-shrink mr-2`}
            numberOfLines={2} // Allow two lines for longer titles
          >
            {car.make} {car.model} ({car.year})
          </Text>
          <Text className={`text-lg md:text-xl font-bold text-[${AMBER_COLOR}] whitespace-nowrap`}>
            ETB {car.formattedPrice || formatPrice(car.price)}
          </Text>
        </View>

        {/* Location - more prominent */}
        {car.location && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color={TEXT_MUTED} />
            <Text className={`ml-1.5 text-sm text-[${TEXT_MUTED}]`} numberOfLines={1}>
              {car.location}
            </Text>
          </View>
        )}

        {/* Specs Grid/Row */}
        <View className="mt-2 pt-2 border-t border-slate-700">
          <View className="flex-row flex-wrap justify-start items-center -m-1">
            {/* Mileage */}
            <View className="flex-row items-center p-1">
              <MaterialCommunityIcons name="speedometer" size={16} color={TEXT_MUTED} />
              <Text className={`ml-1.5 text-xs md:text-sm text-[${TEXT_MUTED}]`}>{formatMileage(car.mileage)}</Text>
            </View>
            {/* Transmission */}
            <View className="flex-row items-center p-1">
              <MaterialCommunityIcons name="car-shift-pattern" size={16} color={TEXT_MUTED} />
              <Text className={`ml-1.5 text-xs md:text-sm text-[${TEXT_MUTED}]`}>{car.transmission}</Text>
            </View>
             {/* Body Type */}
             {car.bodyType && (
              <View className="flex-row items-center p-1">
                <Ionicons name="car-sport-outline" size={16} color={TEXT_MUTED} />
                <Text className={`ml-1.5 text-xs md:text-sm text-[${TEXT_MUTED}]`}>{car.bodyType}</Text>
              </View>
            )}
            {/* Fuel Type */}
            {car.fuelType && (
              <View className="flex-row items-center p-1">
                <MaterialCommunityIcons name="fuel" size={16} color={TEXT_MUTED} />
                <Text className={`ml-1.5 text-xs md:text-sm text-[${TEXT_MUTED}]`}>{car.fuelType}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CarCard);
