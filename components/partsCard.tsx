import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Removed useWindowDimensions
import { cars as carImages } from '@/constant/images';

type CarImageKey = keyof typeof carImages;
// Note: Ensure this component is used in a context that provides appropriate width,
// e.g., a FlatList with numColumns or a View with flex layout.
// The card itself will now try to take the full width offered by its parent column/container.

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
  // Removed useWindowDimensions and cardWidth, textAreaHeight calculations

  return (
    <TouchableOpacity
      // Card background changed to dark (e.g., slate-800), text colors adjusted.
      className="w-full bg-slate-800 rounded-2xl shadow-lg mx-1 mb-3 min-h-[200px] border border-slate-700"
      activeOpacity={0.85}
      onPress={onPress}
    >
      {imageKey && carImages[imageKey] ? (
        <View className="flex-1 flex-col">
          <Image
            source={carImages[imageKey]}
            className="w-full rounded-t-2xl h-[120px] resize-cover"
          />
          <View className="px-2 py-1.5 relative min-h-9 flex-1"> {/* Adjusted padding slightly */}
            <Text className="text-base font-bold text-gray-100" numberOfLines={1}>{name}</Text>
            <Text className="text-amber-400 font-semibold text-sm" numberOfLines={1}>ETB {price}</Text> {/* Price to amber */}
            <Text className="text-xs text-gray-400" numberOfLines={1}>{type}</Text>
            {location && (
              <Text
                className="text-xs text-gray-500 absolute right-2 bottom-1.5" /* Adjusted position */
                numberOfLines={1}
              >
                {location}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center h-20 bg-slate-700 rounded-2xl">
          <Text className="text-red-400">Image not found</Text> {/* Adjusted text for dark bg */}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PartsCard;
