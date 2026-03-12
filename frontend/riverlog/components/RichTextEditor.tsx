'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
// Import the standard, clean "Snow" theme styles
import 'react-quill-new/dist/quill.snow.css';

// This dynamic import tells Next.js: "Do NOT run this on the server, wait for the browser!"
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RichTextEditor({ 
  name, 
  defaultValue = '', 
  placeholder = 'Write your trip report here...' 
}: { 
  name: string, 
  defaultValue?: string,
  placeholder?: string
}) {
  const [content, setContent] = useState(defaultValue);

  return (
    <div className="bg-white flex flex-col gap-2">
      {/* The invisible workhorse that hands the HTML data to your Server Action */}
      <input type="hidden" name={name} value={content} />
      
      {/* The visible editor for the user */}
      <div className="h-48 mb-12">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          placeholder={placeholder}
          className="h-full"
        />
      </div>
    </div>
  );
}