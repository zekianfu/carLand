import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
 
// Helper to format price range to short form (e.g., 1k, 2m, 40m)
function formatShort(range: string) {
  const [min, max] = range.split(' - ').map(s => s.replace(/,/g, ''));
  const short = (n: string) => {
    const num = parseInt(n, 10);
    if (num >= 1_000_000) return `${num / 1_000_000}m`;
    if (num >= 1_000) return `${num / 1_000}k`;
    return num;
  };
  return `${short(min)} - ${short(max)}`;
}

type PriceRange =
  | '150,000 - 500,000'
  | '500,001 - 1,000,000'
  | '1,000,001 - 2,000,000'
  | '2,000,001 - 5,000,000'
  | '5,000,001 - 10,000,000'
  | '10,000,001 - 20,000,000'
  | '20,000,001 - 40,000,000';

const PRICE_RANGES: PriceRange[] = [
  '150,000 - 500,000',
  '500,001 - 1,000,000',
  '1,000,001 - 2,000,000',
  '2,000,001 - 5,000,000',
  '5,000,001 - 10,000,000',
  '10,000,001 - 20,000,000',
  '20,000,001 - 40,000,000',
];

type DropdownProps = {
  value: PriceRange | undefined;
  onChange: (range: PriceRange) => void;
  placeholder?: string;
};

const screenWidth = Dimensions.get('window').width;
const dropdownWidth = screenWidth * 0.45;

const PriceRangeDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  placeholder = 'Price range...',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View
      className="relative"
      style={{
        width: dropdownWidth,
        minWidth: 110,
        maxWidth: 200,
        zIndex: 10,
      }}
    >
      <View
        className="bg-white/80 rounded-2xl shadow-md flex-row items-center px-3"
        style={{
          minHeight: 44,
          alignItems: 'center',
          borderRadius: 18,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          className="flex-1 flex-row items-center h-11"
          activeOpacity={0.85}
          onPress={() => setOpen((prev) => !prev)}
        >
          <Ionicons name="pricetag-outline" size={20} color="#6b7280" />
          <Text className="ml-2 text-base text-gray-900 flex-1 font-semibold" numberOfLines={1}>
            {value ? formatShort(value) : placeholder}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>
      {open && (
        <View
          className="absolute left-0 right-0 bg-white rounded-2xl border border-gray-200 shadow-lg"
          style={{
            top: 48,
            zIndex: 100,
            minWidth: dropdownWidth,
            maxWidth: 200,
            overflow: 'visible',
          }}
        >
          <ScrollView>
            {PRICE_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                className={`px-4 py-3 ${value === range ? 'bg-emerald-100' : ''}`}
                onPress={() => {
                  onChange(range);
                  setOpen(false);
                }}
                activeOpacity={0.85}
              >
                <Text
                  className={`text-base ${
                    value === range ? 'text-emerald-700 font-bold' : 'text-gray-700'
                  }`}
                >
                  {formatShort(range)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default PriceRangeDropdown;
