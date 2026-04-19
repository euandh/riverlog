import pb from '@/lib/pocketbase';
import HomeClientLayout from '@/components/HomeClientLayout';

async function getRivers() {
  try {
    const records = await pb.collection('rivers').getFullList({
      fields: 'id,slug, name,latitude,longitude',
      sort: 'name',
      fetch: (url, config) => fetch(url, { ...config, next: { revalidate: 3600 } })
    });
    
    // THE FIX: Strip away the PocketBase class wrappers so Next.js doesn't panic
    return JSON.parse(JSON.stringify(records));
    
  } catch (error) {
    console.error("Failed to fetch rivers:", error);
    return [];
  }
}

export default async function HomePage() {
  const riversData = await getRivers();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      {/* Pass the data to the interactive client layout */}
      <HomeClientLayout rivers={riversData} />
    </div>
  );
}