import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';

// Import car images and featuredCars data from your constants
import { cars as carImages } from '@/constant/images';

// Type for car image keys
type CarImageKey = keyof typeof carImages;

// Type for featured car
type FeaturedCar = {
  id: string;
  name: string;
  price: string;
  type: string;
  imageKey: CarImageKey;
};

// Example featured cars data (replace with your actual data source if needed)
const featuredCars: FeaturedCar[] = [
  {
    id: '1',
    name: 'Toyota Corolla',
    price: '1,200,000',
    type: 'Sedan',
    imageKey: 'corolla',
  },
  {
    id: '3',
    name: 'Mazda CX-5',
    price: '4,200,000',
    type: 'SUV',
    imageKey: 'cx5',
  },
  {
    id: '4',
    name: 'Honda Civic',
    price: '2,000,000',
    type: 'Sedan',
    imageKey: 'civic',
  },
];

// Type-safe featured card component
const FeaturedCard: React.FC<{ car: FeaturedCar }> = ({ car }) => (
  <TouchableOpacity
    className="bg-white/80 rounded-2xl mr-4 shadow-md"
    activeOpacity={0.85}
    style={{
      minHeight: 180,
      width: 220,
      padding: 0,
      overflow: 'hidden',
      borderWidth: 0,
      marginBottom: 2,
    }}
  >
    {car.imageKey && carImages[car.imageKey] && (
      <Image
        source={carImages[car.imageKey]}
        className="w-full"
        style={{
          height: 100,
          width: '100%',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          resizeMode: 'cover',
        }}
      />
    )}
    <View className="px-4 py-3">
      <Text className="text-lg font-bold text-gray-900 mb-1">{car.name}</Text>
      <Text className="text-emerald-700 font-semibold mb-1">ETB {car.price}</Text>
      <Text className="text-xs text-gray-500">{car.type}</Text>
    </View>
  </TouchableOpacity>
);

// FeaturedCars section component
const FeaturedCars: React.FC = () => {
  return (
    <View className="mt-4">
      <Text className="text-white text-lg font-bold mb-2 px-4">Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 16,
          paddingRight: 8,
        }}
        style={{ flexGrow: 0 }}
      >
        {featuredCars.map(car => (
          <FeaturedCard key={car.id} car={car} />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedCars;
