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
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      
      {/* Main homepage layout */}
      <div className="flex-grow">
        <HomeClientLayout rivers={riversData} />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        {/* 'not-italic' prevents the <address> tag's default slanted text */}
        <address className="not-italic">
          <p>
            Author: Euan D-H 
            <span className="mx-3 text-gray-300">|</span> 
            <a href="mailto:euan@riverlog.uk" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              euan@riverlog.uk
            </a>
          </p>
        </address>
      </footer>

    </div>
  );
}
  

