// Notice: NO 'use client' here! This is a Server Component.
import pb from '@/lib/pocketbase';
import MapWrapper from '@/components/MapWrapper';

async function getRivers() {
  try {
    const records = await pb.collection('rivers').getFullList({
      fields: 'id,name,latitude,longitude',
      sort: 'name',
      // This stops the 429 Too Many Requests error!
      fetch: (url, config) => fetch(url, { ...config, next: { revalidate: 0 } })
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch rivers:", error);
    return [];
  }
}

export default async function HomePage() {
  const riversData = await getRivers();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">River Map</h1>
      
      {/* Pass the data to our safe wrapper */}
      <MapWrapper rivers={riversData} />
      
    </div>
  );
}