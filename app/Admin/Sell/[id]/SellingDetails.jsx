"use client";

import React, { useState } from "react";
import { supabase } from "../../../lib/Client";

export default function SellingDetails({ transaction, username }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(transaction?.status);

  const bankDetails = {
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "BossVNN Exchange",
  };

  const handleProcess = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("transactions")
      .update({ status: "completed" })
      .eq("id", transaction.id);

    if (error) {
      setError("Error updating transaction status:", error);
      alert("Failed to update transaction status. Please try again.");
    } else {
      await supabase.channel(`transaction-${transaction.id}`).send({
        type: "broadcast",
        event: "status_update",
        payload: { status: "completed" },
      });
      setStatus("completed");
      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          userId: transaction.user_id,
          username: username,
          transactionId: transaction.id,
          amount: `₦${transaction.amount?.toLocaleString()}`,
          currency: transaction.currency,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }
    }



    setLoading(false);
  };
  const statusColor =
    status === "completed"
      ? "text-green-600"
      : status === "pending"
        ? "text-yellow-600"
        : status === "processing"
          ? "text-blue-600"
          : status === "failed"
            ? "text-red-600"
            : status === "cancelled"
              ? "text-gray-400"
              : "text-gray-600";
  return (
    <div className="p-8 border rounded-xl shadow-lg bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{username}</h2>{" "}
    
        <p className="text-sm text-gray-500">
          Transaction ID: {transaction?.id}
        </p>
        <p className="text-sm text-gray-500">
          Status:{" "}
          <span className={`font-semibold capitalize ${statusColor}`}>
            {status}
          </span>
        </p>
      </div>
      {status === "completed" && (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-xl text-center font-semibold">
          ✓ Your transaction has been confirmed!
        </div>
      )}
      <div className="">
        <p className="text-lg font-semibold py-2">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Wallet ID:
          </span>{" "}
          {transaction?.wallet_id}
        </p>
        <p className="text-lg font-semibold">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Wallet Address:
          </span>{" "}
          {transaction?.wallet_address}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Crypto:
          </span>{" "}
          {transaction?.crypto} {transaction?.currency?.toUpperCase()}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Amount NGN:
          </span>{" "}
          ₦{Number(transaction?.amount).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Fee:
          </span>{" "}
          ₦{Number(transaction?.fee).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Total NGN:
          </span>{" "}
          ₦{Number(transaction?.total_ngn).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Currency:
          </span>{" "}
          {transaction?.currency}
        </p>
        <p className="text-sm">
          <span className="text-xs md:text-[16px] text-muted-foreground uppercase font-bold">
            Comment:
          </span>{" "}
          {transaction?.comment}
        </p>

        <div className="grid gap-4">
          {[
            { label: "Bank Name", value: bankDetails.bankName, key: "bank" },
            {
              label: "Account Number",
              value: bankDetails.accountNumber,
              key: "number",
            },
            {
              label: "Account Name",
              value: bankDetails.accountName,
              key: "name",
            },
          ].map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between bg-background hover:border-blue-500/50 transition-colors group"
            >
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  {field.label}
                </p>
                <p className="text-lg font-semibold">{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleProcess}
          disabled={loading || status === "completed"} 
          className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-black/20 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  opacity=".25"
                />
                <path
                  fill="currentColor"
                  opacity=".75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing...</span>
            </>
          ) : status === "completed" ? (
            "✓ Transaction Processed" 
          ) : (
            "Process Transaction"
          )}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Created: {new Date(transaction?.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
