'use client';

import dynamic from 'next/dynamic';

// We do the dynamic import HERE, inside a 'use client' file.
const DynamicMap = dynamic(() => import('./HomeMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export default function MapWrapper({ rivers }: { rivers: any[] }) {
  return <DynamicMap rivers={rivers} />;
}