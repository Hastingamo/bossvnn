"use server";
import React from "react";
import { createClient } from "../../lib/server";

export default async function page({ walletId, walletAddress }) {
  const supabase = await createClient();
  const [
    { data: transactions },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .eq("wallet_address", walletAddress)

      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const { user_metadata = {} } = user;

  const username = user_metadata.username || "User";
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sell Coin</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {transactions?.length === 0 ? (
          <p>No transactions yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 border rounded-lg shadow-sm bg-white"
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {username}
                </h1>{" "}
                <p className="text-gray-900">{transaction.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
