"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/Client";
import Link from "next/link";

export default function ToBank() {
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [totalNgn, setTotalNgn] = useState("");
  const [fee, setFee] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const router = useRouter();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const storedAmount = localStorage.getItem("cryptoAmount");
    const storedCurrency = localStorage.getItem("fromBankCurrency");

    if (storedAmount && storedCurrency) {
      setTimeout(() => {
        if (storedAmount) setCryptoAmount(JSON.parse(storedAmount));
        if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!currency || !cryptoAmount) return;

    const fetchCoin = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100",
        );
        const data = await response.json();
        const found = data.find(
          (c) => c.symbol.toUpperCase() === currency.toUpperCase(),
        );
        if (found) {
          setCoin(found);
          const pricePerUnit = found.current_price;

          // Using 1650 rate as per project guidelines in memory
          const rate = 1650;
          const calculatedNgn = (
            parseFloat(cryptoAmount) *
            pricePerUnit *
            rate
          ).toFixed(2);

          const calculatedFee = (parseFloat(calculatedNgn) * 0.13).toFixed(2);
          setFee(calculatedFee);

          // For selling, the user receives the amount minus the fee
          const totalNgns = (
            parseFloat(calculatedNgn) - parseFloat(calculatedFee)
          ).toFixed(2);

          setTotalNgn(totalNgns);
        } else {
          setError("Currency not found: " + currency);
        }
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to fetch coin price. Please try again.");
      }
    };

    fetchCoin();
  }, [currency, cryptoAmount]);

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

    if (!bankName || !accountNumber || !accountName) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    // We'll store the bank details in a comment or repurposed fields if necessary,
    // but looking at the schema from existing code, we might need to be careful.
    // Given the task, I will use wallet_id for bank name and wallet_address for account number/name
    // or just put them in a structured way if the table allows.
    // Based on Admin/Sell/page.jsx, it seems it expects wallet_id and wallet_address.

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      wallet_id: bankName,
      wallet_address: `${accountNumber} (${accountName})`,
      amount: parseFloat(totalNgn),
      currency: currency,
      total_ngn: parseFloat(totalNgn),
      method: "bank_sell",
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      setError("Failed to create sell request: " + insertError.message);
      setLoading(false);
      return;
    }

    localStorage.setItem("bankTransferAmount", JSON.stringify(totalNgn));
    localStorage.setItem("bankTransferCurrency", JSON.stringify(currency));

    setMessage("Sell request created! Redirecting...");
    setLoading(false);
    setTimeout(() => router.push("/Exchanges/ToBank/Crypto"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-background text-foreground w-full h-fit p-4"
    >
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition">
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="max-w-6xl mx-auto">
        <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
          <form className="p-8 relative" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-bold mb-6">Sell for Bank Transfer</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Bank Name *
                </label>
                <input
                  id="bankName"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g. Access Bank"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Number *
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="10-digit account number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Name *
                </label>
                <input
                  id="accountName"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Full name on account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Summary
                </label>
                <div className="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 space-y-1">
                  {coin ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coin to Sell</span>
                        <span className="font-medium">
                          {coin.name} ({currency.toUpperCase()})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Market Price</span>
                        <span>${coin.current_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Amount</span>
                        <span>
                          {cryptoAmount} {currency.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Fee (13%)</span>
                        <span className="text-red-500">-₦{Number(fee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1 mt-1">
                        <span>You will receive</span>
                        <span className="text-green-600">₦{Number(totalNgn).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {currency ? "Fetching price..." : "No currency selected"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {message && (
              <p className="mt-4 text-sm text-green-500">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading || !totalNgn}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                "Proceed to Transfer Crypto"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
