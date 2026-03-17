// Helper function for formatting time
function formatDuration(timeStr?: string) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':');
  
  // Removes leading zeros (e.g., "04" becomes "4")
  const cleanHours = parseInt(hours, 10); 
  return `${cleanHours}hr${minutes}`;
}

export default function TripReportCard({ note }: { note: any }) {
  return (
    <div className="border border-gray-300 p-6 my-4 rounded-lg shadow-sm bg-white">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-900">{note.expand?.section?.name}</h3>
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
      
      <div 
      className="rich-text-content text-gray-800 w-full" 
      dangerouslySetInnerHTML={{ 
        __html: (note.log || "").replace(/&nbsp;/g, ' ') 
      }} 
      />
    </div>
  );
}