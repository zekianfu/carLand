import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SpecChip from '@/components/details/SpecChip';
import { useAuth } from '@/context/AuthContext';
import { getOrCreateOneOnOneChatRoom, getUserProfile, subscribeToCarById } from '@/services/firebaseService';
import { Car, UserProfile } from '@/types'; // Adjusted path
// import CarCard from '../../../components/carCard'; // For similar cars, if implemented


const { width } = Dimensions.get('window');

// Helper to format price
const formatPrice = (price: number): string => {
  return price.toLocaleString('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('ETB', '').trim();
};

const CarDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ carId?: string }>();
  const carId = params.carId;
  const { user, userProfile, isLoading: authLoading } = useAuth(); // Get auth state

  const [carData, setCarData] = useState<Car | null>(null);
  const [sellerData, setSellerData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imgIndex, setImgIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false); // Placeholder for save functionality
  const [actionLoading, setActionLoading] = useState<'call' | 'chat' | 'save' | null>(null);


  useEffect(() => {
    if (!carId) {
      setError('Car ID not provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribeCar = subscribeToCarById(
      carId,
      async (car) => {
        if (car) {
          setCarData(car);
          // Ensure car.sellerId is used if that's the correct field from your Car type
          const sellerFieldId = car.sellerId || car.userId; // Fallback to userId if sellerId isn't there
          if (sellerFieldId) {
            try {
              const seller = await getUserProfile(sellerFieldId);
              setSellerData(seller);
            } catch (e) {
              console.error('Failed to fetch seller:', e);
            }
          }
          setError(null);
        } else {
          setError('Car not found.');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching car details:', err);
        setError('Failed to load car details.');
        setLoading(false);
      }
    );

    return () => unsubscribeCar();
  }, [carId]);

  const handleShare = async () => {
    if (!carData) return;
    try {
      await Share.share({
        message: `Check out this ${carData.name || carData.make + ' ' + carData.model} on FaithLink Cars! Price: ETB ${formatPrice(carData.price)}`,
        // url: `yourdeeplink/cars/${carData.id}` // Optional: Add a deep link to the car
      });
    } catch (shareError) {
      console.error('Error sharing:', shareError);
    }
  };

  const handleSaveToggle = () => {
    setActionLoading('save');
    setTimeout(() => {
        setIsSaved(!isSaved);
        setActionLoading(null);
    }, 700);
  };

  const handleCall = () => {
    if (!sellerData?.phoneNumber) return;
    setActionLoading('call');
    Linking.openURL(`tel:${sellerData.phoneNumber}`).catch(err => {
        console.error("Failed to open phone dialer:", err);
        alert("Could not open phone dialer.");
    });
    setActionLoading(null);
  };

  const handleChat = async () => {
    if (!user || !userProfile) {
      router.push('/(auth)/login');
      return;
    }
    if (!sellerData || !carData) return;
    // Ensure car.sellerId or car.userId is correctly used for seller's ID
    const sellerId = carData.sellerId || carData.userId;
    if (user.uid === sellerId) { // Compare with the actual seller ID from carData
        alert("You cannot chat with yourself.");
        return;
    }
    if (!sellerId) {
        alert("Seller information is not available for this car.");
        return;
    }


    setActionLoading('chat');
    try {
      const currentUserMinimalProfile: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'> = {
        id: user.uid,
        name: userProfile.name || user.displayName || 'User',
        profilePicUrl: userProfile.profilePicUrl || user.photoURL || undefined,
      };
      const sellerProfileForChat: Pick<UserProfile, 'id' | 'name' | 'profilePicUrl'> = {
        id: sellerId, // Use sellerId from carData
        name: sellerData.name, // Assuming sellerData is populated correctly based on sellerId
        profilePicUrl: sellerData.profilePicUrl,
      };

      const roomId = await getOrCreateOneOnOneChatRoom(
        user.uid,
        sellerId, // Use sellerId from carData
        currentUserMinimalProfile,
        sellerProfileForChat,
        // Ensure carData.name or a combination of make/model is used
        { carId: carData.id, carName: carData.name || `${carData.make} ${carData.model}`, carImage: carData.images?.[0] }
      );
      router.push({
        pathname: `/chat/${roomId}`,
        params: {
            otherUserId: sellerId, // Use sellerId
            otherUserName: sellerData.name,
            otherUserProfilePic: sellerData.profilePicUrl || '',
            chatRoomId: roomId,
         },
      });
    } catch (chatError) {
      console.error('Error starting chat:', chatError);
      alert('Could not start chat. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const CarSpecChips = useMemo(() => {
    if (!carData) return null;
    const carYear = carData.year?.toString();
    const carMileage = carData.mileage ? `${carData.mileage.toLocaleString()} km` : undefined;
    // Fallback for engineDisplacement if not present
    const engineDisp = carData.engineDisplacement || carData.engineSize;


    const specs = [
      { iconName: "event", label: carYear, iconLib: MaterialIcons },
      { iconName: "activity", label: carMileage, iconLib: Feather },
      { iconName: "water-outline", label: carData.fuelType, iconLib: Ionicons },
      { iconName: "settings-outline", label: carData.transmission, iconLib: Ionicons },
      { iconName: "speedometer-outline", label: engineDisp, iconLib: Ionicons },
      { iconName: "color-palette-outline", label: carData.exteriorColor || carData.color, iconLib: Ionicons },
    ];

    return (
      // Replaced styles.specChipContainer with NativeWind classes for flex wrapping
      <View className="flex-row flex-wrap gap-2 my-2">
        {specs.filter(spec => spec.label).map((spec, index) => {
          const IconComponent = spec.iconLib;
          return (
            <SpecChip
              key={index}
              // Replaced screenStyles.blue with NativeWind class text-blue-600 (adjust color as needed)
              icon={<IconComponent name={spec.iconName as any} size={16} className="text-blue-600" />}
              label={spec.label!}
            />
          );
        })}
      </View>
    );
  }, [carData]);


  // Example NativeWind classes for colors (can be removed if not used elsewhere, or kept for reference)
  // const amber = 'text-amber-400';
  // const blue = 'text-blue-500'; // This was a reference, actual color used above is text-blue-600
  const darkGray = 'bg-gray-900';
  const mediumGray = 'bg-gray-700';
  const white = 'text-white';

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-gradient-to-b from-gray-900 to-gray-700">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="mt-4 text-base text-gray-200">Loading Car Details...</Text>
      </View>
    );
  }

  if (error || !carData) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-gradient-to-b from-gray-900 to-gray-700">
        <Ionicons name="alert-circle-outline" size={48} color="#F59E0B" />
        <Text className="mt-4 text-base text-amber-400 text-center mb-5">{error || 'Could not load car details.'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-amber-400 px-5 py-2 rounded-lg">
          <Text className="text-gray-900 font-bold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const carImages = carData.images || [];
  const currentCondition = carData.condition === 'New' ? 'New' : carData.isNegotiable ? 'Negotiable' : 'Used';

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-900 to-gray-700">
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">
          {/* Image Carousel */}
          {carImages.length > 0 ? (
            <View className="mb-3">
              <FlatList
                data={carImages}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} className="w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-lg" /> // Responsive height
                )}
              />
              {carImages.length > 1 && (
                <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
                  {carImages.map((_, i) => (
                    <View key={i} className={`w-2 h-2 rounded-full mx-1 ${imgIndex === i ? 'bg-amber-400' : 'bg-white/50'}`} />
                  ))}
                </View>
              )}
              <View className="absolute top-3 left-3 flex-row space-x-2">
                <View className={`px-3 py-1 rounded-full ${carData.condition === 'New' ? 'bg-blue-500' : carData.isNegotiable ? 'bg-amber-400' : 'bg-gray-900/80'}`}>
                  <Text className="text-xs font-bold text-white uppercase">{currentCondition}</Text>
                </View>
                {carData.status === 'Sold' && (
                  <View className="px-3 py-1 rounded-full bg-gray-500/80">
                    <Text className="text-xs font-bold text-white uppercase">Sold</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="w-full h-56 bg-gray-200 justify-center items-center rounded-lg">
              <Ionicons name="image-outline" size={60} color="#9ca3af" />
            </View>
          )}

          {/* Car Details Card */}
          <View className="bg-white/80 rounded-2xl mx-4 mb-4 p-4 shadow">
            <Text className="text-2xl font-bold text-gray-900 mb-1">{carData.name}</Text>
            <View className="flex-row items-baseline mb-2">
              <Text className="text-2xl font-bold text-emerald-600 mr-2">
                ETB {formatPrice(carData.price)}
              </Text>
              {carData.isNegotiable && carData.condition !== 'New' && (
                <Text className="text-lg font-bold text-amber-400">Negotiable</Text>
              )}
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={18} color="#F59E0B" />
              <Text className="text-sm text-gray-700 ml-2">{carData.location}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-xs text-gray-400 mr-2">Condition:</Text>
              <Text className="text-xs font-bold text-gray-700">{carData.condition}</Text>
            </View>
            {CarSpecChips}
          </View>

          {/* Description */}
          {carData.description && (
            <View className="bg-white/80 rounded-2xl mx-4 mb-4 p-4 shadow">
              <Text className="text-base font-semibold text-gray-700 mb-1">Description</Text>
              <Text className="text-base text-gray-900 leading-6">{carData.description}</Text>
            </View>
          )}

          {/* Seller Info */}
          {sellerData && (
            <View className="bg-white/80 rounded-2xl mx-4 mb-4 p-4 flex-row items-center shadow">
              {sellerData.profilePicUrl ? (
                <Image source={{ uri: sellerData.profilePicUrl }} className="w-14 h-14 rounded-full border-2 border-blue-500 mr-4" />
              ) : (
                <View className="w-14 h-14 rounded-full bg-blue-500 justify-center items-center mr-4">
                  <Ionicons name="person-circle-outline" size={30} color="white" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{sellerData.name}</Text>
                {(sellerData.averageRating !== undefined && sellerData.reviewCount !== undefined) && (
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-base font-bold text-amber-400 ml-1">{sellerData.averageRating?.toFixed(1)}</Text>
                    <Text className="text-xs text-gray-400 ml-2">({sellerData.reviewCount} reviews)</Text>
                  </View>
                )}
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={16} color="#3B82F6" />
                  <Text className="text-sm text-gray-700 ml-2">{sellerData.phoneNumber}</Text>
                </View>
              </View>
              {user && sellerData && user.uid !== sellerData.id && (
                <TouchableOpacity className="p-2 ml-auto self-center" onPress={handleChat} disabled={actionLoading === 'chat'}>
                  {actionLoading === 'chat'
                    ? <ActivityIndicator size="small" color="#3B82F6" />
                    : <Ionicons name="chatbubbles-outline" size={20} color="#3B82F6" />}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Report Listing */}
          <TouchableOpacity className="flex-row mx-4 mb-6 py-3 rounded-2xl bg-white/60 items-center justify-center shadow" activeOpacity={0.85} onPress={() => Alert.alert("Report", "Report functionality to be implemented.")}>
            <Ionicons name="flag-outline" size={18} color="#4B5563" style={{marginRight: 8}} />
            <Text className="text-base font-bold text-gray-700">Report Listing</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Action Bar */}
        {user && sellerData && user.uid !== sellerData.id && (
          <View className="absolute left-0 right-0 bottom-0 pb-3 pt-2 bg-white/90 rounded-t-3xl shadow-lg flex-row justify-around items-center">
            <TouchableOpacity className="flex-1 mx-2 py-3 rounded-2xl flex-row justify-center items-center bg-blue-500" activeOpacity={0.85} onPress={handleCall} disabled={actionLoading === 'call'}>
              {actionLoading === 'call'
                ? <ActivityIndicator color="#fff" />
                : <Ionicons name="call" size={20} color="#fff" />}
              <Text className="text-base font-bold text-white ml-2">Call Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 mx-2 py-3 rounded-2xl flex-row justify-center items-center bg-amber-400" activeOpacity={0.85} onPress={handleChat} disabled={actionLoading === 'chat'}>
              {actionLoading === 'chat'
                ? <ActivityIndicator color="#1F2937" />
                : <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1F2937" />}
              <Text className="text-base font-bold ml-2 text-gray-900">Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mx-2 py-3 px-4 rounded-2xl bg-white/80" activeOpacity={0.85} onPress={handleSaveToggle} disabled={actionLoading === 'save'}>
              {actionLoading === 'save'
                ? <ActivityIndicator color="#F59E0B" />
                : <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? "#F59E0B" : "#1F2937"} style={{ transform: [{ scale: isSaved ? 1.1 : 1 }] }}/>}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default CarDetailScreen;