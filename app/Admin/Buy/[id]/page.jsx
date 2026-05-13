"use server";
import Link from "next/link";
import { createClient } from "../../../lib/server";
import BuyingDetails from "./BuyingDetails";

export default async function page({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">Please log in to view buy details.</p>
        <Link href="/SignUp" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  const { data: transfer, error } = await supabase
    .from("transfer_with_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !transfer) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Buy transaction not found.
        </div>
      </div>
    );
  }

  const username = transfer.username || "User";

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Link
        href="/Admin/Buy"
        className="inline-block mb-6 text-blue-500 hover:underline text-lg font-medium"
      >
        ← Back to Buy List
      </Link>

      <h1 className="text-3xl font-bold mb-8">Buy Detail</h1>

      <BuyingDetails transfer={transfer} username={username} />
    </div>
  );
}