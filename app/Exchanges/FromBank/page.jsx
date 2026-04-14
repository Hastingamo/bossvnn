"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/Client";
import Link from "next/link";

export default function FromBank() {
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [totalNgn, setTotalNgn] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currencys, setCurrency] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const router = useRouter();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const storedAmount = localStorage.getItem("cryptoAmount");
    const storedCurrency = localStorage.getItem("currency"); // ✅ Must match key in ExchangesContent
    if (storedAmount) setCryptoAmount(JSON.parse(storedAmount));
    if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
  }, []);

  const isWalletID = (wID) =>
    wID.length >= 26 && /[A-Z]/.test(wID) && /[a-z]/.test(wID);

  const isWalletAddress = (wAD) =>
    wAD.length >= 26 && /[A-Z]/.test(wAD) && /[a-z]/.test(wAD);

  useEffect(() => {
    if (!currencys || !cryptoAmount) return;

    const fetchCoin = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100"
        );
        const data = await response.json();
        const found = data.find(
          (c) => c.symbol.toUpperCase() === currencys.toUpperCase() // ✅ Fixed: was `currency`, now `currencys`
        );

        if (found) {
          setCoin(found);
          const pricePerUnit = found.current_price;
          const calculatedNgn = (
            parseFloat(cryptoAmount) *
            pricePerUnit *
            1650
          ).toFixed(2);
          setTotalNgn(calculatedNgn); // ✅ Fixed: was broken by inline comment
        } else {
          setError("Currency not found: " + currencys);
        }
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to fetch coin price. Please try again.");
      }
    };

    fetchCoin();
  }, [currencys, cryptoAmount]);

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

    if (!walletId || !walletAddress) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      wallet_id: walletId,
      wallet_address: walletAddress,
      amount: parseFloat(cryptoAmount), // ✅ Fixed: was `amount` (undefined), now `cryptoAmount`
      currency: currencys,
      total_ngn: parseFloat(totalNgn),
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
    setLoading(false);
    setTimeout(() => router.push("/Exchanges/FromBank/Bank"), 1500);
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
                <label htmlFor="walletID" className="block text-sm font-medium text-gray-700 mb-1">
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
                {walletId && (
                  <p className={`text-xs mt-1 ${isWalletID(walletId) ? "text-green-600" : "text-orange-600"}`}>
                    {isWalletID(walletId) ? "Valid wallet ID" : "Wallet ID should be 26+ chars"}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
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
                {walletAddress && (
                  <p className={`text-xs mt-1 ${isWalletAddress(walletAddress) ? "text-green-600" : "text-orange-600"}`}>
                    {isWalletAddress(walletAddress) ? "Valid wallet address" : "Wallet address should be 26+ chars"}
                  </p>
                )}
              </div>

              {/* ✅ Now shows: coin name, price per unit, amount × price = total in NGN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Summary
                </label>
                <div className="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 space-y-1">
                  {coin ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coin</span>
                        <span className="font-medium">{coin.name} ({currencys.toUpperCase()})</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price per unit</span>
                        <span>${coin.current_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Amount</span>
                        <span>{cryptoAmount} {currencys.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1 mt-1">
                        <span>Total</span>
                        <span>₦{Number(totalNgn).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {currencys ? "Fetching price..." : "No currency selected"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {message && <p className="mt-4 text-sm text-green-500">{message}</p>}

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
                "Proceed"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}