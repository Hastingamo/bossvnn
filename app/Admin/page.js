"use server";
import { redirect } from 'next/navigation';
import { createClient} from "../lib/server"
export default async function AdminPage() {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.user_metadata?.role || user.user_metadata.role !== 'admin') {
    redirect('/');
  }

  return (
      <div>
        <h1 className="text-2xl font-bold mt-5">Admin Dashboard</h1>
        </div>

  );
}