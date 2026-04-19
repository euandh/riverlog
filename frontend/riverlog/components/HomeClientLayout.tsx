'use client';

import { useState } from 'react';
import Link from 'next/link';
import MapWrapper from './MapWrapper';
import { UK_REGIONS } from '@/lib/constants';

export default function HomeClientLayout({ rivers }: { rivers: any[] }) {
  // STATE: Track which region is currently selected. Defaults to "All UK".
  const [activeRegion, setActiveRegion] = useState(UK_REGIONS[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      
      {/* === LEFT COLUMN: THE MAP === */}
      <div className="order-2 lg:order-1 lg:sticky lg:top-8 rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="h-[500px] lg:h-[700px] w-full relative z-0">
          <MapWrapper 
            rivers={rivers} 
            // Feed the active state directly into the map!
            targetCoords={activeRegion.coords as [number, number]} 
            targetZoom={activeRegion.zoom} 
          />
        </div>
      </div>

      {/* === RIGHT COLUMN: THE CONTENT === */}
      <div className="order-1 lg:order-2 flex flex-col gap-8 pt-4 lg:pt-12">
        
        <div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 tracking-tight mb-4">
            Euan's River Log
          </h1>
          <p className="text-xl text-gray-600">
            These are my notes from the river, and hopefully they'll be helpful for you. This is not meant to serve as a replacement for a guidebook!
          </p>
          <br></br>
          <p className="text-xl text-gray-600">
            To get started, either choose a river from the map, or have a look through the list of "all rivers".
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/rivers" className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg py-3 px-6 rounded text-center transition-colors">
            All Rivers
          </Link>
          <Link href="/recent" className="flex-1 border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-lg py-3 px-6 rounded text-center transition-colors">
            Recent Logs
          </Link>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter by region</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UK_REGIONS.map((region) => (
              <button 
                key={region.id}
                // UPDATE STATE WHEN CLICKED
                onClick={() => setActiveRegion(region)}
                className={`py-3 px-4 rounded-md text-left font-medium transition-all text-sm ${
                  activeRegion.id === region.id 
                    ? 'bg-gray-900 text-white shadow-md border border-gray-900' 
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