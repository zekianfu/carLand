import React, { ReactElement } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface SpecChipProps {
  icon?: ReactElement; // Allow passing an icon component (e.g., <Ionicons ... />)
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
}

const SpecChip: React.FC<SpecChipProps> = ({
  icon,
  label,
  containerStyle,
  labelStyle,
  iconContainerStyle,
}) => {
  if (!label) return null; // Don't render if label is empty

  return (
    <View style={[styles.chip, containerStyle]}>
      {icon && <View style={[styles.iconContainer, iconContainerStyle]}>{icon}</View>}
      <Text style={[styles.labelText, labelStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.08)', // Light blue background from carDetail
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 6,
  },
  labelText: {
    color: '#111827', // textDark from carDetail
    fontWeight: '600',
    fontSize: 13,
  },
});

export default SpecChip;
