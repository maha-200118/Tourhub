'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FoodVariety {
  id: string;
  name: string;
  cuisine: string;
  description: string;
}

interface CustomizationFormProps {
  packageId: string;
  packageTitle: string;
  foodVarieties: FoodVariety[];
  onSubmit: (data: CustomizationData) => Promise<void>;
  isLoading?: boolean;
}

export interface CustomizationData {
  customPlaces: string[];
  selectedFoodVarieties: string[];
  duration: number;
  numberOfPeople: number;
  budget: number;
  specialRequirements: string;
  imageUrl?: string;
}

export default function CustomizationForm({
  packageId,
  packageTitle,
  foodVarieties,
  onSubmit,
  isLoading = false,
}: CustomizationFormProps) {
  const [customPlaces, setCustomPlaces] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(5);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [budget, setBudget] = useState<number>(1000);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFoodToggle = (foodId: string) => {
    setSelectedFoods(prev =>
      prev.includes(foodId)
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const places = customPlaces
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (places.length === 0) {
      alert('Please add at least one custom place');
      return;
    }

    if (selectedFoods.length === 0) {
      alert('Please select at least one food variety');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customPlaces: places,
        selectedFoodVarieties: selectedFoods,
        duration,
        numberOfPeople,
        budget,
        specialRequirements,
        imageUrl: imageUrl || undefined,
      });
      
      setSuccessMessage('Custom package request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setCustomPlaces('');
      setSelectedFoods([]);
      setDuration(5);
      setNumberOfPeople(2);
      setBudget(1000);
      setSpecialRequirements('');
      setImageUrl('');
      setImagePreview('');
    } catch (error) {
      console.error('Failed to submit custom package:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Package</h3>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Custom Places */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Custom Places (comma-separated)
          </label>
          <textarea
            value={customPlaces}
            onChange={(e) => setCustomPlaces(e.target.value)}
            placeholder="e.g., Lake District, Edinburgh Castle, Loch Ness"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <p className="text-xs text-gray-600 mt-1">Separate multiple places with commas</p>
        </div>

        {/* Food Varieties */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Food Varieties
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {foodVarieties.map(food => (
              <label
                key={food.id}
                className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedFoods.includes(food.id)}
                  onChange={() => handleFoodToggle(food.id)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{food.name}</p>
                  <p className="text-xs text-gray-600">{food.description}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {food.cuisine}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of People
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Budget ($)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Package Image (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium mb-1">📷 Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Special Requirements (Optional)
          </label>
          <textarea
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="e.g., Need accommodations for elderly people, allergies, accessibility needs, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
        >
          {isSubmitting || isLoading ? 'Submitting...' : 'Request Custom Package'}
        </Button>
      </form>
    </Card>
  );
}
