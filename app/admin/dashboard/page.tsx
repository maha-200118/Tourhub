'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}

interface CustomPackageRequest {
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
  user?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface Enquiry {
  id: string;
  userId: string;
  packageId: string;
  numberOfPeople: number;
  travelDate: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

type TabType = 'users' | 'packages' | 'enquiries';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<CustomPackageRequest[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [updatingPackageId, setUpdatingPackageId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        // Check if admin is logged in
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        // Try to fetch users (this will fail if not admin)
        const usersResponse = await fetch('/api/admin/users');
        if (!usersResponse.ok) {
          router.push('/admin/login');
          return;
        }

        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch custom packages
        const packagesResponse = await fetch('/api/admin/custom-packages');
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          setPackages(packagesData);
        }

        // Fetch enquiries
        const enquiriesResponse = await fetch('/api/admin/enquiries');
        if (enquiriesResponse.ok) {
          const enquiriesData = await enquiriesResponse.json();
          setEnquiries(enquiriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndFetchData();

    // Set up polling to refresh data every 3 seconds
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [usersRes, packagesRes, enquiriesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/custom-packages'),
        fetch('/api/admin/enquiries'),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (packagesRes.ok) setPackages(await packagesRes.json());
      if (enquiriesRes.ok) setEnquiries(await enquiriesRes.json());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (packageId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setUpdatingPackageId(packageId);
    try {
      const response = await fetch(`/api/admin/custom-packages/${packageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        setPackages(packages.map(pkg => (pkg.id === packageId ? updatedPackage : pkg)));
        setSuccessMessage(`Package ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully! User will see the update shortly.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingPackageId(null);
    }
  };

  const filteredPackages = packages.filter(
    pkg => selectedStatus === 'all' || pkg.status === selectedStatus
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage users and custom package requests</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshData}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
            >
              {refreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
            ✓ {successMessage}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'packages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Custom Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'enquiries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <Card key={user.id} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span> {user.address}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <span className="font-medium">Member since:</span>{' '}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="mb-6 flex gap-2 flex-wrap">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                  ({packages.filter(p => status === 'all' || p.status === status).length})
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredPackages.map(pkg => (
                <Card key={pkg.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pkg.basePackageTitle}</h3>
                      <p className="text-sm text-gray-600">Request ID: {pkg.id}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pkg.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : pkg.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </span>
                  </div>

                  {/* User Details */}
                  {pkg.user && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">User Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><span className="font-medium">Name:</span> {pkg.user.name}</p>
                        <p><span className="font-medium">Email:</span> {pkg.user.email}</p>
                        <p><span className="font-medium">Phone:</span> {pkg.user.phone}</p>
                        <p><span className="font-medium">Address:</span> {pkg.user.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {pkg.imageUrl && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attached Image:</p>
                      <img
                        src={pkg.imageUrl}
                        alt="Custom package"
                        className="h-40 w-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => setExpandedPackageId(
                      expandedPackageId === pkg.id ? null : pkg.id
                    )}
                    className="mb-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {expandedPackageId === pkg.id ? 'Hide Details' : 'Show Details'}
                  </button>

                  {/* Expanded Details */}
                  {expandedPackageId === pkg.id && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-2 text-sm">
                      <p><span className="font-medium">Duration:</span> {pkg.duration} days</p>
                      <p><span className="font-medium">Number of People:</span> {pkg.numberOfPeople}</p>
                      <p><span className="font-medium">Budget:</span> ${pkg.budget}</p>
                      <p>
                        <span className="font-medium">Custom Places:</span> {pkg.customPlaces.join(', ')}
                      </p>
                      <p>
                        <span className="font-medium">Food Varieties:</span> {pkg.selectedFoodVarieties.join(', ')}
                      </p>
                      <p><span className="font-medium">Special Requirements:</span> {pkg.specialRequirements || 'None'}</p>
                      <p className="text-gray-600">
                        <span className="font-medium">Requested on:</span>{' '}
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Status Update Buttons */}
                  {pkg.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusChange(pkg.id, 'approved')}
                        disabled={updatingPackageId === pkg.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400 disabled:cursor-not-allowed"
                      >
                        {updatingPackageId === pkg.id ? '⏳ Updating...' : '✓ Approve'}
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(pkg.id, 'rejected')}
                        disabled={updatingPackageId === pkg.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed"
                      >
                        {updatingPackageId === pkg.id ? '⏳ Updating...' : '✗ Reject'}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No custom packages found</p>
              </div>
            )}
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.map(enquiry => {
              const user = users.find(u => u.id === enquiry.userId);
              return (
                <Card key={enquiry.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {user?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-blue-600">{user?.email}</p>
                      <p className="text-sm text-gray-600">Phone: {user?.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      enquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : enquiry.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><span className="font-medium">Package ID:</span> {enquiry.packageId}</p>
                    <p><span className="font-medium">Number of People:</span> {enquiry.numberOfPeople}</p>
                    <p><span className="font-medium">Travel Date:</span> {new Date(enquiry.travelDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Message:</span> {enquiry.message}</p>
                    <p className="text-gray-500 text-xs">
                      <span className="font-medium">Enquired on:</span> {new Date(enquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
            {enquiries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No enquiries found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
