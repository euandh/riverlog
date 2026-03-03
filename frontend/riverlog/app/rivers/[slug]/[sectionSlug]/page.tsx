import PocketBase from 'pocketbase';
import TripReportCard from '@/components/TripReportCard';
import PageHeader from '@/components/PageHeader';

const pb = new PocketBase('http://127.0.0.1:8090');

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionSlug: string }>;
}) {
  // 1. Unwrap the URL parameters
  const resolvedParams = await params;
  const riverSlug = resolvedParams.slug; // "dart"
  const sectionSlug = resolvedParams.sectionSlug; // "loop"

  // 2. Fetch the overarching river first so we can use its ID
  const river = await pb.collection('rivers').getFirstListItem(`slug="${riverSlug}"`);

  // 3. Fetch the exact section, making sure it belongs to that specific river
  const section = await pb.collection('sections').getFirstListItem(
    `slug="${sectionSlug}" && river="${river.id}"`
  );

  // 4. Fetch the notes for this section, sorted by highest water level first!
  const notes = await pb.collection('notes').getFullList({
    filter: `section = "${section.id}"`,
    expand: 'section',
    sort: '-water_level', 
  });

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

      <div className="flex justify-between items-end border-b pb-2 mb-6">
        <h2 className="text-2xl font-semibold">Trip Reports</h2>
        <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
          Sorted by Level (High to Low)
        </span>
      </div>
      
      {notes.length === 0 ? (
        <p>No trip reports yet for this section.</p>
      ) : (
        notes.map((note) => (
          <TripReportCard key={note.id} note={note} />
        ))
      )}
    </main>
  );
}