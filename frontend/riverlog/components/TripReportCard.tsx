export default function TripReportCard({ note }: { note: any }) {
  return (
    <div className="border border-gray-300 p-4 my-4 rounded shadow-sm">
      <h3 className="text-xl font-bold">{note.expand?.section?.name}</h3>
      <p className="text-sm text-gray-500 mb-2">
        Level: {note.water_level} | Date: {new Date(note.date).toLocaleDateString()}
      </p>
      {/* Renders your rich-text log safely */}
      <div dangerouslySetInnerHTML={{ __html: note.log || "" }} />
    </div>
  );
}