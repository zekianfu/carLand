import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import PartsCard from '@/components/partsCard';
import PartsTypeOption from '@/components/partsTypeOption';
import { cars as carImages } from '@/constant/images';
import GlassySearchBar from '@/components/searchBar';

const ITEMS_PER_PAGE = 8; // Number of items to fetch per page

// Expanded dummy data generation
const generateDummyPart = (id: number) => {
	const types = ['Brakes', 'Engine', 'Suspension', 'Electrical', 'Body', 'Interior'];
	const locations = ['Addis Ababa', 'Adama', 'Bahir Dar', 'Hawassa', 'Mekelle', 'Dire Dawa'];
	const names = ['Brake Pad', 'Engine Oil', 'Shock Absorber', 'Headlight', 'Fender', 'Seat Cover', 'Air Filter', 'Spark Plug'];
	const imageKeys = ['corolla', 'civic', 'cx-5', 'tucsan'] as Array<keyof typeof carImages>; // Ensure type safety

	return {
		id: id.toString(),
		name: `${names[id % names.length]} Model ${String.fromCharCode(65 + (id % 26))}${id % 10}`,
		price: ((id % 50) * 100 + 500).toString(),
		type: types[id % types.length],
		imageKey: imageKeys[id % imageKeys.length],
		location: locations[id % locations.length],
	};
};

const allDummyParts = Array.from({ length: 50 }, (_, i) => generateDummyPart(i + 1)); // Generate 50 dummy parts

const Sermon = () => {
	const router = useRouter();
	const [partsType, setPartsType] = useState<string>('All');
	const [search, setSearch] = useState('');

	const [displayedParts, setDisplayedParts] = useState<typeof allDummyParts>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false); // For initial load and filtering
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [allPartsLoaded, setAllPartsLoaded] = useState(false);

	const getFilteredParts = useCallback(() => {
		let partsToFilter = allDummyParts;
		if (search) {
			partsToFilter = partsToFilter.filter(part =>
				part.name.toLowerCase().includes(search.toLowerCase()) ||
				part.type.toLowerCase().includes(search.toLowerCase()) ||
				part.location.toLowerCase().includes(search.toLowerCase())
			);
		}
		if (partsType !== 'All') {
			partsToFilter = partsToFilter.filter(part => part.type === partsType);
		}
		return partsToFilter;
	}, [search, partsType]);


	const loadParts = useCallback((page: number, reloading = false) => {
		if (reloading) {
			setIsLoading(true);
			setAllPartsLoaded(false);
		} else {
			setIsLoadingMore(true);
		}

		const sourceParts = getFilteredParts();
		const newParts = sourceParts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

		setTimeout(() => { // Simulate network delay
			if (newParts.length === 0 || sourceParts.length <= (page + 1) * ITEMS_PER_PAGE) {
				setAllPartsLoaded(true);
			}
			setDisplayedParts(prevParts => reloading ? newParts : [...prevParts, ...newParts]);
			setCurrentPage(page + 1);
			if (reloading) setIsLoading(false);
			setIsLoadingMore(false);
		}, 1000);
	}, [getFilteredParts]);

	useEffect(() => {
		// Initial load or when filters change
		setCurrentPage(0); // Reset page
		setDisplayedParts([]); // Clear current parts
		loadParts(0, true); // Load first page, indicate it's a reload
	}, [search, partsType, loadParts]); // loadParts is memoized with getFilteredParts, which depends on search & partsType

	const handleLoadMore = () => {
		if (!isLoadingMore && !allPartsLoaded && !isLoading) { // ensure not already loading, all loaded, or initial loading
			loadParts(currentPage);
		}
	};

	const handlePartsTypeChange = (type: string) => {
		setPartsType(type);
		// Data will reload via useEffect
	};

	const handleSearchChange = (text: string) => {
		setSearch(text);
		// Data will reload via useEffect
	};

	const renderFooter = () => {
		if (!isLoadingMore) return null;
		return (
			<View className="p-4 items-center">
				<ActivityIndicator size="small" color="#F59E0B" />
			</View>
		);
	};

	if (isLoading && displayedParts.length === 0) { // Show full screen loader only on initial hard load
		return (
			<LinearGradient colors={['#1F2937', '#4B5563']} className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#F59E0B" />
				<Text className="text-white mt-2">Loading Parts...</Text>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={['#1F2937', '#4B5563']}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={{ flex: 1 }}
		>
			<SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
				{/* Fixed search and dropdowns */}
				<View>
					<GlassySearchBar value={search} onChangeText={handleSearchChange} />
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ // Kept as a style object prop
							flexDirection: 'row', // NativeWind: flex-row
							alignItems: 'center', // NativeWind: items-center
							gap: 8,               // NativeWind: gap-2 (8px). Kept as number for directness in style object.
							paddingVertical: 2,   // NativeWind: py-0.5 (2px)
							paddingHorizontal: 8, // NativeWind: px-2 (8px)
						}}
						className="grow-0 overflow-visible mb-3" // NativeWind for ScrollView's own layout style
					>
						<View className="overflow-visible"> {/* NativeWind for inner View */}
							<PartsTypeOption value={partsType} onChange={handlePartsTypeChange} />
						</View>
					</ScrollView>
				</View>
				{/* Scrollable parts cards */}
				<FlatList
					data={displayedParts}
					keyExtractor={item => item.id}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 24 }}
					columnWrapperStyle={{ justifyContent: 'space-between' }}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => router.push({ pathname: "/buyDetial/partDetail", params: { partId: item.id, partName: item.name, partPrice: item.price, partType: item.type, partImageKey: item.imageKey, partLocation: item.location }})}>
							<PartsCard
								id={item.id}
								name={item.name}
								price={item.price}
								type={item.type}
								imageKey={item.imageKey as keyof typeof carImages}
								location={item.location}
							/>
						</TouchableOpacity>
					)}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5} // Load more when 50% of the screen height from the bottom is reached
					ListFooterComponent={renderFooter}
					ListEmptyComponent={() => (
						!isLoading && ( // Only show if not initial loading
							<View className="flex-1 justify-center items-center mt-10 p-5">
								<Text className="text-gray-300 text-lg text-center">
									No parts found matching your criteria.
								</Text>
								<Text className="text-gray-400 text-sm text-center mt-1">
									Try adjusting your search or filters.
								</Text>
							</View>
						)
					)}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
};

// const styles = StyleSheet.create({}); // Removed empty StyleSheet

export default Sermon;
