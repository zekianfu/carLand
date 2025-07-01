import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CarFilters } from '../../types'; // Assuming types is at root
import { Ionicons } from '@expo/vector-icons';

interface FilterBarProps {
  initialFilters?: CarFilters;
  onApplyFilters: (filters: CarFilters) => void;
  // Possible body types, makes, etc., could be passed as props for dropdowns
  bodyTypes?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  initialFilters = {},
  onApplyFilters,
  bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Convertible'], // Example
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedBodyType, setSelectedBodyType] = useState(initialFilters.bodyType || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleApply = () => {
    const filters: CarFilters = {
      searchTerm: searchTerm.trim() || undefined,
      bodyType: selectedBodyType || undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBodyType('');
    setMinPrice('');
    setMaxPrice('');
    onApplyFilters({});
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by make, model, year..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleApply} // Apply on submit
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setShowMoreFilters(!showMoreFilters)} style={styles.filterIcon}>
            <Ionicons name={showMoreFilters ? "close-circle-outline" : "options-outline"} size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {showMoreFilters && (
        <View style={styles.moreFiltersContainer}>
          <Text style={styles.filterTitle}>Body Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bodyTypeScrollView}>
            {['All', ...bodyTypes].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.bodyTypeButton,
                  selectedBodyType === type || (type === 'All' && !selectedBodyType)
                    ? styles.bodyTypeButtonSelected
                    : {},
                ]}
                onPress={() => setSelectedBodyType(type === 'All' ? '' : type)}
              >
                <Text
                  style={[
                    styles.bodyTypeButtonText,
                    selectedBodyType === type || (type === 'All' && !selectedBodyType)
                      ? styles.bodyTypeButtonTextSelected
                      : {},
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Price Range (ETB)</Text>
          <View style={styles.priceInputRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min Price"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max Price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.applyButton, styles.clearButton]} onPress={handleClearFilters}>
                <Text style={[styles.applyButtonText, styles.clearButtonText]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F9FAFB', // gray-50
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
  },
  filterIcon: {
    padding: 10,
    marginLeft: 8,
  },
  moreFiltersContainer: {
    marginTop: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // gray-700
    marginBottom: 8,
  },
  bodyTypeScrollView: {
    marginBottom: 15,
  },
  bodyTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E5E7EB', // gray-200
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bodyTypeButtonSelected: {
    backgroundColor: '#3B82F6', // blue-500
    borderColor: '#2563EB', // blue-600
  },
  bodyTypeButtonText: {
    fontSize: 14,
    color: '#374151', // gray-700
  },
  bodyTypeButtonTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#6B7280', // gray-500
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  applyButton: {
    backgroundColor: '#3B82F6', // blue-500
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  clearButtonText: {
    color: '#374151', // gray-700
  }
});

export default React.memo(FilterBar);
