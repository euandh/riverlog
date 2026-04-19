'use client';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./HomeMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function MapWrapper({ 
  rivers, 
  targetCoords, 
  targetZoom 
}: { 
  rivers: any[], 
  targetCoords: [number, number], 
  targetZoom: number 
}) {
  return <DynamicMap rivers={rivers} targetCoords={targetCoords} targetZoom={targetZoom} />;
}