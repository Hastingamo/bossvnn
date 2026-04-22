"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Coins,
  Loader2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CoinsDataList = ({ coins }) => (
  <datalist id="coins-list">
    {coins.slice(0, 50).map((coin) => (
      <option key={coin.id} value={coin.symbol.toUpperCase()}>
        {coin.name}
      </option>
    ))}
  </datalist>
);

function ExchangesContentInner({ initialCoins }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currency, setCurrency] = useState(() => searchParams.get("currency")?.toUpperCase() || "");
  const [fromThisCurrency, setFromThisCurrency] = useState(() => searchParams.get("currency")?.toUpperCase() || "");
  const [toThisCurrency, setToThisCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [coins] = useState(initialCoins || []);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return (tab && ["buy", "sell", "swap"].includes(tab)) ? tab : "sell";
  });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 300);
  };

  const phone = "2348036210152";

  const validateCurrency = (symbol) => {
    if (!symbol) {
      setError("Please enter a currency.");
      return false;
    }
    const supportedCoins = coins.map((coin) => coin.symbol.toUpperCase());

    if (!supportedCoins.includes(symbol.toUpperCase())) {
      setError(`Sorry, we do not support ${symbol}.`);
      return false;
    }

    setError("");
    return true;
  };

  const openWhatsApp = (text) => {
    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleBuy = () => {
    if (!validateCurrency(currency)) return;
    openWhatsApp(`Hello, I want to buy ${amount} ${currency}`);
  };

  const handleSell = () => {
    if (!validateCurrency(currency)) return;
    openWhatsApp(`Hello, I want to sell ${amount} ${currency}`);
  };

  const handleSwap = () => {
    if (!validateCurrency(fromThisCurrency)) return;
    if (!validateCurrency(toThisCurrency)) return;
    openWhatsApp(`Hello, I want to exchange ${amount} ${fromThisCurrency} for ${toThisCurrency}`);
  };

  const handleFromBank = () => {
    if (!validateCurrency(currency)) return;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    localStorage.setItem("cryptoAmount", JSON.stringify(amount));
    localStorage.setItem("fromBankCurrency", JSON.stringify(currency));
    router.push("/Exchanges/FromBank");
  };



  const Form = ({ buttonText, action }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        action();
      }}
      className="space-y-5"
    >
      {error && <p className="text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</p>}

      <div>
        <label className="flex items-center gap-2 text-lg font-medium mb-1">
          <Coins size={18} className="text-primary" />
          Currency
        </label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full border border-border bg-background rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="e.g. BTC"
          list="coins-list"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-lg font-medium mb-1">
          <Search size={18} className="text-primary" />
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-border bg-background rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="0.00"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2"
        >
          {buttonText}
        </button>
        <button
          onClick={handleFromBank}
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2"
        >
          Buy with Bank Transfer
        </button>
      </div>
  
    </form>
  );


  const renderTabContent = () => {

    switch (activeTab) {
      case "buy":
        return <Form buttonText="Buy on WhatsApp" action={handleBuy} />;

      case "swap":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSwap();
            }}
            className="space-y-5"
          >
            {error && <p className="text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</p>}

            <div>
              <label className="flex items-center gap-2 text-lg font-medium mb-1">
                <TrendingDown size={18} className="text-primary" />
                From Currency
              </label>
              <input
                type="text"
                value={fromThisCurrency}
                onChange={(e) => setFromThisCurrency(e.target.value)}
                className="w-full border border-border bg-background rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. USDT"
                list="coins-list"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium mb-1">
                <TrendingUp size={18} className="text-primary" />
                To Currency
              </label>
              <input
                type="text"
                value={toThisCurrency}
                onChange={(e) => setToThisCurrency(e.target.value)}
                className="w-full border border-border bg-background rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. BTC"
                list="coins-list"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-lg font-medium mb-1">
                <Search size={18} className="text-primary" />
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-border bg-background rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2"
            >
              <ArrowRightLeft size={20} />
              SWAP ASSETS
            </button>
          </form>
        );

      default:
        return <Form buttonText="Sell on WhatsApp" action={handleSell} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-[#271587E] to-[#f7f7ff] w-full h-fit p-4"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
          <ArrowRightLeft className="text-blue-500" size={36} />
          Exchange Assets
        </h1>

        <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-[200px_1fr]">
          <div className="flex flex-row md:flex-col gap-2 p-4 bg-secondary/20 border-b md:border-b-0 md:border-r border-border">
            {["sell", "buy", "swap"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 font-bold capitalize
                  ${activeTab === tab 
                    ? "bg-blue-600 text-white shadow-lg translate-x-1" 
                    : "hover:bg-secondary/40"}`}
              >
                {tab === "sell" && <TrendingDown size={20} />}
                {tab === "buy" && <TrendingUp size={20} />}
                {tab === "swap" && <ArrowRightLeft size={20} />}
                <span>{tab}</span>
              </button>
            ))}
          </div>

          <div className="p-8 relative min-h-[500px]">
            {loading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-blue-500" size={48} />
              </div>
            )}
                                   <CoinsDataList coins={coins}/>
            {renderTabContent()}

            
     
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExchangesContent({ initialCoins }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    }>
      <ExchangesContentInner initialCoins={initialCoins} />
    </Suspense>
  );
}
