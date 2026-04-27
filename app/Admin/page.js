"use server";
import { redirect } from "next/navigation";
import { createClient } from "../lib/server";
import Link from "next/link";
export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

if (!user) {
    redirect("/SignUp");
  }

  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex gap-4 justify-center items-center w-full mt-5 ">
              <h1 className="text-2xl font-bold mt-5">Admin Dashboard</h1>

        <button className="w-1/4 md:w-[18%] bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-black/20 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
          <Link href="/Admin/Buy">buy</Link>
        </button>
        <button className="w-1/4 md:w-[18%] bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-black/20 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
          <Link href="/Admin/Sell">sell</Link>
        </button>
      </div>
      <p className="mt-3">Welcome, {user.email}! You have admin access.</p>
      <p className="mt-3">
        This is where you can see what coin user want to buy .
      </p>
    </div>
  );
}
