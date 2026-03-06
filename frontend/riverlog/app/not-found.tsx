import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-8 font-sans max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        Either the section or river you're looking for doesn't exist, or I don't have any notes from it!
      </p>
      <Link href="/rivers">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Return to All Rivers
        </button>
      </Link>
    </main>
  );
}