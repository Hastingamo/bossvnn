"use client";
import { useState } from "react";
import Link from "next/link";

export default function TransactionToggle({ transactions, transac, username }) {
  const [showTransac, setShowTransac] = useState(false);

  const activeData = showTransac ? transac : transactions;

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`text-sm font-medium ${!showTransac ? "text-blue-600" : "text-gray-500"}`}>
          Transactions
        </span>
        <button
          onClick={() => setShowTransac((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
            showTransac ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
              showTransac ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${showTransac ? "text-blue-600" : "text-gray-500"}`}>
          Transac
        </span>
      </div>

      {/* Data */}
      {!activeData || activeData.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activeData.map((item) => (
            <div
              key={item.id}
              className="p-6 border rounded-lg shadow-sm bg-white space-y-1"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {username}
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Wallet ID:</span> {item.wallet_id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Wallet Address:</span> {item.wallet_address}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total NGN:</span> {item.amount}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Currency:</span> {item.currency}
              </p>
              {item.comment && (
                <p className="text-gray-900">{item.comment}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              <Link
                href={`/Exchanges/Confirm/${item.id}`}
                className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}