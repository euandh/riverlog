'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function HomeMap({ rivers }: { rivers: any[] }) {
  return (
    // We add the leaflet-custom-pins class here to trigger your CSS hack
    <div className="w-full h-[500px] z-0 relative rounded-lg overflow-hidden shadow-md leaflet-custom-pins">
      <MapContainer 
        center={[54.5, -4.0]} 
        zoom={6} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Plot the PocketBase data! */}
        {rivers?.map((river) => (
          river.latitude && river.longitude ? (
            <Marker key={river.id} position={[river.latitude, river.longitude]}>
              <Popup>
                <div className="font-bold text-lg">{river.name}</div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}