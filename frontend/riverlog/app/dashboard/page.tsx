import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';
import DashboardForm from '@/components/DashboardForm';
import DeleteButton from '@/components/DeleteButton';
import { createTripReport, createRiver, createSection, logoutAdmin, deleteTripReport } from '@/lib/actions';
import Link from 'next/link';

export default async function DashboardPage() {
  const rawRivers = await pb.collection('rivers').getFullList({ sort: 'name' }).catch(() => []);
  const rawSections = await pb.collection('sections').getFullList({ sort: 'name' }).catch(() => []);
  const rawNotes = await pb.collection('notes').getFullList({ sort: '-date', expand: 'section.river' }).catch(() => []);

  const rivers = rawRivers.map(r => ({ id: r.id, name: r.name }));
  const sections = rawSections.map(s => ({ id: s.id, river: s.river, name: s.name }));

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto">
      <div className="relative">
        <PageHeader 
          title="Admin Dashboard"
          subtitle="Manage the river database"
          breadcrumbs={[{ label: 'Dashboard' }]}
        />
        
        <form action={logoutAdmin} className="absolute top-0 right-0 z-10">
          <button 
            type="submit" 
            className="bg-red-50 text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-100 transition-colors border border-red-200 mt-2"
          >
            Log Out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* LEFT COLUMN: Daily Trip Logging */}
        <div>
          <h2 className="text-2xl font-semibold border-b pb-2 text-gray-900">Log a New Run</h2>
          <DashboardForm 
            rivers={rivers} 
            sections={sections} 
            action={createTripReport} 
          />
        </div>

        {/* RIGHT COLUMN: Database Expansion */}
        <div className="flex flex-col gap-8">
          
          {/* ADD RIVER FORM */}
          <div>
            <h2 className="text-2xl font-semibold border-b pb-2 text-gray-900">Add a River</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mt-4">
              <form action={createRiver} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-semibold text-gray-700 text-sm">River Name</label>
                  <input type="text" id="name" name="name" required placeholder="e.g. River Dart" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="region" className="font-semibold text-gray-700 text-sm">Region</label>
                  <input type="text" id="region" name="region" required placeholder="e.g. Dartmoor" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="bg-gray-900 text-white font-bold py-2 rounded-md hover:bg-gray-800 transition-colors mt-2">
                  Create River
                </button>
              </form>
            </div>
          </div>

          {/* ADD SECTION FORM */}
          <div>
            <h2 className="text-2xl font-semibold border-b pb-2 text-gray-900">Add a Section</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mt-4">
              <form action={createSection} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="riverId" className="font-semibold text-gray-700 text-sm">Parent River</label>
                  <select id="riverId" name="riverId" required defaultValue="" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 bg-white">
                    <option value="" disabled>Select parent river...</option>
                    {rivers.map((river) => (
                      <option key={river.id} value={river.id}>{river.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sectionName" className="font-semibold text-gray-700 text-sm">Section Name</label>
                    <input type="text" id="sectionName" name="name" required placeholder="e.g. Upper" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="grade" className="font-semibold text-gray-700 text-sm">Grade</label>
                    <input type="text" id="grade" name="grade" required placeholder="e.g. 4 (5)" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="font-semibold text-gray-700 text-sm">Description</label>
                  <textarea id="description" name="description" rows={3} placeholder="Brief description of the run..." className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"></textarea>
                </div>
                <button type="submit" className="bg-gray-900 text-white font-bold py-2 rounded-md hover:bg-gray-800 transition-colors mt-2">
                  Create Section
                </button>
              </form>
            </div>
          </div>
          
          {/* RECENT LOGS MANAGER */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold border-b pb-2 text-gray-900 mb-4">Manage Recent Logs</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
              {rawNotes.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">No trip reports found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Location</th>
                      <th className="p-4 font-semibold">Level</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {rawNotes.map((note) => (
                      <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          {new Date(note.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-4">
                          {/* PocketBase puts expanded relations inside an 'expand' object */}
                          <span className="font-medium text-gray-900">{note.expand?.section?.expand?.river?.name}</span>
                          <span className="text-gray-500 ml-1">- {note.expand?.section?.name}</span>
                        </td>
                        <td className="p-4">{note.water_level}</td>
                        
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-3">
                            <Link 
                              href={`/dashboard/edit/${note.id}`} 
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </Link>
                            
                            <DeleteButton id={note.id} />
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>


      </div>
    </main>
  );
}