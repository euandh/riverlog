import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';

// Next.js 15 requires searchParams to be a Promise, just like regular params
export default async function RiversIndex({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Unwrap the search parameters to see if a region was clicked
  const resolvedParams = await searchParams;
  const selectedRegion = resolvedParams.region;

  // Fetch all rivers
  const rivers = await pb.collection('rivers').getFullList({
    sort: 'region,name',
  });

  // Extract a unique list of regions (so we don't get 5 "Devon" buttons)
  const uniqueRegions = Array.from(new Set(rivers.map((r) => r.region)));

  // Filter the rivers array if a specific region was clicked
  const displayedRivers = selectedRegion
    ? rivers.filter((r) => r.region === selectedRegion)
    : rivers;

  return (
    <main className="p-8 font-sans max-w-4xl mx-auto">
      <PageHeader
        title="All Rivers"
        subtitle="Select a river to view its sections and trip reports."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rivers' }
        ]}
      />

      {/* The Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-8 mb-6 pb-6">
        {/* The "All Regions" reset button */}
        <Link href="/rivers">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedRegion 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Regions
          </button>
        </Link>
        
        {/* Dynamically create a button for every region in your database */}
        {uniqueRegions.map((region) => (
          <Link href={`/rivers?region=${encodeURIComponent(region)}`} key={region}>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === region 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          </Link>
        ))}
      </div>

      {/* Display only the filtered rivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedRivers.length === 0 ? (
          <p className="text-gray-600">No rivers found for this region.</p>
        ) : (
          displayedRivers.map((river) => (
            <Link href={`/rivers/${river.slug}`} key={river.id}>
              <div className="border border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{river.name}</h2>
                <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
                  {river.region}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}