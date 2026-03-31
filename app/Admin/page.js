"use server";
import { redirect } from 'next/navigation';
import { createClient } from '../lib/server';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.user_metadata?.role || user.user_metadata.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e6] to-[#381932] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p>Welcome, Admin! Role-based access works.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded-xl text-sm overflow-auto">
          {JSON.stringify(user?.user_metadata, null, 2)}
        </pre>
      </div>
    </div>
  );
}