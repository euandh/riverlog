import PageHeader from '@/components/PageHeader';
import pb from '@/lib/pocketbase';
import DashboardForm from '@/components/DashboardForm';
import { createTripReport, createRiver, createSection } from '@/lib/actions';

export default async function DashboardPage() {
  const rawRivers = await pb.collection('rivers').getFullList({ sort: 'name' }).catch(() => []);
  const rawSections = await pb.collection('sections').getFullList({ sort: 'name' }).catch(() => []);

  const rivers = rawRivers.map(r => ({ id: r.id, name: r.name }));
  const sections = rawSections.map(s => ({ id: s.id, river: s.river, name: s.name }));

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto">
      <PageHeader 
        title="Admin Dashboard"
        subtitle="Manage your river database"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

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
                  <input type="text" id="region" name="region" required placeholder="e.g. Devon" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
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

        </div>
      </div>
    </main>
  );
}