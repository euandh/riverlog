'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Link from 'next/link';

// 1. THE CAMERA OPERATOR
function MapController({ coords, zoom }: { coords: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [coords, zoom, map]);
  return null;
}

// 2. THE MAP COMPONENT
export default function HomeMap({ 
  rivers, 
  targetCoords, 
  targetZoom 
}: { 
  rivers: any[], 
  targetCoords: [number, number], 
  targetZoom: number 
}) {
  return (
    <div className="w-full h-full z-0 relative leaflet-custom-pins">
      <MapContainer 
        center={targetCoords} 
        zoom={targetZoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController coords={targetCoords} zoom={targetZoom} />
        
        {rivers?.map((river) => (
          river.latitude && river.longitude ? (
            <Marker key={river.id} position={[river.latitude, river.longitude]}>
              <Popup>
                <div className="flex flex-col gap-2 min-w-[150px] pb-1">
                  <div className="font-bold text-lg text-gray-900 border-b border-gray-200 pb-1">
                    {river.name}
                  </div>
                  {/* --- NOW USING SLUG FOR THE ROUTE --- */}
                  <Link 
                    href={`/rivers/${river.slug}`} 
                    className="mt-1 block w-full bg-blue-600 text-white! text-center py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Sections
                  </Link>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}