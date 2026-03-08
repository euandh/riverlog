'use client'; 

import { useState } from 'react';

// We define the shape of the data we expect the server to hand us
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
  // This state remembers which river is currently selected
  const [selectedRiverId, setSelectedRiverId] = useState<string>('');

  // This dynamically filters the sections to only show ones belonging to the chosen river
  const availableSections = sections.filter(section => section.river === selectedRiverId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mt-8">
      <form action={action} className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* THE RIVER DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label htmlFor="river" className="font-semibold text-gray-700">River</label>
            <select 
              id="river"
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 bg-white"
              value={selectedRiverId}
              onChange={(e) => setSelectedRiverId(e.target.value)}
            >
              <option value="" disabled>Select a river...</option>
              {rivers.map((river) => (
                <option key={river.id} value={river.id}>{river.name}</option>
              ))}
            </select>
          </div>

          {/* THE SECTION DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label htmlFor="sectionId" className="font-semibold text-gray-700">Section</label>
            <select 
              id="sectionId"
              name="sectionId"
              required
              disabled={!selectedRiverId}
              defaultValue="" /* 1. Add this line here */
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 bg-white disabled:bg-gray-100"
            >
              {/* 2. Remove the word 'selected' from this option! */}
              <option value="" disabled>Select a section...</option>
              
              {availableSections.map((section) => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>
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
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="font-semibold text-gray-700">Date of Trip</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              required 
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="log" className="font-semibold text-gray-700">Trip Log</label>
          <textarea 
            id="log" 
            name="log" 
            rows={6} 
            required
            placeholder="How was the run?"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
          ></textarea>
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