import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8 font-sans max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-10xl font-bold mb-6">Welcome to Euan's River Log</h1>
      <p className="text-xl max-w-lg">
        Hopefully my notes from the river will be helpful for you!
      </p>
      <p className = "mb-8">
        This is not meant to serve as a replacement for a guidebook.
      </p>
      
      <Link href="/rivers">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Browse All Rivers
        </button>
      </Link>

      <footer>
      <address>
        <p> Author: Euan D-H &emsp; <a href="mailto:euan@riverlog.uk">euan@riverlog.uk</a> </p>
      </address>
      </footer>      

    </main>
  );
}