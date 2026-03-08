import PageHeader from '@/components/PageHeader';
import { loginAdmin } from '@/lib/actions';

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <main className="p-8 font-sans max-w-md mx-auto min-h-[60vh] flex flex-col justify-center">
      <PageHeader 
        title="Admin Login" 
        subtitle="Restricted access"
        breadcrumbs={[{ label: 'Login' }]} 
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mt-8">
        {searchParams.error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm font-medium border border-red-200">
            Invalid email or password. Please try again.
          </p>
        )}

        <form action={loginAdmin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-700 text-sm">Admin Email</label>
            <input type="email" id="email" name="email" required className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-gray-700 text-sm">Password</label>
            <input type="password" id="password" name="password" required className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-gray-900 text-white font-bold py-2 rounded-md hover:bg-gray-800 transition-colors mt-2">
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}