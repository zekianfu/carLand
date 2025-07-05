import { Car, CarFilters } from '../types'; // Adjust path as necessary
import { Timestamp } from '../utils/timestamp'; // Mock Timestamp

export const mockCars: Car[] = [
  {
    id: 'car1',
    userId: 'user1', // Alice
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 18000,
    description: 'Reliable and fuel-efficient. Low mileage, great condition.',
    imageUrl: 'https://example.com/civic.jpg', // Replace with actual or placeholder image URL
    images: ['https://example.com/civic1.jpg', 'https://example.com/civic2.jpg'],
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 25000,
    engineSize: '1.8L',
    color: 'Silver',
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
    postedAt: Timestamp.fromDate(new Date('2023-10-15T09:00:00Z')),
    isSold: false,
    location: 'Wonderland, CA',
    ownerName: 'Alice Wonderland', // Denormalized for convenience
    ownerProfilePic: 'https://randomuser.me/api/portraits/women/1.jpg', // Denormalized
    searchKeywords: ['honda', 'civic', 'sedan', '2020', 'silver', 'automatic', 'gasoline'],
  },
  {
    id: 'car2',
    userId: 'user3', // Charlie
    make: 'Toyota',
    model: 'Corolla',
    year: 2019,
    price: 16500,
    description: 'Perfect commuter car. Well-maintained, single owner.',
    imageUrl: 'https://example.com/corolla.jpg',
    images: ['https://example.com/corolla1.jpg'],
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 35000,
    engineSize: '1.8L',
    color: 'Blue',
    features: ['Apple CarPlay', 'Lane Assist'],
    postedAt: Timestamp.fromDate(new Date('2023-10-20T14:30:00Z')),
    isSold: false,
    location: 'Springfield, IL',
    ownerName: 'Charlie Brown',
    ownerProfilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    searchKeywords: ['toyota', 'corolla', 'sedan', '2019', 'blue', 'automatic', 'gasoline'],
  },
  {
    id: 'car3',
    userId: 'user1', // Alice
    make: 'Ford',
    model: 'Explorer',
    year: 2021,
    price: 32000,
    description: 'Spacious SUV, great for families. Top trim with all features.',
    imageUrl: 'https://example.com/explorer.jpg',
    images: ['https://example.com/explorer1.jpg', 'https://example.com/explorer2.jpg', 'https://example.com/explorer3.jpg'],
    bodyType: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 15000,
    engineSize: '2.3L Turbo',
    color: 'Black',
    features: ['Sunroof', 'Leather Seats', 'Navigation', '360 Camera'],
    postedAt: Timestamp.fromDate(new Date('2023-09-25T11:00:00Z')),
    isSold: true, // Example of a sold car
    location: 'Wonderland, CA',
    ownerName: 'Alice Wonderland',
    ownerProfilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    searchKeywords: ['ford', 'explorer', 'suv', '2021', 'black', 'automatic', 'gasoline', 'turbo'],
  },
  {
    id: 'car4',
    userId: 'user2', // Bob (though Bob is not a seller in users.ts, example)
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2018,
    price: 28000,
    description: 'Powerful truck, ready for work or play. Tow package included.',
    imageUrl: 'https://example.com/silverado.jpg',
    images: [],
    bodyType: 'Truck',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    mileage: 75000,
    engineSize: '6.6L V8',
    color: 'Red',
    features: ['Towing Package', '4x4', 'Bed Liner'],
    postedAt: Timestamp.fromDate(new Date('2023-10-01T16:00:00Z')),
    isSold: false,
    location: 'Builder City, TX',
    ownerName: 'Bob The Builder',
    ownerProfilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    searchKeywords: ['chevrolet', 'silverado', 'truck', '2018', 'red', 'automatic', 'diesel', '4x4', 'v8'],
  },
  {
    id: 'car5',
    userId: 'user3', // Charlie
    make: 'Mazda',
    model: 'CX-5',
    year: 2022,
    price: 26000,
    description: 'Stylish and fun-to-drive crossover. Excellent safety ratings.',
    imageUrl: '/assets/images/cars/cx-5.jpg', // Example using local asset if possible, otherwise use URLs
    images: ['/assets/images/cars/cx-5.jpg'],
    bodyType: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 8000,
    engineSize: '2.5L',
    color: 'Soul Red Crystal',
    features: ['Heated Seats', 'Bose Sound System', 'Blind Spot Monitoring'],
    postedAt: Timestamp.fromDate(new Date('2023-11-01T10:00:00Z')),
    isSold: false,
    location: 'Springfield, IL',
    ownerName: 'Charlie Brown',
    ownerProfilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    searchKeywords: ['mazda', 'cx-5', 'cx5', 'suv', '2022', 'red', 'automatic', 'gasoline'],
  }
];

// In-memory store for new cars added during the session
let newMockCars: Car[] = [];

export const getMockCars = (filters?: CarFilters, limit: number = 10, lastVisibleId?: string): { cars: Car[], newLastVisibleId: string | null, hasMore: boolean } => {
  let filteredCars = [...mockCars, ...newMockCars].filter(car => !car.isSold); // Start with active listings

  if (filters) {
    if (filters.bodyType) {
      filteredCars = filteredCars.filter(car => car.bodyType?.toLowerCase() === filters.bodyType?.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      filteredCars = filteredCars.filter(car => car.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredCars = filteredCars.filter(car => car.price <= filters.maxPrice!);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredCars = filteredCars.filter(car =>
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.searchKeywords?.some(keyword => keyword.includes(term))
      );
    }
    // Add more filters as needed (e.g., year, make, model specific)
  }

  // Sort by postedAt descending (newest first)
  filteredCars.sort((a, b) => (b.postedAt as Date).getTime() - (a.postedAt as Date).getTime());


  let startIndex = 0;
  if (lastVisibleId) {
    const lastIdx = filteredCars.findIndex(c => c.id === lastVisibleId);
    if (lastIdx !== -1) {
      startIndex = lastIdx + 1;
    }
  }

  const paginatedCars = filteredCars.slice(startIndex, startIndex + limit + 1); // Fetch one extra to check for more
  const hasMore = paginatedCars.length > limit;

  if (hasMore) {
    paginatedCars.pop(); // Remove the extra item
  }

  const newLastVisibleId = paginatedCars.length > 0 ? paginatedCars[paginatedCars.length - 1].id : null;

  return { cars: paginatedCars.map(c => ({...c})), newLastVisibleId, hasMore };
};

export const getMockCarById = (carId: string): Car | null => {
  const car = [...mockCars, ...newMockCars].find(c => c.id === carId);
  return car ? { ...car } : null;
};

export const addMockCar = (carData: Omit<Car, 'id' | 'postedAt' | 'searchKeywords' | 'ownerName' | 'ownerProfilePic'>, userId: string, ownerName: string, ownerProfilePic?: string ): Car => {
  const newCar: Car = {
    ...carData,
    id: `car${Date.now()}${Math.floor(Math.random() * 1000)}`,
    userId,
    ownerName,
    ownerProfilePic,
    postedAt: Timestamp.now(),
    isSold: false,
    searchKeywords: [
        carData.make.toLowerCase(),
        carData.model.toLowerCase(),
        String(carData.year),
        carData.bodyType?.toLowerCase(),
        carData.color?.toLowerCase(),
        carData.fuelType?.toLowerCase(),
        carData.transmission?.toLowerCase()
    ].filter(Boolean) as string[], // Filter out undefined/null values
    // Ensure all required fields from Car type are present
    // For example, if images is non-optional and not in carData, initialize it:
    images: carData.images || [],
  };
  newMockCars.push(newCar);
  return { ...newCar };
};

export const updateMockCar = (carId: string, data: Partial<Omit<Car, 'id' | 'postedAt' | 'userId' | 'ownerName' | 'ownerProfilePic' | 'searchKeywords'>>): Car | null => {
    const carIndex = newMockCars.findIndex(c => c.id === carId);
    if (carIndex !== -1) {
        newMockCars[carIndex] = { ...newMockCars[carIndex], ...data };
        return { ...newMockCars[carIndex] };
    }
    const existingCarIndex = mockCars.findIndex(c => c.id === carId);
    if (existingCarIndex !== -1) {
        // To avoid mutating original mockCars, you might copy it to newMockCars or handle updates differently
        // For this example, let's assume we can update it if it's not sold.
        // Or, more safely, treat mockCars as immutable and only allow updates on newMockCars.
        // For simplicity here, if it's in mockCars, we don't update it, only new cars.
        console.warn("Update operation on original mockCars is not directly supported in this simplified mock. Consider adding to newMockCars if modification is needed or implement a more robust update strategy.");
        return null;
    }
    return null;
};

export const deleteMockCar = (carId: string): boolean => {
    const initialLength = newMockCars.length;
    newMockCars = newMockCars.filter(c => c.id !== carId);
    // Deleting from original mockCars is not handled here to keep it simple.
    return newMockCars.length < initialLength;
};


export const resetNewMockCars = () => {
    newMockCars = [];
};

// Note: Ensure the Car and CarFilters types are correctly defined in `../types`.
// The Timestamp mock should be consistent with how it's used (e.g., Date object or specific structure).
// Image URLs should be replaced with actual placeholders or accessible URLs if you want them to render.
// `searchKeywords` are manually added here; in a real app, these might be generated.
// This mock service provides basic CRUD and filtering.
// For `subscribeToCars`, it returns all matching data at once, not real-time updates.
// A true subscription mock would require a more complex event emitter system.
// For now, "subscribe" functions will behave like "fetch" functions.
// The `ownerName` and `ownerProfilePic` are denormalized for easier display on car cards.
// If your Car type expects `FirebaseFirestoreTypes.Timestamp`, ensure your mock Timestamp is compatible.
// Example (if assets are in public folder for web, or handled by bundler for native):
// imageUrl: '/assets/images/cars/civic.jpg' (adjust path based on project setup)
// For native, you might use `require('../../assets/images/cars/civic.jpg')` if `imageUrl` can be a number (asset reference).
// However, the Car type likely expects string URLs. So, use placeholder URLs or actual image URLs.
// The provided `imageUrl` in `mockCars` are generic examples.
// `assets/images/cars/cx-5.jpg` in car5 is an example of a local path, assuming it can be resolved.
// If not, replace with a full URL.
// The `addMockCar` function now includes ownerName and ownerProfilePic.
// It also initializes `images` if not provided in `carData`.
// The `updateMockCar` and `deleteMockCar` currently only operate on `newMockCars`.
// Modifying the base `mockCars` array is avoided to keep the initial dataset predictable.
// If updates/deletions on the base set are needed, the logic should be adjusted (e.g., by copying base cars to a modifiable array).
// `getMockCars` now sorts by `postedAt` descending.
// Pagination logic added to `getMockCars`.
// `searchKeywords` in `addMockCar` made more robust.
// Added `resetNewMockCars` for potentially resetting session data (e.g., for tests or logout).
// `getMockCars` filters out sold cars by default.
// `updateMockCar` is very basic and mainly targets cars added during the session.
// `deleteMockCar` also targets cars added during the session.
// The functions now return copies of car objects to encourage immutability.
