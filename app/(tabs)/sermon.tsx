import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import PartsCard from '@/components/partsCard';
import PartsTypeOption from '@/components/partsTypeOption';
import { cars as carImages } from '@/constant/images';
import GlassySearchBar from '@/components/searchBar';

// Dummy data for parts (sermons)
const parts = [
	{
		id: '1',
		name: 'Brake Pad',
		price: '2,000',
		type: 'Brakes',
		imageKey: 'corolla',
		location: 'Addis Ababa',
	},
	{
		id: '2',
		name: 'Engine Oil',
		price: '1,000',
		type: 'Engine',
		imageKey: 'corolla',
		location: 'Adama',
	},
	{
		id: '3',
		name: 'Shock Absorber',
		price: '3,500',
		type: 'Suspension',
		imageKey: 'corolla',
		location: 'Bahir Dar',
	},
	{
		id: '4',
		name: 'Headlight',
		price: '1,800',
		type: 'Electrical',
		imageKey: 'corolla',
		location: 'Hawassa',
	},
];

const Sermon = () => {
	const [partsType, setPartsType] = useState<string>('All');
	const [search, setSearch] = useState('');

	// Filter parts by type if not "All"
	const filteredParts =
		partsType === 'All' ? parts : parts.filter(part => part.type === partsType);

	// Fix: Pass a function to onChange, not a value
	const handlePartsTypeChange = (type: string) => {
		setPartsType(type);
	};

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
					<GlassySearchBar value={search} onChangeText={setSearch} />
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
						<View style={{ overflow: 'visible' }}>
							<PartsTypeOption value={partsType} onChange={handlePartsTypeChange} />
						</View>
					</ScrollView>
				</View>
				{/* Scrollable parts cards */}
				<FlatList
					data={filteredParts}
					keyExtractor={item => item.id}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 24 }}
					columnWrapperStyle={{ justifyContent: 'space-between' }}
					renderItem={({ item }) => (
						<PartsCard
							id={item.id}
							name={item.name}
							price={item.price}
							type={item.type}
							imageKey={item.imageKey as keyof typeof carImages}
							location={item.location}
						/>
					)}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({});

export default Sermon;
