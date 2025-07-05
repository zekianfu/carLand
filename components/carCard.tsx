import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Removed Platform import as it's not used in the new version
import { Ionicons } from '@expo/vector-icons';
// Not importing Car type from @/types directly into this component as per "frontend only, no mockup data"
// Props will be defined to match the structure we expect for a car.

interface CarCardProps {
  imageUrl?: string;
  title: string;
  price: string;
  year: string | number;
  mileage: string;
  transmission: string;
  fuelType: string;
  location: string;
  isFavorite?: boolean;
  onPressFavorite?: () => void;
  onPressContact?: () => void;
  onPressCard?: () => void;
}

// Helper function for price display (can be localized/enhanced later)
const formatPriceDisplay = (priceValue: string | number): string => {
  if (typeof priceValue === 'number') {
    return priceValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }); // Example, adjust currency as needed
  }
  return priceValue; // Assume already formatted if string
};

const CarCard: React.FC<CarCardProps> = ({
  imageUrl,
  title = "Placeholder Car Title", // Default values for easier preview
  price = "N/A",
  year = "202X",
  mileage = "XX,XXX km",
  transmission = "Automatic",
  fuelType = "Petrol",
  location = "City, Country",
  isFavorite: initialIsFavorite = false,
  onPressFavorite,
  onPressContact,
  onPressCard,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    if (onPressFavorite) {
      onPressFavorite(); // Call the passed-in handler if provided
    }
  };

  const DEFAULT_CAR_IMAGE = 'https://via.placeholder.com/600x400.png?text=No+Image';

  return (
    <TouchableOpacity
      activeOpacity={0.85} // Slightly less opacity change on press for a refined feel
      onPress={onPressCard}
      // Card container:
      // `bg-white dark:bg-slate-800`: Light/dark mode background.
      // `rounded-xl`: Consistent rounded corners.
      // `shadow-lg dark:shadow-black/50`: Softer shadow for dark mode.
      // `overflow-hidden`: Essential for child elements to respect rounded corners.
      // `mb-6 mx-2`: Margin for spacing in a list (mx-2 for some horizontal space from screen edges).
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-black/40 overflow-hidden mb-6 mx-2"
    >
      {/* Image Section */}
      <View className="relative">
        {/* Image:
            `w-full`: Takes full width of the card.
            `aspect-[16/10]`: A common and pleasing aspect ratio for cover images.
            `object-cover`: Ensures image covers the area, cropping if necessary.
        */}
        <Image
          source={{ uri: imageUrl || DEFAULT_CAR_IMAGE }}
          className="w-full aspect-[16/10] object-cover"
          resizeMode="cover" // Explicitly set resizeMode
        />
        {/* Favorite Icon Button:
            `absolute top-3 right-3`: Positions icon at the top-right corner of the image.
            `p-2.5`: Slightly larger padding for a better touch target.
            `bg-black/40 dark:bg-black/60`: Semi-transparent background for icon visibility.
            `rounded-full`: Circular background for the icon.
            `z-10`: Ensures it's above the image.
        */}
        <TouchableOpacity
          onPress={handleFavoritePress}
          className="absolute top-3 right-3 p-2.5 bg-black/40 dark:bg-black/60 rounded-full z-10 active:bg-black/60"
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22} // Slightly smaller icon for a cleaner look
            // `text-white` for outline, `text-red-500` (a vibrant red) when favorited.
            color={isFavorite ? '#FF3B30' /* Standard iOS red, very visible */ : 'white'}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      {/* `p-4`: Standard padding within the content area. */}
      <View className="p-4">
        {/* Title and Price Row:
            `flex-row justify-between items-start mb-2.5`: Aligns title and price, `items-start` for text alignment if one wraps.
        */}
        <View className="flex-row justify-between items-start mb-2.5">
          {/* Title:
              `text-xl font-bold text-slate-800 dark:text-slate-50`: Prominent title. Using a very light gray for dark mode.
              `flex-1 mr-2`: Allows title to grow and ensures spacing from price.
          */}
          <Text
            className="text-xl font-bold text-slate-800 dark:text-slate-50 flex-1 mr-2"
            numberOfLines={2} // Allows title to wrap up to two lines.
          >
            {title}
          </Text>
          {/* Price:
              `text-xl font-bold text-primary dark:text-secondary`: Uses theme colors. `primary` (indigo) for light, `secondary` (amber) for dark.
              `whitespace-nowrap`: Prevents price from wrapping.
          */}
          <Text className="text-xl font-bold text-primary dark:text-secondary whitespace-nowrap">
            {formatPriceDisplay(price)}
          </Text>
        </View>

        {/* Details Section:
            `space-y-1.5 mb-4`: Vertical spacing between detail items, and margin before button.
        */}
        <View className="space-y-1.5 mb-4">
          {/* Detail Item Structure: icon + text.
              `flex-row items-center`: Aligns icon and text horizontally.
              `text-sm text-slate-600 dark:text-slate-300`: Consistent styling for detail text.
              Icon: `text-slate-500 dark:text-slate-400 mr-2`.
          */}
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} className="text-slate-500 dark:text-slate-400 mr-2" />
            <Text className="text-sm text-slate-600 dark:text-slate-300">{year}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="speedometer-outline" size={16} className="text-slate-500 dark:text-slate-400 mr-2" />
            <Text className="text-sm text-slate-600 dark:text-slate-300">{mileage}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="construct-outline" size={16} className="text-slate-500 dark:text-slate-400 mr-2" />
            <Text className="text-sm text-slate-600 dark:text-slate-300">{transmission}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="color-fill-outline" size={16} className="text-slate-500 dark:text-slate-400 mr-2" />
            <Text className="text-sm text-slate-600 dark:text-slate-300">{fuelType}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} className="text-slate-500 dark:text-slate-400 mr-2" />
            <Text className="text-sm text-slate-600 dark:text-slate-300" numberOfLines={1}>{location}</Text>
          </View>
        </View>

        {/* Contact Seller Button:
            `bg-primary dark:bg-secondary`: Uses theme colors for button background.
            `py-3`: Vertical padding for button height.
            `rounded-lg`: Standard rounded corners for buttons.
            `flex-row justify-center items-center`: Centers content if icon were present.
            `shadow-sm active:shadow-md`: Subtle interaction feedback.
        */}
        <TouchableOpacity
          onPress={onPressContact}
          className="bg-primary dark:bg-secondary py-3 rounded-lg flex-row justify-center items-center shadow-sm active:shadow-lg active:opacity-80"
          activeOpacity={0.8} // Control opacity on press
        >
          {/* Button Text:
              `text-white dark:text-slate-900`: Contrasting text colors for button.
              `font-semibold text-base text-center`.
          */}
          <Text className="text-white dark:text-slate-900 font-semibold text-base text-center">Contact Seller</Text>
        </TouchableOpacity>
      </View>

      {/*
        NativeWind Class Explanations:

        Container (`TouchableOpacity`):
        - `bg-white dark:bg-slate-800`: Sets background to white in light mode, slate-800 (dark gray) in dark mode.
        - `rounded-xl`: Applies extra-large rounded corners.
        - `shadow-lg dark:shadow-black/40`: Applies a large shadow, with a custom black shadow (40% opacity) for dark mode for better visibility.
        - `overflow-hidden`: Ensures child elements (like the image) are clipped to the rounded corners.
        - `mb-6`: Margin bottom of 6 units (1.5rem or 24px by default) for spacing between cards in a list.
        - `mx-2`: Margin horizontal of 2 units (0.5rem or 8px) for slight spacing from screen edges.
        - `activeOpacity={0.85}`: React Native TouchableOpacity prop for press feedback.

        Image Section (`View` & `Image`):
        - `relative`: For positioning the favorite icon absolutely within this view.
        - `Image.className="w-full aspect-[16/10] object-cover"`:
            - `w-full`: Image takes the full width of its parent.
            - `aspect-[16/10]`: Sets the aspect ratio of the image to 16:10. This is more flexible than fixed height for responsiveness.
            - `object-cover`: Scales the image to maintain its aspect ratio while filling the element's entire content box (cropping if necessary).
        - `Image.resizeMode="cover"`: Explicit React Native prop, similar to `object-cover`.

        Favorite Icon Button (`TouchableOpacity` & `Ionicons`):
        - `absolute top-3 right-3`: Positions the button at the top-right corner of the image container (3 units from top/right).
        - `p-2.5`: Padding around the icon for a larger, easier touch target.
        - `bg-black/40 dark:bg-black/60`: Semi-transparent black background for the button, slightly darker in dark mode.
        - `rounded-full`: Makes the button background circular.
        - `z-10`: Ensures the button is rendered on top of the image.
        - `active:bg-black/60`: Darkens background slightly on press for feedback.
        - `Ionicons.color`: Dynamically sets icon color based on `isFavorite` state (vibrant red when favorite, white otherwise).
        - `Ionicons.size={22}`: Sets icon size.

        Content Section (`View`):
        - `p-4`: Padding of 4 units (1rem or 16px) on all sides of the content area.

        Title and Price Row (`View` & `Text`):
        - `flex-row justify-between items-start mb-2.5`: Arranges title and price in a row, distributes space between them, aligns items to the start of the cross-axis (top), and adds margin bottom.
        - Title `Text.className="text-xl font-bold text-slate-800 dark:text-slate-50 flex-1 mr-2"`:
            - `text-xl font-bold`: Large and bold text.
            - `text-slate-800 dark:text-slate-50`: Dark gray text in light mode, very light gray/off-white in dark mode.
            - `flex-1`: Allows the title to take up available horizontal space.
            - `mr-2`: Margin right to create space between title and price.
        - `numberOfLines={2}`: Allows title to wrap to a maximum of two lines.
        - Price `Text.className="text-xl font-bold text-primary dark:text-secondary whitespace-nowrap"`:
            - `text-xl font-bold`: Same size/weight as title for balance.
            - `text-primary dark:text-secondary`: Uses `primary` color (indigo) from `tailwind.config.js` for light mode, and `secondary` color (amber) for dark mode.
            - `whitespace-nowrap`: Prevents the price from wrapping to a new line.

        Details Section (`View` containing multiple detail items):
        - `space-y-1.5`: Adds vertical spacing of 1.5 units between child elements (each detail row).
        - `mb-4`: Margin bottom before the "Contact Seller" button.
        - Detail Item (`View` & `Text` & `Ionicons`):
            - `flex-row items-center`: Aligns icon and text on the same line, centered vertically.
            - `Ionicons.className="text-slate-500 dark:text-slate-400 mr-2"`: Medium gray icon color, margin right for spacing.
            - `text-sm text-slate-600 dark:text-slate-300`: Smaller text for details, slightly lighter gray in dark mode.
            - `numberOfLines={1}` (for location): Prevents location from wrapping, truncating if too long.

        Contact Seller Button (`TouchableOpacity` & `Text`):
        - `bg-primary dark:bg-secondary`: Uses theme colors for the button background (indigo in light, amber in dark).
        - `py-3`: Vertical padding to define button height.
        - `rounded-lg`: Rounded corners for the button.
        - `flex-row justify-center items-center`: Centers the text within the button.
        - `shadow-sm active:shadow-lg active:opacity-80`: Adds a small shadow, increases shadow and reduces opacity on press for feedback.
        - Button `Text.className="text-white dark:text-slate-900 font-semibold text-base text-center"`:
            - `text-white dark:text-slate-900`: White text on primary bg, dark text on secondary bg for contrast.
            - `font-semibold text-base`: Medium font weight and standard text size.
            - `text-center`: Centers text (though `justify-center` on parent already does this for a single line).

        Comments for future responsiveness:
        - These are just ideas for how one might adapt the card for larger screens using NativeWind's responsive prefixes (e.g., `md:`, `lg:`).
      */}
    </TouchableOpacity>
  );
};

export default React.memo(CarCard);
