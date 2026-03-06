export default function TripReportCard({ note }: { note: any }) {
  return (
    <div className="border border-gray-300 p-6 my-4 rounded-lg shadow-sm bg-white">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-900">{note.expand?.section?.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold text-gray-700">Level:</span> {note.water_level} &nbsp;|&nbsp; 
          <span className="font-semibold text-gray-700"> Date:</span> {new Date(note.date).toLocaleDateString()}
        </p>
      </div>
      
      <div 
        className="prose prose-blue max-w-none text-gray-800" 
        dangerouslySetInnerHTML={{ __html: note.log || "" }} 
      />
    </div>
  );
}