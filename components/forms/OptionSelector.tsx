import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface OptionSelectorProps {
  options: string[];
  selectedValue: string | string[]; // Can be single string or array for multi-select
  onSelectValue: (value: string) => void; // For single select, or to toggle in multi-select
  label?: string;
  multiSelect?: boolean; // If true, selectedValue should be string[]
  containerStyle?: StyleProp<ViewStyle>;
  chipStyle?: StyleProp<ViewStyle>;
  selectedChipStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  horizontal?: boolean; // Default true for scroll view
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedValue,
  onSelectValue,
  label,
  multiSelect = false,
  containerStyle,
  chipStyle,
  selectedChipStyle,
  textStyle,
  selectedTextStyle,
  horizontal = true,
}) => {
  const isSelected = (option: string) => {
    if (multiSelect && Array.isArray(selectedValue)) {
      return selectedValue.includes(option);
    }
    return selectedValue === option;
  };

  const renderOptions = () => (
    options.map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.chip,
          chipStyle,
          isSelected(option) && styles.selectedChip,
          isSelected(option) && selectedChipStyle,
        ]}
        onPress={() => onSelectValue(option)}
      >
        <Text
          style={[
            styles.chipText,
            textStyle,
            isSelected(option) && styles.selectedChipText,
            isSelected(option) && selectedTextStyle,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    ))
  );

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderOptions()}
        </ScrollView>
      ) : (
        <View style={styles.verticalContainer}>
          {renderOptions()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151', // text-gray-700
    marginBottom: 8,
  },
  scrollContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, // Add some padding for the scroll view itself if needed
  },
  verticalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap in vertical mode
  },
  chip: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8,   // py-2
    marginRight: 8,       // mr-2 (for horizontal)
    marginBottom: 8,      // For vertical wrapping
    borderRadius: 999,    // rounded-full
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    backgroundColor: '#FFFFFF', // bg-white
  },
  selectedChip: {
    backgroundColor: '#F59E0B', // bg-amber-400
    borderColor: '#F59E0B',     // border-amber-400
  },
  chipText: {
    fontSize: 14,         // text-sm
    color: '#374151',    // text-gray-700
  },
  selectedChipText: {
    color: '#1F2937',    // text-gray-900
    fontWeight: 'bold',
  },
});

export default OptionSelector;
