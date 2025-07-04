import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface DetailSectionCardProps {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  noPadding?: boolean; // Option to remove internal padding if children handle it
}

const DetailSectionCard: React.FC<DetailSectionCardProps> = ({
  title,
  children,
  style,
  titleStyle,
  noPadding = false,
}) => {
  return (
    <View style={[styles.card, noPadding && styles.noPaddingCard, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)', // bg-white/80 from carDetail.tsx
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    // boxShadow replaces deprecated shadow* props
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  },
  noPaddingCard: {
    padding: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // text-gray-700 or textMedium from carDetail styles
    marginBottom: 8, // mb-1 or mb-2
  },
});

export default DetailSectionCard;
