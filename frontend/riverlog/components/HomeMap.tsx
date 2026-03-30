'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- THE LEAFLET PIN FIX ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Delete the default broken icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Manually wire up the correct paths
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});
// ---------------------------

// The Camera Operator
function MapController({ targetCoords, targetZoom }: { targetCoords: [number, number], targetZoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(targetCoords, targetZoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [targetCoords, targetZoom, map]);
  return null;
}

// Define the shape of our River data coming from PocketBase
type RiverMapData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export default function HomeMap({ 
  targetCoords, 
  targetZoom,
  rivers 
}: { 
  targetCoords: [number, number], 
  targetZoom: number,
  rivers: RiverMapData[]
}) {
  return (
    <div className="w-full h-[500px] lg:h-[700px] z-0 relative rounded-lg overflow-hidden shadow-md">
      <MapContainer center={targetCoords} zoom={targetZoom} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController targetCoords={targetCoords} targetZoom={targetZoom} />

        {/* DYNAMICALLY MAP OVER POCKETBASE DATA */}
        {rivers.map((river) => (
          // Make sure latitude and longitude exist before trying to plot!
          river.latitude && river.longitude ? (
            <Marker key={river.id} position={[river.latitude, river.longitude]}>
              <Popup>
                <div className="font-bold text-lg">{river.name}</div>
                <a href={`/rivers/${river.id}`} className="text-blue-600 hover:underline text-sm">
                  View Sections &rarr;
                </a>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}