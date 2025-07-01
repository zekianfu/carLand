import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { cars as carImages } from '@/constant/images';

type CarImageKey = keyof typeof carImages;

interface PartsCardProps {
  id: string;
  name: string;
  price: string;
  type: string;
  imageKey: CarImageKey;
  location?: string;
  onPress?: () => void;
}

// Dummy data using car image
const dummyPart = {
  id: '1',
  name: 'Brake Pad',
  price: '2,000',
  type: 'Spare Part',
  imageKey: 'corolla' as CarImageKey,
  location: 'Addis Ababa',
};

const PartsCard: React.FC<Partial<PartsCardProps>> = ({
  id = dummyPart.id,
  name = dummyPart.name,
  price = dummyPart.price,
  type = dummyPart.type,
  imageKey = dummyPart.imageKey,
  location = dummyPart.location,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.47; // Two cards per row with small gap
  const textAreaHeight = 36; // Reduced by 20%

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-md mx-1 mb-3"
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width: cardWidth, minHeight: 200 }}
    >
      {imageKey && carImages[imageKey] ? (
        <View>
          <Image
            source={carImages[imageKey]}
            className="w-full rounded-t-2xl"
            style={{ height: 120, resizeMode: 'cover' }}
          />
          <View className="px-1 pb-1 pt-1 relative" style={{ minHeight: textAreaHeight }}>
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{name}</Text>
            <Text className="text-emerald-700 font-semibold text-sm" numberOfLines={1}>ETB {price}</Text>
            <Text className="text-xs text-gray-600" numberOfLines={1}>{type}</Text>
            {location && (
              <Text
                className="text-xs text-gray-400 absolute right-3 bottom-1"
                numberOfLines={1}
              >
                {location}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center h-20">
          <Text className="text-red-500">Image not found for key: {imageKey}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PartsCard;
