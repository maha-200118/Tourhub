// In-memory database simulation
// In production, replace with a real database like PostgreSQL via Prisma or Drizzle

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface FoodVariety {
  id: string;
  name: string;
  cuisine: 'Indian' | 'Continental' | 'Italian' | 'Chinese' | 'Vegetarian' | 'Vegan' | 'Local';
  description: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  category: 'adventure' | 'cultural' | 'vacation' | 'heritage';
  price: number;
  duration: number; // days
  maxParticipants: number;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  highlights: string[];
  foodVarieties: FoodVariety[];
  createdAt: Date;
}

export interface Enquiry {
  id: string;
  userId: string;
  packageId: string;
  numberOfPeople: number;
  travelDate: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface CompletedTour {
  id: string;
  userId: string;
  packageId: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalCost: number;
  rating: number; // 1-5
  review: string;
  photos: string[];
  completedAt: Date;
}

export interface CustomPackageRequest {
  id: string;
  userId: string;
  basePackageId: string;
  basePackageTitle: string;
  customPlaces: string[];
  selectedFoodVarieties: string[];
  duration: number;
  numberOfPeople: number;
  budget: number;
  specialRequirements: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
let users: Map<string, User> = new Map();
let packages: Map<string, Package> = new Map();
let enquiries: Map<string, Enquiry> = new Map();
let completedTours: Map<string, CompletedTour> = new Map();
let customPackageRequests: Map<string, CustomPackageRequest> = new Map();

// Initialize with sample data
function initializeSampleData() {
  // Extended sample packages with 12 diverse options
  const samplePackages: Package[] = [
    {
      id: 'pkg-1',
      title: 'Himalayan Trek Adventure',
      description: 'Experience the breathtaking beauty of the Himalayas with guided trekking through mountain trails',
      category: 'adventure',
      price: 106500,
      duration: 7,
      maxParticipants: 15,
      location: 'Himachal Pradesh, India',
      latitude: 32.2396,
      longitude: 77.1808,
      image: 'https://picsum.photos/800/600?random=1',
      highlights: ['Mountain Views', 'Guided Trek', 'Local Culture', 'Camping'],
      foodVarieties: [
        { id: 'food-1', name: 'Himachali Cuisine', cuisine: 'Local', description: 'Traditional local dishes from Himachal Pradesh' },
        { id: 'food-2', name: 'Vegetarian Options', cuisine: 'Vegetarian', description: 'Fresh vegetarian meals' },
        { id: 'food-3', name: 'Continental Breakfast', cuisine: 'Continental', description: 'International breakfast options' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-2',
      title: 'European Cultural Tour',
      description: 'Explore the rich history and culture of Europe with visits to iconic landmarks and museums',
      category: 'cultural',
      price: 205000,
      duration: 14,
      maxParticipants: 20,
      location: 'Europe',
      latitude: 48.8566,
      longitude: 2.3522,
      image: 'https://picsum.photos/800/600?random=2',
      highlights: ['Museums', 'Historical Sites', 'Local Cuisine', 'City Tours'],
      foodVarieties: [
        { id: 'food-4', name: 'Italian Cuisine', cuisine: 'Italian', description: 'Authentic Italian pasta and risotto' },
        { id: 'food-5', name: 'French Delicacies', cuisine: 'Continental', description: 'Classic French dishes' },
        { id: 'food-6', name: 'Vegan Options', cuisine: 'Vegan', description: 'Plant-based European meals' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-3',
      title: 'Beach Paradise Getaway',
      description: 'Relax and enjoy pristine beaches with world-class amenities and water sports',
      category: 'vacation',
      price: 74000,
      duration: 5,
      maxParticipants: 30,
      location: 'Maldives',
      latitude: 4.1694,
      longitude: 73.5093,
      image: 'https://picsum.photos/800/600?random=3',
      highlights: ['Beach Access', 'Water Sports', 'Spa', 'Resort Stay'],
      foodVarieties: [
        { id: 'food-7', name: 'Fresh Seafood', cuisine: 'Local', description: 'Fresh catch daily from local waters' },
        { id: 'food-8', name: 'Indian Curries', cuisine: 'Indian', description: 'Spiced Indian meals' },
        { id: 'food-9', name: 'Continental Dining', cuisine: 'Continental', description: 'Fine dining experience' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-4',
      title: 'Ancient Heritage Trail',
      description: 'Discover ancient temples and monuments with expert historical guides',
      category: 'heritage',
      price: 53200,
      duration: 4,
      maxParticipants: 25,
      location: 'Rajasthan, India',
      latitude: 26.9124,
      longitude: 75.7873,
      image: 'https://picsum.photos/800/600?random=4',
      highlights: ['Ancient Temples', 'Guided Tours', 'Photography', 'Local Guides'],
      foodVarieties: [
        { id: 'food-10', name: 'Rajasthani Thali', cuisine: 'Indian', description: 'Traditional Rajasthani feast' },
        { id: 'food-11', name: 'Vegetarian Delights', cuisine: 'Vegetarian', description: 'Authentic vegetarian cuisine' },
        { id: 'food-12', name: 'Street Food Tour', cuisine: 'Local', description: 'Local street food experiences' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-5',
      title: 'Amazon Rainforest Expedition',
      description: 'Explore the world\'s largest rainforest with wildlife spotting and jungle hikes',
      category: 'adventure',
      price: 147500,
      duration: 10,
      maxParticipants: 12,
      location: 'Amazon, Brazil',
      latitude: -3.4653,
      longitude: -62.2159,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
      highlights: ['Wildlife Spotting', 'Jungle Hikes', 'Indigenous Culture', 'River Cruises'],
      foodVarieties: [
        { id: 'food-13', name: 'Brazilian Cuisine', cuisine: 'Local', description: 'Traditional Brazilian dishes' },
        { id: 'food-14', name: 'Vegetarian Jungle Food', cuisine: 'Vegetarian', description: 'Nutrient-rich vegetarian meals' },
        { id: 'food-15', name: 'Local Fish Specialties', cuisine: 'Local', description: 'Fresh river fish preparations' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-6',
      title: 'Tokyo & Kyoto Cultural Immersion',
      description: 'Immerse yourself in Japanese culture, temples, and modern city life',
      category: 'cultural',
      price: 164000,
      duration: 10,
      maxParticipants: 18,
      location: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      image: 'https://picsum.photos/800/600?random=6',
      highlights: ['Temples & Shrines', 'Tea Ceremony', 'Traditional Arts', 'Local Markets'],
      foodVarieties: [
        { id: 'food-16', name: 'Japanese Sushi', cuisine: 'Local', description: 'Fresh sushi and sashimi' },
        { id: 'food-17', name: 'Vegetarian Zen', cuisine: 'Vegetarian', description: 'Buddhists-inspired meals' },
        { id: 'food-18', name: 'Ramen & Udon', cuisine: 'Local', description: 'Traditional noodle dishes' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-7',
      title: 'Swiss Alps Hiking & Relaxation',
      description: 'Mountain hiking combined with spa relaxation in luxury resorts',
      category: 'vacation',
      price: 131200,
      duration: 8,
      maxParticipants: 16,
      location: 'Switzerland',
      latitude: 46.9479,
      longitude: 7.4474,
      image: 'https://picsum.photos/800/600?random=7',
      highlights: ['Mountain Hiking', 'Luxury Resorts', 'Alpine Views', 'Spa Treatments'],
      foodVarieties: [
        { id: 'food-19', name: 'Swiss Cheese & Fondue', cuisine: 'Continental', description: 'Classic Swiss cheese dishes' },
        { id: 'food-20', name: 'Healthy Organic', cuisine: 'Vegetarian', description: 'Farm-fresh organic food' },
        { id: 'food-21', name: 'Alpine Specialties', cuisine: 'Local', description: 'Mountain region specialties' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-8',
      title: 'Egyptian Wonders Tour',
      description: 'Visit the pyramids, temples, and sail on the Nile with historical insights',
      category: 'heritage',
      price: 110700,
      duration: 9,
      maxParticipants: 22,
      location: 'Egypt',
      latitude: 30.0444,
      longitude: 31.2357,
      image: 'https://picsum.photos/800/600?random=8',
      highlights: ['Pyramids', 'Nile Cruise', 'Ancient Temples', 'Museum Tours'],
      foodVarieties: [
        { id: 'food-22', name: 'Egyptian Mezze', cuisine: 'Indian', description: 'Traditional Middle Eastern cuisine' },
        { id: 'food-23', name: 'Nile Grilled Fish', cuisine: 'Local', description: 'Fresh fish from the Nile' },
        { id: 'food-24', name: 'Vegan Hummus', cuisine: 'Vegan', description: 'Plant-based Mediterranean meals' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-9',
      title: 'New Zealand Adventure Trail',
      description: 'Bungee jumping, skydiving, and adventure sports in scenic landscapes',
      category: 'adventure',
      price: 156000,
      duration: 12,
      maxParticipants: 14,
      location: 'New Zealand',
      latitude: -41.2865,
      longitude: 172.9988,
      image: 'https://picsum.photos/800/600?random=9',
      highlights: ['Bungee Jumping', 'Skydiving', 'Scenic Landscapes', 'Jet Boating'],
      foodVarieties: [
        { id: 'food-25', name: 'Lamb & Venison', cuisine: 'Continental', description: 'New Zealand specialty meats' },
        { id: 'food-26', name: 'Vegetarian Asian', cuisine: 'Vegetarian', description: 'Asian fusion vegetables' },
        { id: 'food-27', name: 'BBQ & Seafood', cuisine: 'Local', description: 'Local BBQ and fish' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-10',
      title: 'Mediterranean Cruise',
      description: 'Luxury cruise visiting Greece, Italy, and Spain with island stops',
      category: 'vacation',
      price: 180400,
      duration: 12,
      maxParticipants: 50,
      location: 'Mediterranean Sea',
      latitude: 38.0,
      longitude: 15.0,
      image: 'https://picsum.photos/800/600?random=10',
      highlights: ['Luxury Ship', 'Island Visits', 'Fine Dining', 'Beach Days'],
      foodVarieties: [
        { id: 'food-28', name: 'Mediterranean Fusion', cuisine: 'Continental', description: 'Blended Mediterranean cuisine' },
        { id: 'food-29', name: 'Greek & Italian', cuisine: 'Italian', description: 'Authentic Greek and Italian food' },
        { id: 'food-30', name: 'Mediterranean Vegan', cuisine: 'Vegan', description: 'Plant-based Mediterranean' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-11',
      title: 'Peru Historical Discovery',
      description: 'Trek to Machu Picchu and explore Incan heritage sites',
      category: 'heritage',
      price: 127200,
      duration: 8,
      maxParticipants: 16,
      location: 'Peru',
      latitude: -13.1631,
      longitude: -72.5450,
      image: 'https://picsum.photos/800/600?random=11',
      highlights: ['Machu Picchu', 'Incan Sites', 'Mountain Trek', 'Local Culture'],
      foodVarieties: [
        { id: 'food-31', name: 'Peruvian Ceviche', cuisine: 'Local', description: 'Fresh fish ceviche' },
        { id: 'food-32', name: 'Andean Potatoes', cuisine: 'Vegetarian', description: 'Traditional Andean vegetables' },
        { id: 'food-33', name: 'Quinoa Delight', cuisine: 'Vegan', description: 'Super grain-based meals' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'pkg-12',
      title: 'Iceland Glacier & Northern Lights',
      description: 'Explore glaciers, waterfalls, and witness the magical Northern Lights',
      category: 'adventure',
      price: 139300,
      duration: 7,
      maxParticipants: 12,
      location: 'Iceland',
      latitude: 64.9631,
      longitude: -19.0208,
      image: 'https://picsum.photos/800/600?random=12',
      highlights: ['Northern Lights', 'Glaciers', 'Waterfalls', 'Hot Springs'],
      foodVarieties: [
        { id: 'food-34', name: 'Icelandic Seafood', cuisine: 'Local', description: 'Fresh Arctic seafood' },
        { id: 'food-35', name: 'Traditional Nordic', cuisine: 'Continental', description: 'Scandinavian cuisine' },
        { id: 'food-36', name: 'Vegan Nordic', cuisine: 'Vegan', description: 'Plant-based Nordic food' },
      ],
      createdAt: new Date(),
    },
  ];

  samplePackages.forEach(pkg => {
    packages.set(pkg.id, pkg);
  });

  // Add sample completed tours
  const sampleCompletedTours: CompletedTour[] = [
    {
      id: 'tour-1',
      userId: 'user-sample',
      packageId: 'pkg-1',
      packageTitle: 'Himalayan Trek Adventure',
      startDate: '2024-05-01',
      endDate: '2024-05-08',
      numberOfPeople: 3,
      totalCost: 3897,
      rating: 5,
      review: 'Absolutely amazing experience! The guides were knowledgeable and the views were breathtaking.',
      photos: ['/images/himalayan-trek.jpg'],
      completedAt: new Date('2024-05-09'),
    },
    {
      id: 'tour-2',
      userId: 'user-sample',
      packageId: 'pkg-3',
      packageTitle: 'Beach Paradise Getaway',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      numberOfPeople: 2,
      totalCost: 1798,
      rating: 4.5,
      review: 'Perfect vacation! The beach was pristine and the resort was luxurious. Highly recommended!',
      photos: ['/images/beach-paradise.jpg'],
      completedAt: new Date('2024-06-21'),
    },
  ];

  sampleCompletedTours.forEach(tour => {
    completedTours.set(tour.id, tour);
  });
}

initializeSampleData();

// User operations
export async function createUser(email: string, password: string, name: string, phone: string, address: string): Promise<User> {
  const id = `user-${Date.now()}`;
  const user: User = {
    id,
    email,
    password, // In production, hash this with bcrypt
    name,
    phone,
    address,
    createdAt: new Date(),
  };
  users.set(email, user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.get(email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  for (const user of users.values()) {
    if (user.id === id) {
      const updated = { ...user, ...updates };
      users.set(user.email, updated);
      return updated;
    }
  }
  return null;
}

// Package operations
export async function getAllPackages(): Promise<Package[]> {
  return Array.from(packages.values());
}

export async function getPackageById(id: string): Promise<Package | null> {
  return packages.get(id) || null;
}

export async function getPackagesByCategory(category: string): Promise<Package[]> {
  return Array.from(packages.values()).filter(pkg => pkg.category === category);
}

// Enquiry operations
export async function createEnquiry(userId: string, packageId: string, numberOfPeople: number, travelDate: string, message: string): Promise<Enquiry> {
  const id = `enquiry-${Date.now()}`;
  const enquiry: Enquiry = {
    id,
    userId,
    packageId,
    numberOfPeople,
    travelDate,
    message,
    status: 'pending',
    createdAt: new Date(),
  };
  enquiries.set(id, enquiry);
  return enquiry;
}

export async function getEnquiriesByUser(userId: string): Promise<Enquiry[]> {
  return Array.from(enquiries.values()).filter(e => e.userId === userId);
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  return Array.from(enquiries.values());
}

export async function updateEnquiry(id: string, status: string): Promise<Enquiry | null> {
  const enquiry = enquiries.get(id);
  if (enquiry) {
    enquiry.status = status as 'pending' | 'confirmed' | 'cancelled';
    return enquiry;
  }
  return null;
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  return enquiries.get(id) || null;
}

// Completed tours operations
export async function createCompletedTour(
  userId: string,
  packageId: string,
  packageTitle: string,
  startDate: string,
  endDate: string,
  numberOfPeople: number,
  totalCost: number,
  rating: number,
  review: string,
  photos?: string[]
): Promise<CompletedTour> {
  const id = `tour-${Date.now()}`;
  const completedTour: CompletedTour = {
    id,
    userId,
    packageId,
    packageTitle,
    startDate,
    endDate,
    numberOfPeople,
    totalCost,
    rating,
    review,
    photos: photos || [],
    completedAt: new Date(),
  };
  completedTours.set(id, completedTour);
  return completedTour;
}

export async function getCompletedToursByUser(userId: string): Promise<CompletedTour[]> {
  return Array.from(completedTours.values()).filter(t => t.userId === userId);
}

export async function getAllCompletedTours(): Promise<CompletedTour[]> {
  return Array.from(completedTours.values());
}

// Custom package request operations
export async function createCustomPackageRequest(
  userId: string,
  basePackageId: string,
  basePackageTitle: string,
  customPlaces: string[],
  selectedFoodVarieties: string[],
  duration: number,
  numberOfPeople: number,
  budget: number,
  specialRequirements: string,
  imageUrl?: string
): Promise<CustomPackageRequest> {
  const id = `custom-${Date.now()}`;
  const request: CustomPackageRequest = {
    id,
    userId,
    basePackageId,
    basePackageTitle,
    customPlaces,
    selectedFoodVarieties,
    duration,
    numberOfPeople,
    budget,
    specialRequirements,
    imageUrl,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  customPackageRequests.set(id, request);
  return request;
}

export async function getCustomPackageRequestsByUser(userId: string): Promise<CustomPackageRequest[]> {
  return Array.from(customPackageRequests.values()).filter(r => r.userId === userId);
}

export async function getCustomPackageRequest(id: string): Promise<CustomPackageRequest | null> {
  return customPackageRequests.get(id) || null;
}

export async function updateCustomPackageRequestStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<CustomPackageRequest | null> {
  const request = customPackageRequests.get(id);
  if (request) {
    request.status = status;
    request.updatedAt = new Date();
    return request;
  }
  return null;
}

// Admin operations
export async function getAllUsers(): Promise<User[]> {
  return Array.from(users.values());
}

export async function getAllCustomPackageRequests(): Promise<CustomPackageRequest[]> {
  return Array.from(customPackageRequests.values());
}
