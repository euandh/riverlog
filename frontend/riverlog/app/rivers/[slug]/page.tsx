import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';
import { notFound } from 'next/navigation';

export default async function RiverPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Fetch the overarching river
  const river = await pb.collection('rivers').getFirstListItem(`slug="${slug}"`).catch(() => null);;

  if (!river){
    return notFound();
  }

  // Fetch all sections that belong to this specific river
  const sections = await pb.collection('sections').getFullList({
    filter: `river = "${river.id}"`,
    sort: 'name', // Sorts sections alphabetically
  });
 

  return (
    <main className="p-8 font-sans max-w-4xl mx-auto">
      {/* header */}
      <PageHeader 
        title={river.name}
        subtitle={`Region: ${river.region}`}
        breadcrumbs={[
            { label: 'Home', href: '/'},
            { label: 'Rivers', href: '/rivers' },
            { label: river.name }
        ]}
      />

      <h2 className="text-2xl font-semibold mb-6 mt-8">River Sections</h2>
      
      {/* Display the sections as a clickable grid */}
      {sections.length === 0 ? (
        <p className="text-gray-600">No sections added to this river yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link href={`/rivers/${slug}/${section.slug}`} key={section.id}>
              <div className="border border-gray-300 rounded-lg p-5 hover:border-blue-500 hover:shadow-sm transition-all bg-white cursor-pointer h-full">
                <h3 className="text-xl font-bold text-gray-900">{section.name}</h3>
                <p className="text-gray-600 text-sm mt-1">Grade: {section.grade}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}