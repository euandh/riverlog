import TripReportCard from '@/components/TripReportCard';
import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; sectionSlug: string }>;
  searchParams: Promise<{[key: string]: string | undefined}>;
}) {
  // Unwrap the URL parameters
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const riverSlug = resolvedParams.slug; // "dart"
  const sectionSlug = resolvedParams.sectionSlug; // "loop"

  // Check URL to see if there's a filter active
  const sortParam = resolvedSearchParams.sort;
  const isAscending = resolvedSearchParams.sort === 'asc';
  const minLevel = resolvedSearchParams.min;
  const maxLevel = resolvedSearchParams.max;

  // minus sign =  "high to low", no minus sign = "low to high"
  const dbSortString = isAscending ? 'water_level': "-water_level";

  // Fetch the overarching river first so we can use its ID
  const river = await pb.collection('rivers').getFirstListItem(`slug="${riverSlug}"`).catch(() => null);

  // Move to 404 page if the river doesn't exist.
  if (!river){
    return notFound();
  }

  // Fetch the exact section, making sure it belongs to that specific river
  const section = await pb.collection('sections').getFirstListItem(
    `slug="${sectionSlug}" && river="${river.id}"`
  ).catch(() => null);

  // Move to 404 page if the section doesn't exist.
  if (!section){
    return notFound();
  }

  let filterString = `section = "${section.id}"`;
  
  if (minLevel) {
    filterString += ` && water_level >= ${minLevel}`;
  }
  if (maxLevel) {
    filterString += ` && water_level <= ${maxLevel}`;
  }

  // Fetch the notes for this section, sorted by highest water level first!
  const notes = await pb.collection('notes').getFullList({
    filter: filterString, // <-- Feed it your dynamically built variable!
    expand: 'section',
    sort: dbSortString, 
  }).catch(() => []);

  // Helper variables to preserve URL state across clicks
  const minParamString = minLevel ? `&min=${minLevel}` : '';
  const maxParamString = maxLevel ? `&max=${maxLevel}` : '';
  const currentSortString = sortParam ? `?sort=${sortParam}` : '';

  return (
    <main className="p-8 font-sans">
      <PageHeader 
        title ={section.name}
        subtitle={`Grade: ${section.grade}`}
        breadcrumbs={[
          { label: 'Home', href: '/'},
          { label: 'Rivers', href: '/rivers' },
          { label: river.name, href: `/rivers/${riverSlug}` },
          { label: section.name } 
        ]}
      />

      <div dangerouslySetInnerHTML={{ __html: section.description || "" }}>
      </div>

      <br></br>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 mb-6 mt-8 gap-4">
        <h2 className="text-2xl font-semibold">Trip Reports</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          
          {/* THE PRICE-STYLE FILTER FORM */}
          <form method="GET" className="flex items-center gap-2 text-sm">
            {/* This hidden input ensures we don't lose our 'sort' state when we filter! */}
            {sortParam && <input type="hidden" name="sort" value={sortParam} />}
            
            <input 
              type="number" 
              step="0.01" 
              name="min" 
              placeholder="Min" 
              defaultValue={minLevel}
              className="border border-gray-300 rounded px-3 py-1.5 w-20 focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="number" 
              step="0.01" 
              name="max" 
              placeholder="Max" 
              defaultValue={maxLevel}
              className="border border-gray-300 rounded px-3 py-1.5 w-20 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              className="bg-gray-800 text-white px-3 py-1.5 rounded font-medium hover:bg-gray-700 transition-colors"
            >
              Filter
            </button>

            {/* If a filter is active, show a subtle Clear button */}
            {(minLevel || maxLevel) && (
              <Link href={`/rivers/${riverSlug}/${sectionSlug}${currentSortString}`}>
                <span className="text-gray-500 hover:text-red-600 px-2 py-1 underline cursor-pointer">
                  Clear
                </span>
              </Link>
            )}
          </form>

          {/* Sort toggle*/}
          <Link href={`/rivers/${riverSlug}/${sectionSlug}?sort=${isAscending ? 'desc' : 'asc'}${minParamString}${maxParamString}`}>
            <button className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap">
              Sorted by Level ({isAscending ? 'Low to High' : 'High to Low'}) ⇄
            </button>
          </Link>
        </div>
      </div>
      
      {notes.length === 0 ? (
        <p className="text-gray-600">No trip reports match this water level.</p>
      ) : (
        notes.map((note) => (
          <TripReportCard key={note.id} note={note} />
        ))
      )}
    </main>
  );
}