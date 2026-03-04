'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
}

interface Enquiry {
  id: string;
  packageId: string;
  numberOfPeople: number;
  travelDate: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface CompletedTour {
  id: string;
  packageId: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalCost: number;
  rating: number;
  review: string;
  photos: string[];
  completedAt: string;
}

interface CustomPackageRequest {
  id: string;
  basePackageId: string;
  basePackageTitle: string;
  customPlaces: string[];
  selectedFoodVarieties: string[];
  duration: number;
  numberOfPeople: number;
  budget: number;
  specialRequirements: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [completedTours, setCompletedTours] = useState<CompletedTour[]>([]);
  const [customPackages, setCustomPackages] = useState<CustomPackageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'enquiries' | 'completed' | 'custom'>('profile');

  const fetchCustomPackages = async () => {
    try {
      const customRes = await fetch('/api/custom-packages');
      const customData = await customRes.json();
      setCustomPackages(customData);
    } catch (err) {
      console.error('Failed to fetch custom packages:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check session
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (!sessionData.session) {
          router.push('/auth/login');
          return;
        }

        // Fetch profile
        const profileRes = await fetch('/api/auth/profile');
        const profileData = await profileRes.json();
        setUser(profileData);

        // Fetch enquiries
        const enquiriesRes = await fetch('/api/enquiries');
        const enquiriesData = await enquiriesRes.json();
        setEnquiries(enquiriesData);

        // Fetch completed tours
        const toursRes = await fetch('/api/completed-tours');
        const toursData = await toursRes.json();
        setCompletedTours(toursData);

        // Fetch custom package requests
        await fetchCustomPackages();
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling to refresh custom packages every 5 seconds
    const interval = setInterval(fetchCustomPackages, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/packages">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Packages</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'enquiries'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed Tours ({completedTours.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Custom Packages ({customPackages.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <p className="text-gray-900 font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                <p className="text-gray-900 font-medium">{user?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                <p className="text-gray-900 font-medium">{user?.address}</p>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Link href={`/dashboard/edit-profile`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div>
            {enquiries.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-4">No enquiries yet</p>
                <Link href="/packages">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Packages</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {enquiries.map(enquiry => (
                  <Card key={enquiry.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Package ID: {enquiry.packageId}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Travel Date: <span className="font-medium">{enquiry.travelDate}</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                          People: <span className="font-medium">{enquiry.numberOfPeople}</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-2">{enquiry.message}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            enquiry.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : enquiry.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </span>
                        <p className="text-gray-600 text-xs mt-2">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Tours Tab */}
        {activeTab === 'completed' && (
          <div>
            {completedTours.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-4">No completed tours yet</p>
                <Link href="/packages">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Packages</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedTours.map(tour => (
                  <Card key={tour.id} className="p-6">
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">{tour.packageTitle}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600 text-sm">Travel Dates</p>
                            <p className="font-medium text-gray-900">
                              {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Participants</p>
                            <p className="font-medium text-gray-900">{tour.numberOfPeople} people</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Total Cost</p>
                            <p className="font-bold text-blue-600 text-lg">${tour.totalCost}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Rating</p>
                            <p className="font-medium text-amber-500">
                              {'⭐'.repeat(Math.round(tour.rating))} {tour.rating}/5
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-2">Your Review</p>
                          <p className="text-gray-800 italic">&quot;{tour.review}&quot;</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                        <p className="text-gray-600 text-xs mt-3">
                          {new Date(tour.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Packages Tab */}
        {activeTab === 'custom' && (
          <div>
            {customPackages.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-4">No custom package requests yet</p>
                <Link href="/packages">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Packages</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {customPackages.map(customPkg => (
                  <Card key={customPkg.id} className="p-6 flex gap-6">
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={`https://picsum.photos/200/200?random=${customPkg.id.charCodeAt(0)}`}
                        alt={customPkg.basePackageTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Package';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-6 mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{customPkg.basePackageTitle}</h3>
                          <p className="text-sm text-gray-600">Custom Package Request</p>
                        </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          customPkg.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : customPkg.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customPkg.status.charAt(0).toUpperCase() + customPkg.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Duration</p>
                        <p className="font-medium text-gray-900">{customPkg.duration} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Participants</p>
                        <p className="font-medium text-gray-900">{customPkg.numberOfPeople} people</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Budget</p>
                        <p className="font-bold text-blue-600">₹{customPkg.budget.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Requested On</p>
                        <p className="font-medium text-gray-900">
                          {new Date(customPkg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Custom Places:</p>
                      <div className="flex flex-wrap gap-2">
                        {customPkg.customPlaces.map((place, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            📍 {place}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Selected Food Varieties:</p>
                      <div className="flex flex-wrap gap-2">
                        {customPkg.selectedFoodVarieties.map((food, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                          >
                            🍽️ {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    {customPkg.specialRequirements && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Special Requirements:</p>
                        <p className="text-gray-600 text-sm">{customPkg.specialRequirements}</p>
                      </div>
                    )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
