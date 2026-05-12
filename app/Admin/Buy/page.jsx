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
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Not Logged In</h1>
        <p className="mt-2">Please log in to view this page.</p>
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
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching transfers:", error.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">All User Transfers</h1>
      <p className="text-gray-500 mb-6">
        Logged in as admin: {adminProfile.username}
      </p>

      {!transfer || transfer.length === 0 ? (
        <p className="text-gray-500">No transfers yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {transfer.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 border rounded-lg shadow-sm bg-white w-full hover:shadow-md transition"
            >
              <Link href={`/Admin/Buy/${transaction.id}`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {transaction.username || "Unknown User"}
                  </h2>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      transaction.status === "pending"
                        ? "bg-orange-100 text-orange-600"
                        : transaction.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  {transaction.user_email}
                </p>

                <div className="space-y-1">
                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Account Number:</span>{" "}
                    {transaction.account_number}
                  </p>

                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Account Name:</span>{" "}
                    {transaction.account_name}
                  </p>

                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Bank Name:</span>{" "}
                    {transaction.bank_name}
                  </p>

                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Method:</span>{" "}
                    {transaction.method}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Crypto:</span>{" "}
                    {transaction.crypto} {transaction.currency?.toUpperCase()}
                  </p>

                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Amount NGN:</span>{" "}
                    ₦{Number(transaction.amount).toLocaleString()}
                  </p>

                  <p className="text-sm md:text-[16px] text-gray-600">
                    <span className="font-medium">Fee:</span>{" "}
                    ₦{Number(transaction.fee).toLocaleString()}
                  </p>

                  <p className="text-sm md:text-[16px] font-semibold text-gray-800">
                    <span className="font-medium">Total NGN:</span>{" "}
                    ₦{Number(transaction.total_ngn).toLocaleString()}
                  </p>
                </div>

                {transaction.comment && (
                  <p className="text-sm md:text-[14px] text-gray-500 mt-3 italic">
                    {transaction.comment}
                  </p>
                )}

                <p className="text-xs md:text-[14px] text-gray-400 mt-3">
                  {new Date(transaction.created_at).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}