import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type CarBodyType =
  | 'Sedan'
  | 'SUV'
  | 'Hatchback'
  | 'Coupe'
  | 'Convertible'
  | 'Wagon'
  | 'Pickup'
  | 'Van'
  | 'Crossover'
  | 'Sports Car';

const CAR_BODY_TYPES: CarBodyType[] = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Wagon',
  'Pickup',
  'Van',
  'Crossover',
  'Sports Car',
];

type DropdownProps = {
  value: CarBodyType;
  onChange: (type: CarBodyType) => void;
  placeholder?: string;
};

const screenWidth = Dimensions.get('window').width;
const dropdownWidth = screenWidth * 0.40;

const CarBodyTypeDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select body type...',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <BlurView
      intensity={60}
      tint="light"
      className="rounded-xl border border-gray-200 flex-row items-center px-2 my-2 relative"
      style={{
        minHeight: 36,
        alignItems: 'center',
        width: dropdownWidth,
        maxWidth: 180,
        minWidth: 90,
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: 32 }}
        activeOpacity={0.85}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Ionicons name="car-outline" size={18} color="#6b7280" />
        <Text className="ml-2 text-sm text-gray-800 flex-1" numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#6b7280"
        />
      </TouchableOpacity>
      {open && (
        <View
          className="absolute left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg"
          style={{
            top: 40,
            zIndex: 100, // High zIndex ensures it's above everything else
            minWidth: dropdownWidth,
            maxWidth: 180,
            overflow: 'visible',
          }}
        >
          <ScrollView>
            {CAR_BODY_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-4 py-2 ${value === type ? 'bg-emerald-100' : ''}`}
                onPress={() => {
                  onChange(type);
                  setOpen(false);
                }}
              >
                <Text
                  className={`text-sm ${
                    value === type ? 'text-emerald-700 font-bold' : 'text-gray-700'
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </BlurView>
  );
};

export default CarBodyTypeDropdown;
