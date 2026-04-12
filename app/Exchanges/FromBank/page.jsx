"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/Client";

export default function FromBank() {
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to continue");
      setLoading(false);
      return;
    }

    if (!walletId || !walletAddress || !amount) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      wallet_id: walletId,
      wallet_address: walletAddress,
      amount: parseFloat(amount),
      method: "bank",
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      setError("Failed to create deposit request: " + insertError.message);
      setLoading(false);
      return;
    }

    setMessage("Deposit request created! Redirecting...");
    setWalletId("");
    setWalletAddress("");
    setAmount("");
    setLoading(false);

    // router.push("/Exchanges/FromBank/Bank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-background text-foreground w-full h-fit p-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
          <form className="p-8 relative" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-bold mb-6">Deposit from Bank</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="walletID"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Wallet ID *
                </label>
                <input
                  id="walletID"
                  type="text"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="walletAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Wallet Address *
                </label>
                <input
                  id="walletAddress"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (USD) *
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}
            {message && (
              <p className="mt-4 text-sm text-green-500">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}