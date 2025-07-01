import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

interface FormFieldWrapperProps {
  label?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  required?: boolean;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  children,
  style,
  labelStyle,
  required = false,
}) => {
  return (
    <View style={[styles.card, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)', // Equivalent to bg-white/80
    borderRadius: 16, // Equivalent to rounded-2xl
    marginBottom: 12, // Equivalent to mb-3
    paddingHorizontal: 16, // Equivalent to px-4
    paddingVertical: 12, // Equivalent to py-3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Approximation of shadow-md
    shadowRadius: 4,    // Approximation of shadow-md
    elevation: 3,       // For Android shadow
  },
  label: {
    color: '#374151', // Equivalent to text-gray-700
    fontWeight: '600', // Equivalent to font-semibold
    marginBottom: 4,   // Equivalent to mb-1
    fontSize: 15,
  },
  requiredAsterisk: {
    color: '#EF4444', // text-red-500
  },
});

export default FormFieldWrapper;
