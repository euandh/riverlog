'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import CustomSelect from './CustomSelect';

type River = { id: string; name: string };
type Section = { id: string; river: string; name: string };

export default function DashboardForm({ 
  rivers, 
  sections,
  action 
}: { 
  rivers: River[]; 
  sections: Section[];
  action: (formData: FormData) => void;
}) {
  const [selectedRiverId, setSelectedRiverId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  // Dynamically filter sections based on the chosen river
  const availableSections = sections.filter(section => section.river === selectedRiverId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mt-8">
      <form action={action} className="flex flex-col gap-6">
        
        {/* HIDDEN INPUTS: These carry the actual IDs to your Server Action */}
        <input type="hidden" name="riverId" value={selectedRiverId} />
        <input type="hidden" name="sectionId" value={selectedSectionId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* THE CUSTOM RIVER SELECT */}
          <CustomSelect 
            label="River"
            options={rivers}
            value={selectedRiverId}
            onChange={(id) => {
              setSelectedRiverId(id);
              setSelectedSectionId(''); // Reset section if river changes
            }}
            placeholder="Select a river..."
          />

          {/* THE CUSTOM SECTION SELECT */}
          <CustomSelect 
            label="Section"
            options={availableSections}
            value={selectedSectionId}
            onChange={setSelectedSectionId}
            placeholder={selectedRiverId ? "Select a section..." : "Pick a river first"}
            disabled={!selectedRiverId}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="water_level" className="font-semibold text-gray-700">Water Level</label>
            <input 
              type="number" 
              step="0.01" 
              id="water_level" 
              name="water_level" 
              required 
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="font-semibold text-gray-700">Date of Trip</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              required 
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="font-semibold text-gray-700">Duration (hh:mm)</label>
          <input 
            type="text" 
            id="time" 
            name="time" 
            placeholder="e.g. 04:30"
            pattern="^([0-9]{1,2}):([0-5][0-9])$" 
            title="Format: hh:mm (e.g., 04:30 or 2:15)"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="log" className="font-semibold text-gray-700 text-sm">
            Trip Notes / Conditions
          </label>
          <RichTextEditor 
            name="log" 
            placeholder="Describe the run..." 
          />
        </div>

        <button 
          type="submit" 
          className="bg-gray-900 text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors mt-2"
        >
          Save to Database
        </button>
      </form>
    </div>
  );
}