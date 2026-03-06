import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8 font-sans max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-10xl font-bold mb-6">Welcome to Euan's River Log</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        Hopefully my notes from the river will be helpful for you!
      </p>
      
      <Link href="/rivers">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Browse All Rivers
        </button>
      </Link>
    </main>
  );
}