'use client';

import { useEffect, useRef } from 'react';

interface Package {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  location: string;
}

interface PackageMapProps {
  packages: Package[];
  selectedPackageId?: string;
}

export default function PackageMap({ packages, selectedPackageId }: PackageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Wait for Leaflet to load
    if (!mapRef.current || typeof (window as any).L === 'undefined') {
      return;
    }

    const L = (window as any).L;

    // Initialize map with Leaflet
    if (!mapInstanceRef.current) {
      const initialLocation = packages.length > 0 
        ? [packages[0].latitude, packages[0].longitude]
        : [20, 0];

      mapInstanceRef.current = L.map(mapRef.current).setView(initialLocation, 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each package
    packages.forEach(pkg => {
      const isSelected = selectedPackageId === pkg.id;
      const bgColor = isSelected ? '#ef4444' : '#3b82f6';
      
      const markerHtml = `
        <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 9999px; background-color: ${bgColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 14px;">
          📍
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([pkg.latitude, pkg.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="font-semibold text-gray-900">${pkg.title}</div>
          <div class="text-sm text-gray-600">${pkg.location}</div>
        `)
        .addTo(mapInstanceRef.current);

      markersRef.current.push(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Fit bounds if we have multiple packages
    if (packages.length > 1) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [packages, selectedPackageId]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg border border-gray-200 shadow-sm"
      style={{ minHeight: '400px' }}
    />
  );
}
