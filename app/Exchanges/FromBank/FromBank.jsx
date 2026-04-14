// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Form, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { supabase } from "../../lib/Client";

// export default function FromBank() {
//   const [loading, setLoading] = useState(false);
//   const [walletId, setWalletId] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");
//   const [amount, setAmount] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

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

//     const { error } = await supabase.from("transactions").insert({
//       user_id: user.id,
//       wallet_id: walletId,
//       wallet_address: walletAddress,
//       amount: parseFloat(amount),
//       method: "bank",
//       status: "pending",
//       created_at: new Date().toISOString(),
//     });

//     if (error) {
//       setError("Failed to create deposit request: " + error.message);
//     } else {
//       setMessage("Deposit request created! Proceed to pay via bank.");
//       setWalletId("");
//       setWalletAddress("");
//       setAmount("");
//     }

//     setLoading(false);
//   };
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="bg-background text-foreground w-full h-fit p-4"
//     >
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold mb-10 flex items-center gap-3"></h1>

//         <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-[200px_1fr]">
//           <div className="flex flex-row md:flex-col gap-2 p-4  border-b md:border-b-0 md:border-r border-border"></div>
//           <Form className="p-8 relative" onSubmit={handleFormSubmit}>
//             <h2 className="text-2xl font-bold mb-6">Deposit from Bank</h2>
//             <div>
//               <label
//                 htmlFor="walletID"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Wallet ID *
//               </label>
//               <input
//                 id="walletID"
//                 type="text"
//                 value={walletId}
//                 onChange={(e) => setWalletId(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="WalletAddress"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Wallet Address
//               </label>
//               <input
//                 id="WalletAddress"
//                 type="text"
//                 value={walletAddress}
//                 onChange={(e) => setWalletAddress(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 required
//               />
//             </div>
//             <div className="mt-4">
//               <label
//                 htmlFor="amount"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Amount (USD) *
//               </label>
//               <input
//                 id="amount"
//                 type="number"
//                 step="0.01"
//                 min="1"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 required
//               />
//             </div>
//             <button type="submit">
//               <Link href="/Exchanges/FromBank/Bank">procced</Link>
//             </button>
//           </Form>
//           <div className="p-8 relative min-h-[500px]">
//             {loading && (
//               <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
//                 <Loader2 className="animate-spin text-blue-500" size={48} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
