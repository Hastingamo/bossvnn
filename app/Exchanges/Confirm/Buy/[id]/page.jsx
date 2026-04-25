"use server";
import Link from "next/link";
import { createClient } from "../../../lib/server";
import SellingDetails from "./BuyingDetails";

export default async function page({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">Please log in to view sell details.</p>
        <Link href="/SignUp" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const { data: transfer, error } = await supabase
    .from("transfer")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !transfer) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          
        </div>
      </div>
    );
  }

  const username = user.user_metadata?.username || "User";

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Link
        href="/Admin/Sell"
        className="inline-block mb-6 text-blue-500 hover:underline text-lg font-medium"
      >
        ← Back to Sell List
      </Link>

      <h1 className="text-3xl font-bold mb-8">Sell Detail</h1>

      <SellingDetails transfer={transfer} username={username} />
    </div>
  );
}