import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarCard from '../../components/carCard';
import { CarListSkeleton } from '../../components/common/SkeletonLoader';
import FeaturedCars from '../../components/FeaturedCars';
import FilterBar from '../../components/feed/FilterBar';

import { useDebounce } from '../../hooks/useDebounce';
import { subscribeToCars } from '../../services/firebaseService';
import { Car, CarFilters } from '../../types';

const getNumColumns = (width: number) => {
  if (width >= 1280) return 4; // xl screens
  if (width >= 1024) return 3; // lg screens
  if (width >= 768) return 2;  // md screens
  return 1; // mobile
};

const FeedScreen: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);

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
      currentFilters,
      null,
      10,
      (fetchedCars, newLastVisible, moreAvailable) => {
        setCars(fetchedCars);
        setLastVisibleDoc(newLastVisible);
        setHasMore(moreAvailable);
        setLoading(false);
        setError(null);
      },
      () => {
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
      currentFilters,
      lastVisibleDoc,
      10,
      (fetchedCars, newLastVisible, moreAvailable) => {
        setCars(prev => [...prev, ...fetchedCars]);
        setLastVisibleDoc(newLastVisible);
        setHasMore(moreAvailable);
        setLoadingMore(false);
        unsubscribe();
      },
      () => {
        setLoadingMore(false);
        unsubscribe();
      }
    );
  }, [hasMore, loadingMore, loading, currentFilters, lastVisibleDoc]);

  const handleApplyFilters = useCallback((newFilters: CarFilters) => {
    setFilters(newFilters);
  }, []);

  const navigateToCarDetails = (carId: string) => {
    router.push(`/buyDetail/carDetail?carId=${carId}`);
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <View
      className="p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-[400px] min-w-[250px] self-center"
    >
      <CarCard car={item} onPress={navigateToCarDetails} />
    </View>
  );

  const ListEmptyComponent = () => {
    if (loading) return null;
    return (
      <View className="flex-1 justify-center items-center p-8 mt-12">
        <Text className="text-base text-gray-400 text-center">
          {error ? error : "No cars found matching your criteria. Try adjusting the filters!"}
        </Text>
      </View>
    );
  };

  const ListFooterComponent = () => {
    if (loadingMore) {
      return <ActivityIndicator size="large" color="#FFF" className="my-5" />;
    }
    if (!hasMore && !loading && cars.length > 0) {
      return <Text className="text-center text-gray-400 py-5 text-sm">You've seen all cars!</Text>;
    }
    return null;
  };

  // 🧊 Skeleton loader state
  if (loading && cars.length === 0 && !error) {
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1">
        <SafeAreaView className="flex-1 px-2 md:px-8 xl:px-24">
          <FilterBar onApplyFilters={handleApplyFilters} initialFilters={filters} />
          <CarListSkeleton />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1">
      <SafeAreaView className="flex-1 px-2 md:px-8 xl:px-24">
        <FlatList
          data={cars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
          // 🪄 keep last row left‑aligned
          columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
          ListHeaderComponent={
            <>
              <FilterBar onApplyFilters={handleApplyFilters} initialFilters={filters} />
              <FeaturedCars />
              <View className="h-4" />
            </>
          }
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FeedScreen;
