import pb from '@/lib/pocketbase';
import Link from 'next/link';
import TripReportCard from '@/components/TripReportCard'; // Ensure this path matches your setup!

async function getRecentNotes() {
  try {
    const records = await pb.collection('notes').getList(1, 50, {
      sort: '-date', // Sorting by your custom 'date' field instead of created
      expand: 'section.river', // Deep expand to get River data for the titles
      fetch: (url, config) => fetch(url, { ...config, next: { revalidate: 60 } }) 
    });
    
    return JSON.parse(JSON.stringify(records.items));
  } catch (error) {
    console.error("Failed to fetch recent notes:", error);
    return [];
  }
}

export default async function RecentLogsPage() {
  const notes = await getRecentNotes();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
      
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block font-semibold">
          &larr; Back to Map
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Recent Logs
        </h1>
        <p className="text-gray-600 text-lg mt-2 mb-8">
          Trip logs chronological order, starting with the most recent.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {notes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 shadow-sm">
            No trip reports found yet.
          </div>
        ) : (
          notes.map((note: any) => (
            // Render your exact component, but turn on the River titles!
            <TripReportCard key={note.id} note={note} showRiver={true} />
          ))
        )}
      </div>

    </div>
  );
}