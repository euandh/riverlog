import pb from '@/lib/pocketbase';
import HomeClientLayout from '@/components/HomeClientLayout';

async function getRivers() {
  try {
    const records = await pb.collection('rivers').getFullList({
      fields: 'id,slug,name,latitude,longitude',
      sort: 'name',
      fetch: (url, config) => fetch(url, { ...config, next: { revalidate: 3600 } })
    });
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
      
      <div className="flex-grow">
        <HomeClientLayout rivers={riversData} />
      </div>

      {/* Footer */}
      <footer className="w-full py-8 mt-12 text-left text-gray-500 text-sm">
        <address className="not-italic flex flex-row justify-start items-center gap-3">
          <span>Author: Euan D-H</span>
          <span className="text-gray-300">|</span> 
          <a 
            href="mailto:euan@riverlog.uk" 
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
          >
            euan@riverlog.uk
          </a>
        </address>
      </footer>

    </div>
  );
}