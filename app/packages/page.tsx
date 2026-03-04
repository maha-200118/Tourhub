'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PackageMap from '@/components/PackageMap';

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
}

const categoryColors: Record<string, string> = {
  adventure: 'bg-red-100 text-red-800',
  cultural: 'bg-purple-100 text-purple-800',
  vacation: 'bg-blue-100 text-blue-800',
  heritage: 'bg-amber-100 text-amber-800',
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        setPackages(data);
        setFilteredPackages(data);
        if (data.length > 0) {
          setSelectedPackageId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPackages(packages);
    } else {
      setFilteredPackages(packages.filter(pkg => pkg.category === selectedCategory));
    }
  }, [selectedCategory, packages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading packages...</p>
      </div>
    );
  }

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tourism Packages</h1>
            <p className="text-gray-600 text-sm mt-1">Explore our amazing travel packages</p>
          </div>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        {selectedPackage && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Package Locations</h2>
            <PackageMap packages={packages} selectedPackageId={selectedPackageId} />
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'adventure', 'cultural', 'vacation', 'heritage'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <Card
              key={pkg.id}
              className={`overflow-hidden hover:shadow-lg transition cursor-pointer border-2 ${
                selectedPackageId === pkg.id ? 'border-blue-500 shadow-lg' : 'border-transparent'
              }`}
              onClick={() => setSelectedPackageId(pkg.id)}
            >
              <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.className = 'h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-center p-4';
                      const fallback = document.createElement('div');
                      fallback.innerHTML = `<div><h3 class="font-bold text-lg">${pkg.title}</h3><p class="text-sm mt-2">${pkg.location}</p></div>`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[pkg.category]}`}>
                    {pkg.category.toUpperCase()}
                  </span>
                  <span className="text-xl font-bold text-blue-600">₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>📅 Duration: {pkg.duration} days</p>
                  <p>👥 Max People: {pkg.maxParticipants}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/packages/${pkg.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    View Details & Enquire
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No packages found in this category</p>
          </Card>
        )}
      </main>
    </div>
  );
}
