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
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8">
        <HomeClientLayout rivers={riversData} />
      </main>

      {/* FOOTER: Removed 'border-t border-gray-200' for a seamless, floating look */}
      <footer className="w-full py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-sm text-gray-500">
          <address className="not-italic flex flex-wrap justify-center sm:justify-start items-center gap-3">
            <span>Author: Euan D-H</span>
            <span className="hidden sm:inline text-gray-300">|</span> 
            <a 
              href="mailto:euan@riverlog.uk" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
            >
              euan@riverlog.uk
            </a>
          </address>
        </div>
      </footer>

    </div>
  );
}