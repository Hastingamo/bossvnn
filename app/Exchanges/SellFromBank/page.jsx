"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "../../lib/Client";

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Parallex Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  "Kuda Bank",
  "Opay",
  "Palmpay",
  "Moniepoint",
  "Carbon",
  "VFD Microfinance Bank",
  "Rubies Bank",
];

function Page() {
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [coin, setCoins] = useState(null);
  const [fee, setFee] = useState("");
  const [totalNgn, setTotalNgn] = useState("");
  const Router = useRouter();

  
  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.toLowerCase().includes(bankName.toLowerCase())
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const isAccountNumber = (accNum) =>
    accNum.length === 10 && /^[0-9]+$/.test(accNum);

  const isAccountName = (accName) =>
    accName.length >= 2 &&
    accName.length <= 50 &&
    /^[a-zA-Z\s]+$/.test(accName);

  useEffect(() => {
    const storedAmount = localStorage.getItem("cryptoAmount");
    const storedCurrency = localStorage.getItem("fromBankCurrency");
    if (storedAmount) setCryptoAmount(JSON.parse(storedAmount));
    if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
  }, []);

  useEffect(() => {
    if (!currency || !cryptoAmount) return;

    const fetchCoin = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100"
        );
        const data = await response.json();
        const found = data.find(
          (c) => c.symbol.toUpperCase() === currency.toUpperCase()
        );
        if (found) {
          setCoins(found);
          const pricePerUnit = found.current_price;
          const calculatedNgn = (
            parseFloat(cryptoAmount) * pricePerUnit * 1352 * 0.11
          ).toFixed(2);
          const calculatedFee = (parseFloat(calculatedNgn) * 0.07).toFixed(2);
          setFee(calculatedFee);
          setTotalNgn(
            (parseFloat(calculatedNgn) + parseFloat(calculatedFee)).toFixed(2)
          );
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

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!NIGERIAN_BANKS.includes(bankName)) {
      setError("Please select a valid bank from the list");
      setLoading(false);
      return;
    }

    if (!accountNumber || !accountName || !bankName) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    if (!isAccountNumber(accountNumber)) {
      setError("Please enter a valid 10-digit account number");
      setLoading(false);
      return;
    }

    if (!isAccountName(accountName)) {
      setError("Please enter a valid account name (letters only)");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to continue");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("transfer").insert({
      user_id: user.id,
      account_number: accountNumber,
      account_name: accountName,
      bank_name: bankName,
      amount: parseFloat(totalNgn),
      currency: currency,
      total_ngn: parseFloat(totalNgn),
      method: "bank",
      status: "pending",
    });

    if (insertError) {
      setError("Failed to create request: " + insertError.message);
      setLoading(false);
      return;
    }

    localStorage.setItem("bankTransferAmount", JSON.stringify(totalNgn));
    localStorage.setItem("bankTransferCurrency", JSON.stringify(currency));

    setMessage("Request created! Redirecting...");
    setAccountName("");
    setAccountNumber("");
    setBankName("");
    setLoading(false);
    setTimeout(() => Router.push("/Exchanges/SellFromBank/Bank"), 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Sell From Bank</h1>
      <p className="mt-4 text-gray-600">This is the Sell From Bank page.</p>
      <div className="max-w-6xl mx-auto">
        <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
          <form className="p-8 relative" onSubmit={handleForm}>
            <h2 className="text-2xl font-bold mb-6">Sell from Bank</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ACCOUNT NUMBER
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {accountNumber && (
                  <p className={`text-xs mt-1 ${isAccountNumber(accountNumber) ? "text-green-600" : "text-orange-600"}`}>
                    {isAccountNumber(accountNumber)
                      ? "Valid account number"
                      : "Must be exactly 10 digits"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ACCOUNT NAME
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {accountName && (
                  <p className={`text-xs mt-1 ${isAccountName(accountName) ? "text-green-600" : "text-orange-600"}`}>
                    {isAccountName(accountName)
                      ? "Valid account name"
                      : "Letters only, 2-50 characters"}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BANK NAME
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search your bank..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                {showDropdown && filteredBanks.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {filteredBanks.map((bank) => (
                      <li
                        key={bank}
                        onMouseDown={() => {
                          setBankName(bank);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      >
                        {bank}
                      </li>
                    ))}
                  </ul>
                )}
                {bankName && !NIGERIAN_BANKS.includes(bankName) && (
                  <p className="text-xs mt-1 text-orange-600">
                    Please select a bank from the list
                  </p>
                )}
                {bankName && NIGERIAN_BANKS.includes(bankName) && (
                  <p className="text-xs mt-1 text-green-600">Valid bank selected ✓</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Summary
                </label>
                <div className="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 space-y-1">
                  {coin ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coin</span>
                        <span className="font-medium">
                          {coin.name} ({currency.toUpperCase()})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price per unit</span>
                        <span>
                          {coin?.current_price
                            ? `$${coin.current_price.toLocaleString()}`
                            : "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Amount</span>
                        <span>{cryptoAmount} {currency.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Bonus</span>
                        <span>₦{Number(fee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1 mt-1">
                        <span>Total</span>
                        <span>₦{Number(totalNgn).toLocaleString()}</span>
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
    </div>
  );
}

export default Page;