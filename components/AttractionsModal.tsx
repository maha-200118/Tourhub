'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Attraction } from '@/lib/attractions';

interface AttractionsModalProps {
  countryName: string;
  attractions: Attraction[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAttractions?: (attractions: Attraction[]) => void;
}

export default function AttractionsModal({
  countryName,
  attractions,
  isOpen,
  onClose,
  onSelectAttractions,
}: AttractionsModalProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(
    attractions.length > 0 ? attractions[0] : null
  );
  const [selectedAttractions, setSelectedAttractions] = useState<Set<string>>(new Set());

  const handleSelectAttraction = (attractionId: string) => {
    setSelectedAttractions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attractionId)) {
        newSet.delete(attractionId);
      } else {
        newSet.add(attractionId);
      }
      return newSet;
    });
  };

  const handleAddToCustom = () => {
    if (onSelectAttractions && selectedAttractions.size > 0) {
      const selected = attractions.filter(a => selectedAttractions.has(a.id));
      onSelectAttractions(selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Famous Spots in {countryName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {attractions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No famous attractions available for this country yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Attractions List */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-gray-900 mb-4">Popular Attractions</h3>
                <div className="space-y-2">
                  {attractions.map(attraction => (
                    <div key={attraction.id} className="space-y-1">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                        <input
                          type="checkbox"
                          id={attraction.id}
                          checked={selectedAttractions.has(attraction.id)}
                          onChange={() => handleSelectAttraction(attraction.id)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                        <button
                          onClick={() => setSelectedAttraction(attraction)}
                          className="flex-1 text-left"
                        >
                          <p className="font-medium text-sm text-gray-900">{attraction.name}</p>
                          <p className="text-xs text-gray-600">{attraction.category}</p>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {onSelectAttractions && (
                  <Button
                    onClick={handleAddToCustom}
                    disabled={selectedAttractions.size === 0}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
                  >
                    Add Selected to Custom Package ({selectedAttractions.size})
                  </Button>
                )}
              </div>

              {/* Right: Attraction Details */}
              {selectedAttraction && (
                <div className="lg:col-span-2">
                  <Card className="p-6 border-blue-200 bg-blue-50">
                    {/* Image Display */}
                    <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden relative group flex items-center justify-center">
                      <img
                        src={selectedAttraction.image}
                        alt={selectedAttraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-center p-4';
                            fallback.innerHTML = '<div><p class="text-4xl mb-2">📸</p><p class="text-sm font-medium">Image not available</p></div>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>

                    {/* Details */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedAttraction.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium mb-4">
                      {selectedAttraction.category}
                    </span>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {selectedAttraction.description}
                    </p>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Add to My Custom Package
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
