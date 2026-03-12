'use client';

import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function CustomSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder,
  disabled = false 
}: {
  label: string,
  options: { id: string, name: string }[],
  value: string,
  onChange: (id: string) => void,
  placeholder: string,
  disabled?: boolean
}) {
  const [query, setQuery] = useState('');
  const selectedOption = options.find(o => o.id === value);

  // Filter options based on search query
  const filteredOptions = query === '' 
    ? options 
    : options.filter((opt) => opt.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`flex flex-col gap-2 font-sans ${disabled ? 'opacity-50' : ''}`}>
      <label className="font-semibold text-gray-700">{label}</label>
      
      <Listbox 
        value={value} 
        onChange={(val) => {
          onChange(val);
          setQuery(''); // Reset search when an item is selected
        }} 
        disabled={disabled}
      >
        <div className="relative">
          <ListboxButton className={`relative w-full cursor-default rounded-md py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors ${disabled ? 'bg-gray-100' : 'bg-white hover:border-gray-400'}`}>
            <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions 
            transition
            anchor="bottom start" // Next-gen anchoring for Headless UI v2
            className="z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition duration-100 ease-in data-[closed]:opacity-0"
          >
            {/* SEARCH INPUT FIELD */}
            <div className="sticky top-0 z-10 bg-white px-2 py-1.5 border-b border-gray-100">
              <div className="relative flex items-center">
                <MagnifyingGlassIcon className="absolute left-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus // Focus the search box immediately when opened
                  className="w-full rounded border-none bg-gray-50 py-1.5 pl-8 pr-2 text-sm focus:ring-1 focus:ring-blue-100 outline-none"
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  onKeyDown={(e) => e.stopPropagation()} // Stop keys from messing with selection
                />
              </div>
            </div>

            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-sm text-gray-500">
                No rivers found...
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <ListboxOption
                  key={opt.id}
                  value={opt.id}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors"
                >
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {opt.name}
                  </span>
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}