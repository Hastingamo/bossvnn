// "use client";
// import React, { useState,useEffect } from "react";
// import { motion } from "framer-motion";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/Client";

// export default function FromBank() {
//   const [loading, setLoading] = useState(false);
//   const [walletId, setWalletId] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");
//   const [amount, setAmount] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [currency, setCurrency] = useState("");
//   const [amountNgn, setAmountNgn] = useState("");
//   const router = useRouter();
//   const [coin, setCoin] = useState("");


//     useEffect(() => {
//     const stored = localStorage.getItem("fromBankAmount");
//     if (stored) {
//       setAmountNgn(JSON.parse(stored));
//     }
   
//   }, []);
//       useEffect(() => {
//     const stored = localStorage.getItem("fromBankCurrency");
//     if (stored) {
//       setCurrency(JSON.parse(stored));
//     }
   
//   }, []); 

//    useEffect(() => {
//      const fecthCoin = async () => {
//       try{
//         const response = await fetch(
//           "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100"
//         );
//         const data = await response.json();
//         const found = data.find((c) => c.symbol.toUpperCase() === currency.toUpperCase());  
//         setCoin(found);
//       }
//       catch(err){
//         console.error("Error fetching coin data:", err);
//       }
//       }

//       if(currency == coin?.symbol.toUpperCase()){
//         const amounts = (amountNgn / coin.current_price).toFixed(6);
//         setAmount(amounts);
//       }

//     }, []);
    
    
      
   
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");
//     setAmount(amountNgn);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       setError("Please log in to continue");
//       setLoading(false);
//       return;
//     }

//     if (!walletId || !walletAddress || !amount) {
//       setError("Please fill all fields");
//       setLoading(false);
//       return;
//     }

//     const { error: insertError } = await supabase.from("transactions").insert({
//       user_id: user.id,
//       wallet_id: walletId,
//       wallet_address: walletAddress,
//       amount: parseFloat(amount),
//       method: "bank",
//       status: "pending",
//       created_at: new Date().toISOString(),
//     });

//     if (insertError) {
//       setError("Failed to create deposit request: " + insertError.message);
//       setLoading(false);
//       return;
//     }

//     setMessage("Deposit request created! Redirecting...");
//     setWalletId("");
//     setWalletAddress("");
//     setAmount("");
//     setLoading(false);

//     // router.push("/Exchanges/FromBank/Bank");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="bg-background text-foreground w-full h-fit p-4"
//     >
//       <div className="max-w-6xl mx-auto">
//         <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
//           <form className="p-8 relative" onSubmit={handleFormSubmit}>
//             <h2 className="text-2xl font-bold mb-6">Deposit from Bank</h2>

//             <div className="flex flex-col gap-4">
//               <div>
//                 <label
//                   htmlFor="walletID"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Wallet ID *
//                 </label>
//                 <input
//                   id="walletID"
//                   type="text"
//                   value={walletId}
//                   onChange={(e) => setWalletId(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="walletAddress"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Wallet Address *
//                 </label>
//                 <input
//                   id="walletAddress"
//                   type="text"
//                   value={walletAddress}
//                   onChange={(e) => setWalletAddress(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="price"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                 </label>
//                 {/* <input
//                   id="amount"
//                   type="number"
//                   step="0.01"
//                   min="1"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   required
//                 /> */}
//                 <div>
//                 {amount}
//                 </div>
//               </div>
//             </div>

//             {error && (
//               <p className="mt-4 text-sm text-red-500">{error}</p>
//             )}
//             {message && (
//               <p className="mt-4 text-sm text-green-500">{message}</p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin" size={18} />
//                   Processing...
//                 </>
//               ) : (
//                 "Proceed"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </motion.div>
//   );
// }



"use client";
import React, { useState, useEffect } from "react";
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
  const [currency, setCurrency] = useState("");
  const [amountNgn, setAmountNgn] = useState("");
  const router = useRouter();
  const [coin, setCoin] = useState(null); // Fix 5: null instead of ""

  useEffect(() => {
    const stored = localStorage.getItem("fromBankAmount");
    if (stored) setAmountNgn(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("fromBankCurrency");
    if (stored) setCurrency(JSON.parse(stored));
  }, []);

  // Fix 1, 2, 4: call the async function, compute amount inside it,
  // and add currency + amountNgn as dependencies
  useEffect(() => {
    if (!currency || !amountNgn) return;

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
          setCoin(found);
          // Fix 2: compute amount here, after the fetch resolves
          const converted = (amountNgn / found.current_price).toFixed(6);
          setAmount(converted);
        } else {
          setError("Currency not found: " + currency);
        }
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError("Failed to fetch coin price. Please try again.");
      }
    };

    fetchCoin(); // Fix 1: actually call the function
  }, [currency, amountNgn]); // Fix 4: proper dependencies

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    // Fix 3: removed the setAmount(amountNgn) that was clobbering the converted amount

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ({currency})
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-800">
                  {amount
                    ? `${amount} ${currency}`
                    : "Calculating..."}
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {message && <p className="mt-4 text-sm text-green-500">{message}</p>}

            <button
              type="submit"
              disabled={loading || !amount}
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