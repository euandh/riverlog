'use client'; // This tells Next.js this component lives in the browser!

import { deleteTripReport } from '@/lib/actions';

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteTripReport}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="text-red-600 hover:text-red-800 font-medium"
        onClick={(e) => { 
          if(!window.confirm('Delete this log permanently?')) {
            e.preventDefault(); 
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}