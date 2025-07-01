import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type GlassySearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

const GlassySearchBar: React.FC<GlassySearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = "Search...",
}) => {
  return (
    <BlurView
      intensity={60}
      tint="light"
      className="rounded-xl border border-gray-200 flex-row items-center px-2 my-2"
      style={{ minHeight: 36, alignItems: 'center' }}
    >
      <Ionicons name="search" size={18} color="#6b7280" />
      <TextInput
        className="flex-1 ml-2 text-sm text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: 'transparent',
          height: 32,
          paddingVertical: 0,
          paddingTop: 0,
          paddingBottom: 0,
          textAlignVertical: 'center',
        }}
        returnKeyType="search"
        onSubmitEditing={onSearch}
        underlineColorAndroid="transparent"
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </BlurView>
  );
};

export default GlassySearchBar;