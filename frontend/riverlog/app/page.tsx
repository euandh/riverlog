'use client';

import { useState } from 'react';

function HomeClientWrapper({ rivers }: { rivers: any[] }) {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* LEFT COLUMN: The Map */}
      <div className="order-2 lg:order-1 sticky top-8">
        <DynamicMap 
          targetCoords={activeRegion.coords as [number, number]} 
          targetZoom={activeRegion.zoom} 
          rivers={rivers} // Pass the PocketBase data down!
        />
      </div>

      {/* RIGHT COLUMN: The Content */}
      <div className="order-1 lg:order-2 flex flex-col gap-8 pt-4">
        <div>
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-4">River Log</h1>
          <p className="text-xl text-gray-600">
            The community hub for whitewater conditions. Check the latest descents, log your runs, and see what is flowing right now.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/rivers" className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-lg py-4 px-6 rounded text-center transition-colors">
            All Rivers
          </Link>
          <Link href="/recent" className="flex-1 border-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg py-4 px-6 rounded text-center transition-colors">
            Recent Logs
          </Link>
        </div>

        {/* Region Filter */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter by region</h2>
          <div className="grid grid-cols-2 gap-3">
            {REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region)}
                className={`py-3 px-4 rounded-md text-left font-semibold transition-all ${
                  activeRegion.id === region.id 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';
import Link from 'next/link';
// Import your PocketBase setup (adjust the path to wherever your pb instance lives)
import pb from '@/lib/pocketbase'; 

// Dynamically import the map
const DynamicMap = dynamic(() => import('@/components/HomeMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

const REGIONS = [
  { id: 'uk_all', name: 'All UK', coords: [54.5, -4.0], zoom: 6 },
  { id: 'scotland', name: 'Scottish Highlands', coords: [57.1, -4.7], zoom: 8 },
  { id: 'wales', name: 'North Wales', coords: [53.0, -3.9], zoom: 9 },
  { id: 'south_west', name: 'South West', coords: [50.5, -3.9], zoom: 9 },
];

// 1. Fetch function to grab all rivers from PocketBase
async function getRivers() {
  try {
    // We only need the id, name, and coordinates for the map to keep it fast
    const records = await pb.collection('rivers').getFullList({
      fields: 'id,name,latitude,longitude',
      sort: 'name',
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch rivers for map:", error);
    return [];
  }
}

// 2. Make the page async
export default async function HomePage() {
  // 3. Await the data
  const riversData = await getRivers();

  // *We need a separate Client Component wrapper to handle the region state, 
  // because the main page is now a Server Component.*
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <HomeClientWrapper rivers={riversData} />
    </div>
  );
}