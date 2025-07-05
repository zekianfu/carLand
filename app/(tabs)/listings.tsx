import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarCard from '@/components/carCard'; // Verify path to CarCard
import { Stack } from 'expo-router';

// Placeholder data for multiple cards.
// In a real app, this would come from an API or state management.
const PLACEHOLDER_CARS_DATA = [
  {
    id: '1',
    title: 'Modern Sedan Example',
    price: 'ETB 1,550,000',
    year: '2022',
    mileage: '15,000 km',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    location: 'Addis Ababa, Bole',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop', // Replace with a valid placeholder
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Family SUV Showcase',
    price: 'ETB 2,800,000',
    year: '2021',
    mileage: '25,000 km',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    location: 'Addis Ababa, CMC',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop', // Replace with a valid placeholder
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Compact City Car',
    price: 'ETB 950,000',
    year: '2023',
    mileage: '5,000 km',
    transmission: 'Manual',
    fuelType: 'Petrol',
    location: 'Addis Ababa, Kazanchis',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop', // Replace with a valid placeholder
  },
  {
    id: '4',
    title: 'Luxury Off-Roader',
    price: 'ETB 4,200,000',
    year: '2022',
    mileage: '18,000 km',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    location: 'Addis Ababa, Old Airport',
    imageUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1000&auto=format&fit=crop', // Replace with another placeholder
  },
];

const ListingsScreen = () => {
  const renderCarCard = ({ item }: { item: typeof PLACEHOLDER_CARS_DATA[0] }) => (
    <CarCard
      title={item.title}
      price={item.price}
      year={item.year}
      mileage={item.mileage}
      transmission={item.transmission}
      fuelType={item.fuelType}
      location={item.location}
      imageUrl={item.imageUrl}
      isFavorite={item.isFavorite}
      onPressCard={() => {
        // Handle card press, e.g., navigate to details
        // For now, just log
        console.log('Card pressed:', item.title);
      }}
      onPressFavorite={() => {
        // Handle favorite toggle
        console.log('Favorite pressed for:', item.title);
      }}
      onPressContact={() => {
        // Handle contact seller
        console.log('Contact seller for:', item.title);
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-100 dark:bg-slate-900">
      {/* Screen Header using Stack.Screen options for a cleaner look */}
      <Stack.Screen
        options={{
          headerTitle: 'Car Listings',
          headerLargeTitle: true,
          headerStyle: { backgroundColor: '#FFFFFF' }, // Light header
          headerTintColor: '#1F2937', // Dark text for header
          headerTitleStyle: {
             color: '#1F2937', // Ensure title color is dark
             fontFamily: 'Inter-Bold', // Assuming Inter-Bold is loaded
          },
          // For dark mode, you might need to adjust headerStyle dynamically or use a different approach
          // For now, keeping it simple with a light header.
        }}
      />

      {/* NativeWind classes for styling FlatList and its container */}
      {/* `pt-4`: Padding top to provide space below the header. */}
      {/* `px-2`: Horizontal padding for the list content, so cards are not edge-to-edge.
                 Note: CarCard itself has `mx-2`, so this `px-2` on FlatList's contentContainerStyle
                 will make the effective horizontal space around cards `px-4` from screen edge.
                 Alternatively, remove `mx-2` from CarCard and rely solely on FlatList padding.
                 Let's keep mx-2 on CarCard and use contentContainerStyle for overall list padding.
      */}
      <FlatList
        data={PLACEHOLDER_CARS_DATA}
        renderItem={renderCarCard}
        keyExtractor={(item) => item.id}
        // `contentContainerClassName` (NativeWind specific for ScrollView/FlatList content)
        // or `contentContainerStyle` for regular RN style objects.
        // Using className for consistency with NativeWind.
        contentContainerClassName="py-4" // py-4 adds padding top and bottom for the scrollable content
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-lg text-slate-500 dark:text-slate-400">No listings available right now.</Text>
          </View>
        }
        // For future web responsiveness (grid layout):
        // On web, the FlatList renders items in a flex container.
        // To achieve a grid, CarCard itself would need responsive width classes (e.g., md:w-1/2, lg:w-1/3)
        // and the FlatList's parent or contentContainer should allow flex wrapping.
        // For native, numColumns prop would be used and calculated based on screen width.
        // Example for web, if FlatList's content container is a flex-wrap enabled View:
        // CarCard could have: className="... md:w-[48%] lg:w-[31%] xl:w-[23%]" (accounting for margins)
      />
    </SafeAreaView>
  );
};

export default ListingsScreen;
