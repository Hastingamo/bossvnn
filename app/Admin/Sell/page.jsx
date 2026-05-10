// "use server";
// import React from "react";
// import { createClient } from "../../lib/server";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default async function Page() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return (
//       <div className="p-6">
//         <p className="text-red-500">Please log in to view your transactions.</p>
//       </div>
//     );
//   }
//  const role = user.app_metadata?.role || user.user_metadata?.role;
//   if (role !== "admin") {
//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
//         <p className="mt-2">You do not have permission to view this page.</p>
//       </div>
//     );
//   }

//   const { data: transactions } = await supabase
//     .from("transactions")
//     .select("*")
//     .order("created_at", { ascending: false });

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-4">Sell Coin</h1>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         {!transactions || transactions.length === 0 ? (
//           <p>No transactions yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             {transactions.map((transaction) => (
//               <div
//                 key={transaction.id}
//                 className="p-6 border rounded-lg shadow-sm bg-white w-full"
//               >
//                 <Link href={`/Admin/Sell/${transaction.id}`} className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                     {transaction.username ?? "Anonymous"} 
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <span className="font-medium">Wallet ID:</span>{" "}
//                     {transaction.wallet_id}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <span className="font-medium">Wallet Address:</span>{" "}
//                     {transaction.wallet_address}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <span className="font-medium">Total NGN:</span>{" "}
//                     {transaction.amount}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <span className="font-medium">Currency:</span>{" "}
//                     {transaction.currency}
//                   </p>
//                   <p className="text-gray-900">{transaction.comment}</p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     {new Date(transaction.created_at).toLocaleDateString()}
//                   </p>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
        <p className="text-red-500">Please log in to view transfers.</p>
      </div>
    );
  }

  // Check role from profiles table (secure server-side check)
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Fetch ALL transfers joined with each user's profile
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(`
      *,
      profiles (
        username
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching transfers:", error.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All User Transfers (Admin)</h1>

      {!transactions || transactions.length === 0 ? (
        <p className="text-gray-500">No transfers yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 border rounded-lg shadow-sm bg-white w-full"
            >
              <Link href={`/Admin/Buy/${transaction.id}`}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {transaction.profiles?.username || "Unknown User"}
                </h2>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Account Number:</span>{" "}
                  {transaction.account_number}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Account Name:</span>{" "}
                  {transaction.account_name}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Bank Name:</span>{" "}
                  {transaction.bank_name}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Total $:</span>{" "}
                  {transaction.crypto} {transaction.currency}
                </p>

                <p className="text-gray-900 mt-1">{transaction.comment}</p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

