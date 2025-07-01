import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { Car } from '../types'; // Assuming types is in parent directory relative to components/
import { Ionicons } from '@expo/vector-icons'; // For a placeholder icon

interface CarCardProps {
  car: Car;
  onPress: (carId: string) => void; // Pass carId to the handler
}

// Helper to format price
const formatPrice = (price: number): string => {
  // Format for ETB, removing 'ETB' prefix and decimals for cleaner look if desired.
  return price.toLocaleString('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('ETB', '').trim();
};

const CarCardComponent: React.FC<CarCardProps> = ({ car, onPress }) => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.47;
  const textAreaHeight = 60;

  const handlePress = () => {
    onPress(car.id);
  };

  const firstImage = car.images && car.images.length > 0 ? car.images[0] : null;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { width: cardWidth }]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      {firstImage ? (
        <Image
          source={{ uri: firstImage }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color="#cbd5e1" />
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={[styles.textContainer, { minHeight: textAreaHeight }]}>
        <Text style={styles.nameText} numberOfLines={1}>{car.name}</Text>
        <Text style={styles.priceText} numberOfLines={1}>
          ETB {car.formattedPrice || formatPrice(car.price)}
        </Text>
        <View style={styles.detailsRow}>
            <Text style={styles.bodyTypeText} numberOfLines={1}>{car.bodyType}</Text>
            {car.location && (
            <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location-outline" size={11} color="#6b7280" /> {car.location.split(',')[0]}
            </Text>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2.62,
    elevation: 3,
    marginHorizontal: 5, // Equivalent to mx-1 (approx 4px on each side if base is 4)
    marginBottom: 10, // Equivalent to mb-2.5 or mb-3
    minHeight: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: '#e5e7eb', // gray-200
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 10,
    color: '#9ca3af', // gray-400
    marginTop: 4,
  },
  textContainer: {
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 8,   // py-2
  },
  nameText: {
    fontSize: 15,         // between text-sm and text-base
    fontWeight: '600',    // font-semibold
    color: '#1f2937',     // text-gray-900
    marginBottom: 2,
  },
  priceText: {
    color: '#059669',     // text-emerald-700 (or text-emerald-600)
    fontWeight: 'bold',   // font-bold
    fontSize: 14,         // text-sm
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  bodyTypeText: {
    fontSize: 11,         // smaller than text-xs
    color: '#4b5563',     // text-gray-600
    maxWidth: '55%',
  },
  locationText: {
    fontSize: 11,
    color: '#6b7280',     // text-gray-500
    textAlign: 'right',
    maxWidth: '45%',
    flexShrink: 1, // Allow text to shrink if needed
  },
});

export default React.memo(CarCardComponent); // Renamed component to avoid conflict if CarCard is used as type
