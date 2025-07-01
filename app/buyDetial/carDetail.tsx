import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  Linking,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import { Car, UserProfile } from '../../../types'; // Adjusted path
import { subscribeToCarById, getUserProfile, getOrCreateOneOnOneChatRoom } from '../../../services/firebaseService'; // Adjusted path
import { useAuth } from '../../../context/AuthContext'; // Import useAuth
import DetailSectionCard from '../../../components/details/DetailSectionCard'; // Import new component
import SpecChip from '../../../components/details/SpecChip'; // Import new component
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
      <View style={styles.specChipContainer}>
        {specs.filter(spec => spec.label).map((spec, index) => {
          const IconComponent = spec.iconLib;
          return (
            <SpecChip
              key={index}
              icon={<IconComponent name={spec.iconName as any} size={16} color={screenStyles.blue} />}
              label={spec.label!}
            />
          );
        })}
      </View>
    );
  }, [carData]);


  if (loading) {
    return (
      <LinearGradient colors={[styles.darkGray, styles.mediumGray]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.amber} />
        <Text style={styles.loadingText}>Loading Car Details...</Text>
      </LinearGradient>
    );
  }

  if (error || !carData) {
    return (
      <LinearGradient colors={[styles.darkGray, styles.mediumGray]} style={styles.loadingContainer}>
         <Stack.Screen options={{ title: "Error" }} />
        <Ionicons name="alert-circle-outline" size={48} color={styles.amber} />
        <Text style={styles.errorText}>{error || 'Could not load car details.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const carImages = carData.images || [];
  const currentCondition = carData.condition === 'New' ? 'New' : carData.isNegotiable ? 'Negotiable' : 'Used';
  const conditionBgColor = carData.condition === 'New' ? styles.blue.color : carData.isNegotiable ? styles.amber.color : 'rgba(31,41,55,0.8)';


  return (
    <LinearGradient colors={[styles.darkGray, styles.mediumGray]} style={styles.gradient}>
      <Stack.Screen options={{ title: carData.name || "Car Details" }} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header is handled by Stack.Screen now */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {/* Image Carousel */}
          {carImages.length > 0 ? (
            <View style={styles.carouselContainer}>
              <FlatList
                data={carImages}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.carouselImage} />
                )}
              />
              {carImages.length > 1 && (
                <View style={styles.carouselIndicatorContainer}>
                  {carImages.map((_, i) => (
                    <View key={i} style={[styles.carouselIndicator, { backgroundColor: imgIndex === i ? styles.amber.color : 'rgba(255,255,255,0.5)' }]}/>
                  ))}
                </View>
              )}
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: conditionBgColor }]}>
                  <Text style={styles.badgeText}>{currentCondition}</Text>
                </View>
                {carData.status === 'Sold' && (
                  <View style={[styles.badge, styles.soldBadge]}>
                    <Text style={styles.badgeText}>Sold</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={[styles.carouselImage, styles.imagePlaceholder]}>
                 <Ionicons name="image-outline" size={60} color="#9ca3af" />
            </View>
          )}

          {/* Car Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.carName}>{carData.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                ETB {formatPrice(carData.price)}
              </Text>
              {carData.isNegotiable && ! (carData.condition === 'New') && ( // Don't show negotiable if new and price is fixed
                <Text style={styles.negotiableText}>Negotiable</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={styles.amber.color} />
              <Text style={styles.infoText}>{carData.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.conditionLabel}>Condition:</Text>
              <Text style={styles.conditionValue}>{carData.condition}</Text>
            </View>
            {SpecChips}
          </View>

          {/* Description */}
          {carData.description && (
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{carData.description}</Text>
            </View>
          )}


          {/* Seller Info */}
          {sellerData && (
            <View style={[styles.sectionCard, styles.sellerCard]}>
              {sellerData.profilePicUrl ? (
                <Image source={{ uri: sellerData.profilePicUrl }} style={styles.sellerAvatar} />
              ) : (
                <View style={[styles.sellerAvatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person-circle-outline" size={30} color="white" />
                </View>
              )}
              <View style={styles.sellerInfoContainer}>
                <Text style={styles.sellerName}>{sellerData.name}</Text>
                { (sellerData.averageRating !== undefined && sellerData.reviewCount !== undefined) &&
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color={styles.amber.color} />
                        <Text style={styles.ratingText}>{sellerData.averageRating?.toFixed(1)}</Text>
                        <Text style={styles.reviewsText}>({sellerData.reviewCount} reviews)</Text>
                    </View>
                }
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color={styles.blue.color} />
                  <Text style={styles.sellerContactText}>{sellerData.phoneNumber}</Text>
                </View>
              </View>
               {/* Mini Message button inside seller card */}
               {user && sellerData && user.uid !== sellerData.id && (
                  <TouchableOpacity style={styles.miniMessageButton} onPress={handleChat} disabled={actionLoading === 'chat'}>
                      {actionLoading === 'chat' ? <ActivityIndicator size="small" color={styles.blue.color} /> : <Ionicons name="chatbubbles-outline" size={20} color={styles.blue.color} />}
                  </TouchableOpacity>
                )}
            </View>
          )}

          {/* Report Listing: Only show if logged in? Or allow anonymous reports? For now, always show. */}
          <TouchableOpacity style={styles.reportButton} activeOpacity={0.85} onPress={() => Alert.alert("Report", "Report functionality to be implemented.")}>
            <Ionicons name="flag-outline" size={18} color="#4B5563" style={{marginRight: 8}} />
            <Text style={styles.reportButtonText}>Report Listing</Text>
          </TouchableOpacity>

          {/* Similar Cars Section - Placeholder for now */}
          {/* <View style={styles.similarCarsSection}>
            <Text style={styles.similarCarsTitle}>Similar Cars</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarCarsScroll}>
              {[...Array(3)].map((_, idx) => ( <CarCardSkeleton key={idx} cardWidth={width * 0.4} /> ))}
            </ScrollView>
          </View> */}
        </ScrollView>

        {/* Bottom Action Bar: Only show if user is logged in and not the seller */}
        {user && sellerData && user.uid !== sellerData.id && (
            <View style={styles.bottomActionBar}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85} onPress={handleCall} disabled={actionLoading === 'call'}>
                {actionLoading === 'call' ? <ActivityIndicator color="#fff" /> : <Ionicons name="call" size={20} color="#fff" />}
                <Text style={styles.actionButtonText}>Call Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.chatButton]} activeOpacity={0.85} onPress={handleChat} disabled={actionLoading === 'chat'}>
                {actionLoading === 'chat' ? <ActivityIndicator color={styles.darkGray} /> : <Ionicons name="chatbubble-ellipses-outline" size={20} color={styles.darkGray} />}
                <Text style={[styles.actionButtonText, styles.chatButtonText]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSaveToggle} disabled={actionLoading === 'save'}>
                {actionLoading === 'save' ? <ActivityIndicator color={styles.amber.color} /> : <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? styles.amber.color : styles.darkGray} style={{ transform: [{ scale: isSaved ? 1.1 : 1 }] }}/>}
            </TouchableOpacity>
            </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// Re-define colors here or import from a constants file
const screenStyles = {
  darkGray: '#1F2937',
  mediumGray: '#4B5563',
  amber: '#F59E0B',
  blue: '#3B82F6',
  lightGray: '#F3F4F6',
  textDark: '#111827',
  textMedium: '#374151',
  textLight: '#6B7280',
  white: '#FFFFFF',
  emerald: '#059669',
};

const styles = StyleSheet.create({
  darkGray: screenStyles.darkGray, // For direct use if needed
  mediumGray: screenStyles.mediumGray,
  amber: screenStyles.amber,
  blue: screenStyles.blue,

  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: screenStyles.lightGray,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: screenStyles.amber,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: screenStyles.amber,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: screenStyles.darkGray,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Header is now managed by Stack.Screen options for title, back button color, etc.
  // For custom header elements like share:
  // navigation.setOptions({ headerRight: () => <TouchableOpacity onPress={handleShare}><Ionicons name="share-social-outline" size={24} color={styles.amber} /></TouchableOpacity> });

  scrollContentContainer: { paddingBottom: 100 },
  carouselContainer: { marginBottom: 12 }, // mb-3
  carouselImage: { width: width, height: 220, resizeMode: 'cover' },
  imagePlaceholder: { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center'},
  carouselIndicatorContainer: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  carouselIndicator: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 },
  badgeContainer: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }, // px-3 py-1 rounded-full
  badgeText: { fontSize: 12, fontWeight: 'bold', color: screenStyles.white, textTransform: 'uppercase' },
  soldBadge: { backgroundColor: 'rgba(107, 114, 128, 0.8)' }, // gray-500 with opacity

  detailsCard: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, marginHorizontal: 16, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  carName: { fontSize: 22, fontWeight: 'bold', color: screenStyles.textDark, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  priceText: { fontSize: 24, fontWeight: 'bold', color: screenStyles.emerald, marginRight: 8 },
  negotiableText: { fontSize: 16, fontWeight: 'bold', color: screenStyles.amber },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 14, color: screenStyles.textMedium, marginLeft: 6 },
  conditionLabel: { fontSize: 13, color: screenStyles.textLight, marginRight: 4 },
  conditionValue: { fontSize: 13, fontWeight: 'bold', color: screenStyles.textMedium },

  specChipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  specChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  specIcon: { color: screenStyles.blue }, // Applied directly to icon component
  specText: { marginLeft: 6, color: screenStyles.textDark, fontWeight: '600', fontSize: 13 },

  sectionCard: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, marginHorizontal: 16, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: screenStyles.textMedium, marginBottom: 6 },
  descriptionText: { fontSize: 15, color: screenStyles.textDark, lineHeight: 22 },

  sellerCard: { flexDirection: 'row', alignItems: 'center' },
  sellerAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: screenStyles.blue, marginRight: 14 },
  avatarPlaceholder: { backgroundColor: screenStyles.blue, justifyContent: 'center', alignItems: 'center' },
  sellerInfoContainer: { flex: 1 },
  sellerName: { fontSize: 18, fontWeight: 'bold', color: screenStyles.textDark },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ratingText: { fontSize: 15, fontWeight: 'bold', color: screenStyles.amber, marginLeft: 4 },
  reviewsText: { fontSize: 12, color: screenStyles.textLight, marginLeft: 6 },
  sellerContactText: { fontSize: 14, color: screenStyles.textMedium, marginLeft: 6 },
  miniMessageButton: { padding:8, marginLeft: 'auto', alignSelf: 'center' },


  reportButton: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 24, paddingVertical: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  reportButtonText: { fontSize: 16, fontWeight: 'bold', color: screenStyles.textMedium },

  // Similar Cars (Placeholder Styling)
  // similarCarsSection: { marginTop: 8, marginBottom: 32 },
  // similarCarsTitle: { fontSize: 18, fontWeight: 'bold', color: screenStyles.white, marginBottom: 8, paddingHorizontal: 16 },
  // similarCarsScroll: { paddingLeft: 16, paddingRight: 8 },

  bottomActionBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 12, paddingTop: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 8, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  actionButton: { flex: 1, marginHorizontal: 8, paddingVertical: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, // mx-2 py-3
  callButton: { backgroundColor: screenStyles.blue },
  chatButton: { backgroundColor: screenStyles.amber },
  actionButtonText: { fontSize: 16, fontWeight: 'bold', color: screenStyles.white, marginLeft: 8 },
  chatButtonText: { color: screenStyles.darkGray },
  saveButton: { marginHorizontal: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.8)' }, // flex-0 mx-2 py-3 px-4
});

export default CarDetailScreen;