import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import CarCard from '../../components/carCard'; // Adjusted path
import FeaturedCars from '../../components/FeaturedCars'; // Adjusted path
import FilterBar from '../../components/feed/FilterBar'; // Adjusted path
import { CarListSkeleton } from '../../components/common/SkeletonLoader'; // Adjusted path

import { subscribeToCars } from '../../services/firebaseService'; // Adjusted path
import { Car, CarFilters } from '../../types'; // Adjusted path
import { useDebounce } from '../../hooks/useDebounce'; // Will need to create this hook

const { width } = Dimensions.get('window');
const cardWidth = width * 0.47;


const FeedScreen: React.FC = () => {
  const router = useRouter();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CarFilters>({});
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500); // Debounce search term

  const [lastVisibleDoc, setLastVisibleDoc] = useState<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const currentFilters = useMemo(() => {
    return {
        ...filters,
        searchTerm: debouncedSearchTerm, // Use debounced term for querying
    };
  }, [filters, debouncedSearchTerm]);


  // Effect for initial load and filter changes
  useEffect(() => {
    setLoading(true);
    setCars([]); // Clear cars when filters change for a fresh load
    setLastVisibleDoc(null); // Reset pagination
    setHasMore(true);

    const unsubscribe = subscribeToCars(
      currentFilters,
      null, // Start from the beginning
      10, // Page size
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
  }, [currentFilters]); // Re-run when debouncedSearchTerm or other filters change

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;

    setLoadingMore(true);
    const unsubscribe = subscribeToCars(
      currentFilters,
      lastVisibleDoc,
      10,
      (fetchedCars, newLastVisible, moreAvailable) => {
        setCars((prevCars) => [...prevCars, ...fetchedCars]);
        setLastVisibleDoc(newLastVisible);
        setHasMore(moreAvailable);
        setLoadingMore(false);
        // Unsubscribe immediately after fetching a page for load more
        // Real-time updates are primarily for the initial set or filter changes
        unsubscribe();
      },
      (err) => {
        console.error("Error loading more cars:", err);
        setLoadingMore(false);
        unsubscribe();
      }
    );
    // We don't return this unsubscribe here as it's short-lived for pagination.
  }, [hasMore, loadingMore, loading, currentFilters, lastVisibleDoc]);

  const handleApplyFilters = useCallback((newFilters: CarFilters) => {
    setFilters(newFilters);
  }, []);

  const navigateToCarDetails = (carId: string) => {
    router.push(`/buyDetail/carDetail?carId=${carId}`); // Adjust path as per your car detail screen
    // Or using object: router.push({ pathname: '/buyDetail/carDetail', params: { carId } });
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <CarCard car={item} onPress={navigateToCarDetails} />
  );

  const ListEmptyComponent = () => {
    if (loading) return null; // Skeleton is handled by main loading state
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          {error ? error : "No cars found matching your criteria. Try adjusting the filters!"}
        </Text>
      </View>
    );
  };

  const ListFooterComponent = () => {
    if (loadingMore) {
      return <ActivityIndicator size="large" color="#FFF" style={{ marginVertical: 20 }} />;
    }
    if (!hasMore && !loading && cars.length > 0) {
      return <Text style={styles.noMoreCarsText}>You've seen all cars!</Text>;
    }
    return null;
  };

  if (loading && cars.length === 0 && !error) {
    return (
      <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <FilterBar onApplyFilters={handleApplyFilters} initialFilters={filters} />
          <CarListSkeleton cardWidth={cardWidth} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1F2937', '#4B5563']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <FlatList
          data={cars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={
            <>
              <FilterBar onApplyFilters={handleApplyFilters} initialFilters={filters} />
              <FeaturedCars />
              <View style={{ height: 16 }} />
            </>
          }
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // How far from the end (in units of visible length) to trigger
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 4, // For space around the 2 columns
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-around', // Distribute space evenly around cards
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#D1D5DB', // Tailwind gray-300
    textAlign: 'center',
  },
  noMoreCarsText: {
    textAlign: 'center',
    color: '#9CA3AF', // Tailwind gray-400
    paddingVertical: 20,
    fontSize: 14,
  },
});

export default FeedScreen;
