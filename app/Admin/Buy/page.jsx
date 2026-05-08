"use server";
import React from "react";
import { createClient } from "../../lib/server";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">Please log in to view transfers.</p>
      </div>
    );
  }

  // Check admin role from profiles table
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  // ✅ Use view instead of join
  const { data: transfer, error } = await supabase
    .from("transfer_with_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching transfers:", error.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All User Transfers (Admin)</h1>

      {!transfer || transfer.length === 0 ? (
        <p className="text-gray-500">No transfers yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {transfer.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 border rounded-lg shadow-sm bg-white w-full"
            >
              <Link href={`/Admin/Buy/${transaction.id}`}>
                {/* ✅ username comes directly from the view now */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {transaction.username || "Unknown User"}
                </h2>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Account Number:</span>{" "}
                  {transaction.account_number}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Account Name:</span>{" "}
                  {transaction.account_name}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Bank Name:</span>{" "}
                  {transaction.bank_name}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Total NGN:</span>{" "}
                  ₦{Number(transaction.total_ngn).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Crypto:</span>{" "}
                  {transaction.crypto} {transaction.currency}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Method:</span>{" "}
                  {transaction.method}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`font-semibold ${
                    transaction.status === "pending"
                      ? "text-orange-500"
                      : transaction.status === "completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                    {transaction.status}
                  </span>
                </p>

                <p className="text-gray-900 mt-1">{transaction.comment}</p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}