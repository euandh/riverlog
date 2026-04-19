import Link from 'next/link';

// Helper function for formatting time
function formatDuration(timeStr?: string) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':');
  
  // Removes leading zeros (e.g., "04" becomes "4")
  const cleanHours = parseInt(hours, 10); 
  return `${cleanHours}hr${minutes}`;
}

export default function TripReportCard({ note, showRiver = false }: { note: any, showRiver?: boolean }) {
  const section = note.expand?.section;
  const river = section?.expand?.river;

  return (
    <div className="border border-gray-300 p-6 my-4 rounded-lg shadow-sm bg-white transition-hover hover:shadow-md">
      <div className="border-b pb-3 mb-4">
        
        {/* DYNAMIC HEADER: Shows River link on the global feed, or just the Section name on river pages */}
        <h3 className="text-xl font-bold text-gray-900">
          {showRiver && river ? (
            <Link href={`/rivers/${river.slug}`} className="hover:text-blue-600 transition-colors">
              {river.name} - {section?.name}
            </Link>
          ) : (
            section?.name || 'Unknown Section'
          )}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold text-gray-700">Level:</span> {note.water_level} &nbsp;|&nbsp; 
          <span className="font-semibold text-gray-700"> Date:</span> {new Date(note.date).toLocaleDateString('en-GB')}
          {note.time && (
            <span>
              &nbsp;|&nbsp; <span className="font-semibold text-gray-700">Time:</span> {formatDuration(note.time)}
            </span>
          )}
        </p>
      </div>
      
      {/* Rich Text Output */}
      <div 
        className="rich-text-content text-gray-800 w-full" 
        dangerouslySetInnerHTML={{ 
          __html: (note.log || "").replace(/&nbsp;/g, ' ') 
        }} 
      />
    </div>
  );
}