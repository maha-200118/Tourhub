'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PackageMap from '@/components/PackageMap';
import CustomizationForm, { CustomizationData } from '@/components/CustomizationForm';

interface FoodVariety {
  id: string;
  name: string;
  cuisine: string;
  description: string;
}

interface Package {
  id: string;
  title: string;
  description: string;
  category: 'adventure' | 'cultural' | 'vacation' | 'heritage';
  price: number;
  duration: number;
  maxParticipants: number;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  highlights: string[];
  foodVarieties: FoodVariety[];
}

const categoryColors: Record<string, string> = {
  adventure: 'bg-red-100 text-red-800',
  cultural: 'bg-purple-100 text-purple-800',
  vacation: 'bg-blue-100 text-blue-800',
  heritage: 'bg-amber-100 text-amber-800',
};

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnquiring, setIsEnquiring] = useState(false);
  const [activeTab, setActiveTab] = useState<'enquiry' | 'customize'>('enquiry');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    numberOfPeople: 1,
    travelDate: '',
    message: '',
  });
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`);
        if (!response.ok) {
          router.push('/packages');
          return;
        }
        const data = await response.json();
        setPkg(data);
      } catch (err) {
        console.error('Failed to fetch package:', err);
        router.push('/packages');
      } finally {
        setIsLoading(false);
      }
    };

    if (packageId) {
      fetchPackage();
    }
  }, [packageId, router]);

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnquiryError('');
    setEnquiryMessage('');
    setIsEnquiring(true);

    try {
      // Check if user is logged in
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (!sessionData.session) {
        router.push(`/auth/login?redirect=/packages/${packageId}`);
        return;
      }

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          numberOfPeople: parseInt(enquiryData.numberOfPeople),
          travelDate: enquiryData.travelDate,
          message: enquiryData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEnquiryError(data.error || 'Failed to submit enquiry');
        return;
      }

      setEnquiryMessage('Enquiry submitted successfully! We will contact you soon.');
      setEnquiryData({ numberOfPeople: 1, travelDate: '', message: '' });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setEnquiryError('An error occurred. Please try again.');
      console.error('Enquiry error:', err);
    } finally {
      setIsEnquiring(false);
    }
  };

  const handleCustomizationSubmit = async (data: CustomizationData) => {
    try {
      // Check if user is logged in
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (!sessionData.session) {
        router.push(`/auth/login?redirect=/packages/${packageId}`);
        return;
      }

      const response = await fetch('/api/custom-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePackageId: packageId,
          basePackageTitle: pkg?.title,
          customPlaces: data.customPlaces,
          selectedFoodVarieties: data.selectedFoodVarieties,
          duration: data.duration,
          numberOfPeople: data.numberOfPeople,
          budget: data.budget,
          specialRequirements: data.specialRequirements,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit custom package request');
      }

      alert('Custom package request submitted successfully! Check your dashboard for updates.');
      router.push('/dashboard');
    } catch (err) {
      console.error('Customization error:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading package details...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Package not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/packages" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Back to Packages
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{pkg.title}</h1>
          <p className="text-gray-600 text-sm mt-1">{pkg.location}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2">
            {/* Package Image */}
            <Card className="mb-6 overflow-hidden">
              <div className="h-96 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.className = 'h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-center p-4';
                      const fallback = document.createElement('div');
                      fallback.innerHTML = `<div><h2 class="font-bold text-3xl mb-4">${pkg.category.toUpperCase()}</h2><p class="text-xl">${pkg.title}</p></div>`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Package</h2>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </Card>

            {/* Details Grid */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Package Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-xl font-bold text-gray-900">{pkg.duration} Days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price per Person</p>
                  <p className="text-xl font-bold text-blue-600">₹{pkg.price.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{pkg.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Max Participants</p>
                  <p className="text-xl font-bold text-gray-900">{pkg.maxParticipants}</p>
                </div>
              </div>
            </Card>

            {/* Highlights */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Package Highlights</h2>
              <div className="grid grid-cols-2 gap-4">
                {pkg.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg mt-1">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Food Varieties */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Food Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.foodVarieties.map((food) => (
                  <div key={food.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{food.name}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                        {food.cuisine}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{food.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Destination Map</h2>
              <PackageMap packages={[pkg]} selectedPackageId={pkg.id} />
            </Card>
          </div>

          {/* Right Column - Enquiry Form & Customization */}
          <div>
            <Card className="p-6 sticky top-8">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('enquiry')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'enquiry'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Standard Enquiry
                </button>
                <button
                  onClick={() => setActiveTab('customize')}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === 'customize'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Custom Package
                </button>
              </div>

              {activeTab === 'enquiry' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send Enquiry</h2>

              {enquiryMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {enquiryMessage}
                </div>
              )}

              {enquiryError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {enquiryError}
                </div>
              )}

              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={enquiryData.numberOfPeople}
                    onChange={handleEnquiryChange}
                    min="1"
                    max={pkg.maxParticipants}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-1">Max: {pkg.maxParticipants} people</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={enquiryData.travelDate}
                    onChange={handleEnquiryChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={enquiryData.message}
                    onChange={handleEnquiryChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your preferences, special requirements, etc."
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    disabled={isEnquiring}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
                  >
                    {isEnquiring ? 'Submitting...' : 'Submit Enquiry'}
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Need to login? <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
                  </p>
                </div>
              </form>

                  {/* Price Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Estimated Cost for {enquiryData.numberOfPeople || 1} person(s):</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{(pkg.price * (parseInt(enquiryData.numberOfPeople) || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'customize' && (
                <CustomizationForm
                  packageId={packageId}
                  packageTitle={pkg.title}
                  foodVarieties={pkg.foodVarieties}
                  onSubmit={handleCustomizationSubmit}
                  isLoading={isCustomizing}
                />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
