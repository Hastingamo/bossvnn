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
        <p className="text-red-500">Please log in to view your transfer.</p>
      </div>
    );
  }

  const { data: transfer } = await supabase
    .from("transfer")
    .select("*")
    .order("created_at", { ascending: false });

  const username = user.user_metadata?.username || "User";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sell Coin</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!transfer || transfer.length === 0 ? (
          <p>No transfer yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            {" "}
            {transfer.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 border rounded-lg shadow-sm bg-white w-full"
              >
                <Link href={`/Admin/Buy/${transaction.id}`} className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {username}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">account number:</span>{" "}
                  {transaction.account_number}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">account name:</span>{" "}
                  {transaction.account_name}
                </p>
                   <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">bank name:</span>{" "}
                  {transaction.bank_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Total $:</span>{" "}
                  {transaction.crypto} {transaction.currency}
                </p>
              

                <p className="text-gray-900">{transaction.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
