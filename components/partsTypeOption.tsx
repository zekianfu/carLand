import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const PARTS_TYPES = [
  'All',
  'Engine',
  'Brakes',
  'Suspension',
  'Transmission',
  'Electrical',
  'Body',
  'Interior',
  'Wheels',
];

interface PartsTypeOptionProps {
  value?: string;
  onChange: (type: string) => void;
}

const PartsTypeOption: React.FC<PartsTypeOptionProps> = ({ value = 'All', onChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 2,
        paddingHorizontal: 8,
      }}
      style={{ flexGrow: 0, overflow: 'visible' }}
    >
      {PARTS_TYPES.map(item => (
        <TouchableOpacity
          key={item}
          className={`px-4 py-2 mr-2 rounded-full border ${
            value === item
              ? 'bg-emerald-600 border-emerald-600'
              : 'bg-white border-gray-300'
          }`}
          onPress={() => onChange(item)}
        >
          <Text
            className={`text-sm ${
              value === item ? 'text-white font-bold' : 'text-gray-700'
            }`}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PartsTypeOption;