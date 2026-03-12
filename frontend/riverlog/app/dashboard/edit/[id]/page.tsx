import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';
import { updateTripReport } from '@/lib/actions';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

// 1. Tell TypeScript that params is absolutely a Promise
export default async function EditLogPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Unwrap the Promise to extract the ID securely
  const resolvedParams = await params;

  // 3. Use the unwrapped ID (resolvedParams.id) to fetch the data
  const note = await pb.collection('notes').getOne(resolvedParams.id, {
    expand: 'section.river',
  }).catch((err) => {
    console.error("Fetch Error:", err);
    return null;
  });

  if (!note) {
    return (
      <main className="p-8 font-sans max-w-2xl mx-auto">
        <PageHeader 
          title="Log Not Found" 
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Error' }
          ]} 
        />
        <p className="text-gray-600 my-8">We couldn't find that trip report.</p>
        <a href="/dashboard" className="text-blue-600 font-medium hover:underline">
          ← Back to Dashboard
        </a>
      </main>
    );
  }

  // 3. Format the date from PocketBase (which is YYYY-MM-DD...) into YYYY-MM-DD for the HTML date input
  const formattedDate = new Date(note.date).toISOString().split('T')[0];

  return (
    <main className="p-8 font-sans max-w-2xl mx-auto">
      <PageHeader 
        title="Edit Trip Report"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Edit Log' },
        ]}
      />
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-300 mt-8">
        
        {/* We display the location, but don't let the user change it */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Location</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {note.expand?.section?.expand?.river?.name} 
            <span className="text-gray-500 ml-1">- {note.expand?.section?.name}</span>
          </p>
        </div>

        {/* Our update form wires up to the 'updateTripReport' Server Action */}
        <form action={updateTripReport} className="flex flex-col gap-6">
          
          {/* !!! CRUCIAL !!! Hidden input that carries the record ID to the Server Action */}
          <input type="hidden" name="id" value={note.id} />

          {/* DATE INPUT (Pre-filled) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="font-semibold text-gray-700 text-sm">Date</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              required 
              defaultValue={formattedDate} // <--- PRE-FILL HERE
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" 
            />
          </div>

          {/* WATER LEVEL INPUT (Pre-filled) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="water_level" className="font-semibold text-gray-700 text-sm">Water Level (e.g., 0.85m)</label>
            <input 
              type="text" 
              id="water_level" 
              name="water_level" 
              required 
              defaultValue={note.water_level} // <--- PRE-FILL HERE
              placeholder="e.g. 0.85m" 
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" 
            />
          </div>

          {/* NOTES TEXTAREA (Pre-filled) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="font-semibold text-gray-700 text-sm">Notes / Conditions (Optional)</label>
            <div className="flex flex-col gap-2">
            <label htmlFor="log" className="font-semibold text-gray-700 text-sm">Notes / Conditions</label>
            {/* Our new Rich Text Editor completely replaces the textarea */}
            <RichTextEditor 
              name="log" 
              defaultValue={note.log} 
            />
          </div>
          </div>

          {/* FORM BUTTONS */}
          <div className="flex justify-between items-center mt-6 gap-4">
            <Link 
              href="/dashboard" 
              className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-md hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}