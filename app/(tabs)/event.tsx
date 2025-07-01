import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FormFieldWrapper from '../../components/common/FormFieldWrapper'; // New
import OptionSelector from '../../components/forms/OptionSelector'; // New

const CATEGORY_OPTIONS = ['Vehicle', 'Part'];
const VEHICLE_TYPES = ['Car', 'Motorcycle', 'Truck'];
const PART_TYPES = ['Tires', 'Engine', 'Accessories', 'Brakes', 'Suspension'];
const CONDITION_OPTIONS = ['New', 'Used'];
const COLOR_OPTIONS = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Other'];

const amber = '#F59E0B';
const darkGray = '#1F2937';

const Event = () => {
  const [category, setCategory] = useState('Vehicle');
  const [vehicleType, setVehicleType] = useState('');
  const [partType, setPartType] = useState('');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('New');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Validation
  const isVehicle = category === 'Vehicle';
  const isPart = category === 'Part';
  const canPublish =
    title &&
    category &&
    (isVehicle ? vehicleType : partType) &&
    brand &&
    condition &&
    location &&
    price &&
    description &&
    images.length > 0 &&
    phone;

  // Dummy image picker
  const handlePickImage = () => {
    setImages([...images, 'https://via.placeholder.com/120x80.png?text=Image']);
  };

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={[darkGray, '#4B5563']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => {}} className="mr-3">
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">Create New Listing</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Listing Type Selector */}
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
            style={{ flexGrow: 0, overflow: 'visible', marginBottom: 12 }}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                className={`px-6 py-2 mr-2 rounded-full border ${
                  category === opt
                    ? 'bg-amber-400 border-amber-400'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => setCategory(opt)}
              >
                <Text
                  className={`text-base font-bold ${
                    category === opt ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Glassy Input Cards */}
          <View className="px-4">
            {/* Title */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Item Title *</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="Enter title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                style={{ paddingVertical: 6 }}
              />
            </View>

            {/* Category */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Category *</Text>
              <Text className="text-base text-gray-900">{category}</Text>
            </View>

            {/* Vehicle/Part Type */}
            {category === 'Vehicle' && (
              <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
                <Text className="text-gray-700 font-semibold mb-1">Vehicle Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {VEHICLE_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      className={`px-4 py-2 mr-2 rounded-full border ${
                        vehicleType === type
                          ? 'bg-amber-400 border-amber-400'
                          : 'bg-white border-gray-300'
                      }`}
                      onPress={() => setVehicleType(type)}
                    >
                      <Text
                        className={`text-sm ${
                          vehicleType === type ? 'text-gray-900 font-bold' : 'text-gray-700'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {category === 'Part' && (
              <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
                <Text className="text-gray-700 font-semibold mb-1">Part Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {PART_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      className={`px-4 py-2 mr-2 rounded-full border ${
                        partType === type
                          ? 'bg-amber-400 border-amber-400'
                          : 'bg-white border-gray-300'
                      }`}
                      onPress={() => setPartType(type)}
                    >
                      <Text
                        className={`text-sm ${
                          partType === type ? 'text-gray-900 font-bold' : 'text-gray-700'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Brand / Model */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Brand / Model *</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="e.g. Toyota, Bosch"
                placeholderTextColor="#9CA3AF"
                value={brand}
                onChangeText={setBrand}
                style={{ paddingVertical: 6 }}
              />
            </View>

            {/* Condition */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Condition *</Text>
              <View className="flex-row">
                {CONDITION_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    className={`px-4 py-2 mr-2 rounded-full border ${
                      condition === opt
                        ? 'bg-amber-400 border-amber-400'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setCondition(opt)}
                  >
                    <Text
                      className={`text-sm ${
                        condition === opt ? 'text-gray-900 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Location *</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="Enter location"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
                style={{ paddingVertical: 6 }}
              />
            </View>

            {/* Price & Negotiable */}
            <View
              className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md"
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ flex: 1 }}>
                <Text className="text-gray-700 font-semibold mb-1">Price *</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="ETB"
                  placeholderTextColor="#9CA3AF"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  style={{ paddingVertical: 6 }}
                />
              </View>
              <TouchableOpacity
                className={`ml-4 px-4 py-2 rounded-full border ${
                  negotiable ? 'bg-amber-400 border-amber-400' : 'bg-white border-gray-300'
                }`}
                onPress={() => setNegotiable(!negotiable)}
              >
                <Text
                  className={`text-sm ${
                    negotiable ? 'text-gray-900 font-bold' : 'text-gray-700'
                  }`}
                >
                  Negotiable
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Option */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Delivery Option</Text>
              <TouchableOpacity
                className={`px-4 py-2 rounded-full border ${
                  delivery ? 'bg-amber-400 border-amber-400' : 'bg-white border-gray-300'
                }`}
                onPress={() => setDelivery(!delivery)}
              >
                <Text
                  className={`text-sm ${
                    delivery ? 'text-gray-900 font-bold' : 'text-gray-700'
                  }`}
                >
                  {delivery ? 'Delivery Available' : 'No Delivery'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Color Selector (for vehicles) */}
            {category === 'Vehicle' && (
              <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
                <Text className="text-gray-700 font-semibold mb-1">Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {COLOR_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      className={`px-4 py-2 mr-2 rounded-full border ${
                        color === opt
                          ? 'bg-amber-400 border-amber-400'
                          : 'bg-white border-gray-300'
                      }`}
                      onPress={() => setColor(opt)}
                    >
                      <Text
                        className={`text-sm ${
                          color === opt ? 'text-gray-900 font-bold' : 'text-gray-700'
                        }`}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Description */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md" style={{ minHeight: 80 }}>
              <Text className="text-gray-700 font-semibold mb-1">Description *</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="Describe your item..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ paddingVertical: 6, minHeight: 40 }}
              />
            </View>

            {/* Upload Images */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Upload Images *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={{
                      width: 80,
                      height: 60,
                      borderRadius: 12,
                      marginRight: 8,
                      borderWidth: 2,
                      borderColor: amber,
                    }}
                  />
                ))}
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="w-20 h-16 bg-white/60 rounded-xl items-center justify-center border-2 border-dashed border-amber-400"
                  style={{ marginRight: 8 }}
                >
                  <Ionicons name="camera" size={28} color={amber} />
                  <Text className="text-xs text-amber-500 mt-1">Add</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Phone Number */}
            <View className="bg-white/80 rounded-2xl mb-3 px-4 py-3 shadow-md">
              <Text className="text-gray-700 font-semibold mb-1">Contact Phone *</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="+251 9xxxxxxx"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ paddingVertical: 6 }}
              />
            </View>

            {/* Save as Draft */}
            <TouchableOpacity
              className="mt-2 mb-4 py-3 rounded-2xl bg-white/20 items-center"
              onPress={() => setSaved(true)}
            >
              <Text className="text-white font-semibold">Save as Draft</Text>
            </TouchableOpacity>
          </View>

          {/* Publish Button */}
          <View className="px-4 mt-2">
            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${
                canPublish ? 'bg-amber-400' : 'bg-gray-400/60'
              }`}
              disabled={!canPublish || loading}
              onPress={handlePublish}
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 8,
                marginBottom: 24,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-lg font-bold text-gray-900">Publish Listing</Text>
              )}
            </TouchableOpacity>
            {saved && (
              <View className="mt-2 items-center">
                <Text className="text-emerald-400 font-semibold">Saved!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Styles for components used within FormFieldWrapper
  textInput: {
    fontSize: 16,
    color: '#1F2937', // text-gray-900
    paddingVertical: 8, // Adjusted for consistent height
  },
  textArea: {
    minHeight: 60, // For description
    textAlignVertical: 'top', // Android
  },
  staticText: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    backgroundColor: '#FFFFFF', // bg-white
  },
  toggleButtonSelected: {
    backgroundColor: amber, // bg-amber-400
    borderColor: amber,     // border-amber-400
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#374151',    // text-gray-700
  },
  toggleButtonTextSelected: {
    color: '#1F2937',    // text-gray-900
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 80,
    height: 60,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: amber,
  },
  addImageButton: {
    width: 80, // Adjusted to match image width
    height: 60, // Adjusted to match image height
    backgroundColor: 'rgba(255,255,255,0.6)', // bg-white/60
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: amber, // border-amber-400
    borderStyle: 'dashed',
    marginRight: 8,
  },
  addImageButtonText: {
    fontSize: 12,
    color: amber, // text-amber-500
    marginTop: 2, // mt-1
  },
  // Other styles remain the same
  // ... (publish button, header, etc. styles are unchanged for now)
});

export default Event;
