'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { countries } from '@/lib/countries';
import { getAttractionsByCountry, type Attraction } from '@/lib/attractions';
import PackageMap from '@/components/PackageMap';
import AttractionsModal from '@/components/AttractionsModal';

const FOOD_CUISINES = ['Indian', 'Continental', 'Italian', 'Chinese', 'Vegetarian', 'Vegan', 'Local', 'Asian Fusion', 'Mediterranean'];

interface FormData {
  selectedCountries: string[];
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  selectedFoodTypes: string[];
  specialRequirements: string;
}

export default function BuildCustomPackagePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState<FormData>({
    selectedCountries: [],
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    budget: 5000,
    selectedFoodTypes: [],
    specialRequirements: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAttractionsModal, setShowAttractionsModal] = useState(false);
  const [selectedCountryForAttractions, setSelectedCountryForAttractions] = useState<{
    name: string;
    code: string;
    attractions: Attraction[];
  } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (!sessionData.session) {
          router.push('/auth/login?redirect=/build-custom-package');
        } else {
          setSession(sessionData.session);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleCountryToggle = (countryName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCountries: prev.selectedCountries.includes(countryName)
        ? prev.selectedCountries.filter(c => c !== countryName)
        : [...prev.selectedCountries, countryName],
    }));
  };

  const handleShowAttractions = (countryName: string, countryCode: string) => {
    const countryAttractions = getAttractionsByCountry(countryCode);
    setSelectedCountryForAttractions({
      name: countryName,
      code: countryCode,
      attractions: countryAttractions,
    });
    setShowAttractionsModal(true);
  };

  const handleAddAttractionsToCustom = (selectedAttractions: Attraction[]) => {
    const attractionNames = selectedAttractions.map(a => a.name);
    setFormData(prev => ({
      ...prev,
      customPlaces: [...new Set([...prev.customPlaces, ...attractionNames])],
    }));
  };

  const handleFoodTypeToggle = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFoodTypes: prev.selectedFoodTypes.includes(cuisine)
        ? prev.selectedFoodTypes.filter(f => f !== cuisine)
        : [...prev.selectedFoodTypes, cuisine],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' || name === 'budget' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.selectedCountries.length === 0) {
      alert('Please select at least one country');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      const duration = Math.ceil(
        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const response = await fetch('/api/custom-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePackageId: 'custom-worldwide',
          basePackageTitle: `Custom Worldwide Tour - ${formData.selectedCountries.join(', ')}`,
          customPlaces: formData.selectedCountries,
          selectedFoodVarieties: formData.selectedFoodTypes,
          duration,
          numberOfPeople: formData.numberOfPeople,
          budget: formData.budget,
          specialRequirements: formData.specialRequirements,
          imageUrl: formData.imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit custom package');
      }

      setSuccessMessage('Custom package request submitted successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to submit'}`);
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountriesData = countries.filter(c =>
    formData.selectedCountries.includes(c.name)
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/packages" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Packages
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Build Your Custom Package</h1>
          <p className="text-gray-600 mt-2">
            Choose countries, dates, food preferences, and create your perfect worldwide tour
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Country Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Country Search and Selection */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Select Countries</h2>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {filteredCountries.map(country => (
                    <div key={country.code} className="group">
                      <button
                        type="button"
                        onClick={() => handleCountryToggle(country.name)}
                        className={`w-full p-3 rounded-lg text-left transition font-medium ${
                          formData.selectedCountries.includes(country.name)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-sm">{country.name}</span>
                        <span className="text-xs opacity-75 block">{country.code}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShowAttractions(country.name, country.code)}
                        className="w-full mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition font-medium"
                        title="View famous attractions"
                      >
                        View Attractions
                      </button>
                    </div>
                  ))}
                </div>

                {formData.selectedCountries.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Selected Countries:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedCountries.map(country => (
                        <span
                          key={country}
                          className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {country}
                          <button
                            type="button"
                            onClick={() => handleCountryToggle(country)}
                            className="hover:opacity-75"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Map Preview */}
              {selectedCountriesData.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Route Map</h2>
                  <PackageMap packages={selectedCountriesData} />
                </Card>
              )}

              {/* Trip Details */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Trip Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      min="1"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      min="100"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>

              {/* Food Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Food Preferences</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FOOD_CUISINES.map(cuisine => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => handleFoodTypeToggle(cuisine)}
                      className={`p-3 rounded-lg text-center transition font-medium ${
                        formData.selectedFoodTypes.includes(cuisine)
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      🍽️ {cuisine}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Special Requirements */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Special Requirements</h2>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  placeholder="Any allergies, accessibility needs, or special requests?"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Countries</p>
                    <p className="font-bold text-gray-900">{formData.selectedCountries.length}</p>
                  </div>

                  {formData.startDate && formData.endDate && (
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="font-bold text-gray-900">
                        {Math.ceil(
                          (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days
                      </p>
                    </div>
                  )}

                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Travelers</p>
                    <p className="font-bold text-gray-900">{formData.numberOfPeople}</p>
                  </div>

                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                    <p className="font-bold text-blue-600 text-lg">${formData.budget.toLocaleString()}</p>
                  </div>

                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Food Preferences</p>
                    <p className="font-bold text-gray-900">{formData.selectedFoodTypes.length} selected</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || formData.selectedCountries.length === 0}
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Custom Package Request'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Our team will review your request and contact you within 24 hours
                </p>
              </Card>
            </div>
          </div>
        </form>

        {/* Attractions Modal */}
        {selectedCountryForAttractions && (
          <AttractionsModal
            countryName={selectedCountryForAttractions.name}
            attractions={selectedCountryForAttractions.attractions}
            isOpen={showAttractionsModal}
            onClose={() => setShowAttractionsModal(false)}
            onSelectAttractions={handleAddAttractionsToCustom}
          />
        )}
      </div>
    </div>
  );
}
