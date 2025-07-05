import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Platform } from 'react-native'; // Removed useWindowDimensions
import { SafeAreaView } from 'react-native-safe-area-context';

import CarCard from '@/components/carCard';
import { CarListSkeleton } from '@/components/common/SkeletonLoader';
import FeaturedCars from '@/components/FeaturedCars';
import FilterBar from '@/components/feed/FilterBar';
import { useDebounce } from '@/hooks/useDebounce';
import { subscribeToCars } from '@/backend/services/firebaseService';
import { Car, CarFilters } from '@/types';

const ITEMS_PER_PAGE = 12; // Fetch more for grid layouts

const FeedScreen: React.FC = () => {
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CarFilters>({});
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const currentFilters = useMemo(() => ({
    ...filters,
    searchTerm: debouncedSearchTerm,
  }), [filters, debouncedSearchTerm]);

  useEffect(() => {
    setLoading(true);
    setCars([]);
    setLastVisibleDoc(null);
    setHasMore(true);

    const unsubscribe = subscribeToCars(
      currentFilters, null, ITEMS_PER_PAGE,
      (fetchedCars, newLastVisible, moreAvailable) => {
        setCars(fetchedCars);
        setLastVisibleDoc(newLastVisible);
        setHasMore(moreAvailable);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars. Please try again.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentFilters]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    const unsubscribe = subscribeToCars(
      currentFilters, lastVisibleDoc, ITEMS_PER_PAGE,
      (fetchedCars, newLastVisible, moreAvailable) => {
        setCars(prev => [...prev, ...fetchedCars]);
        setLastVisibleDoc(newLastVisible);
        setHasMore(moreAvailable);
        setLoadingMore(false);
        unsubscribe();
      },
      (err) => {
        console.error("Error loading more cars:", err);
        setLoadingMore(false);
        unsubscribe();
      }
    );
  }, [hasMore, loadingMore, loading, currentFilters, lastVisibleDoc]);

  const handleApplyFilters = useCallback((newFilters: CarFilters) => {
    setFilters(newFilters);
  }, []);

  const navigateToCarDetails = useCallback((carId: string) => {
    router.push(`/buyDetail/carDetail?carId=${carId}`);
  }, [router]);

  const renderCarItem = useCallback(({ item }: { item: Car }) => (
    <View className="w-full p-1.5 sm:p-2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <CarCard car={item} onPress={navigateToCarDetails} />
    </View>
  ), [navigateToCarDetails]);

  const ListEmptyComponent = useCallback(() => {
    if (loading && cars.length === 0) return null;
    return (
      <View className="flex-1 justify-center items-center py-10 mt-10">
        <Text className="text-lg text-gray-400 text-center mb-2">
          {error ? error : "No cars found matching your criteria."}
        </Text>
        <Text className="text-base text-gray-500 text-center">
          Try adjusting the filters or check back later!
        </Text>
      </View>
    );
  }, [loading, error, cars.length]);

  const ListFooterComponent = useCallback(() => {
    if (loadingMore) {
      return <ActivityIndicator size="large" color="#F59E0B" className="my-8" />;
    }
    if (!hasMore && !loading && cars.length > 0) {
      return <Text className="text-center text-gray-400 py-8 text-base">You've seen all available cars!</Text>;
    }
    return null;
  }, [loadingMore, hasMore, loading, cars.length]);

  // Memoize ListHeaderComponent as its props (filters, handleApplyFilters) change.
  const ListHeader = useMemo(() => (
    <View className="w-full">
      <FilterBar onApplyFilters={handleApplyFilters} initialFilters={filters} />
      <FeaturedCars />
      <Text className="text-2xl font-bold text-white px-2 sm:px-0 my-4">Browse Vehicles</Text>
    </View>
  ), [handleApplyFilters, filters]); // Dependencies for ListHeader

  // MainContent can be a sub-component or just JSX structure
  // No need to memoize MainContent itself if its props don't change frequently or if FlatList handles memoization internally.
  const MainContent = (
    <FlatList
      data={cars}
      renderItem={renderCarItem}
      keyExtractor={(item) => item.id}
      numColumns={1} // Set to 1 for web-like flexbox wrapping handled by item styles
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 32,
        paddingTop: Platform.OS === 'web' ? 8 : 8,
        ...(Platform.OS === 'web' && { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' })
      }}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.7}
      initialNumToRender={ITEMS_PER_PAGE} // Render enough items to fill the screen initially
      maxToRenderPerBatch={ITEMS_PER_PAGE} // How many items to render per batch
      windowSize={21} // Default: (2*10 + 1), defines the virtual window of items
    />
  );

  return (
    <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1">
      <SafeAreaView className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {loading && cars.length === 0 && !error ? (
          <>
            {ListHeader}
            <CarListSkeleton count={ITEMS_PER_PAGE / 2} /> {/* Show a reasonable number of skeletons */}
          </>
        ) : (
          MainContent // Render the FlatList structure
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FeedScreen;
