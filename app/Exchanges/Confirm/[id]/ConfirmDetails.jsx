"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/Client";

export default function SellingDetails({ transaction, username }) {
  const [status, setStatus] = useState(transaction?.status);

  const bankDetails = {
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "BossVNN Exchange",
  };

useEffect(() => {
  if (!transaction?.id) return;

  const channel = supabase
    .channel(`transaction-${transaction.id}`)
    .on(
      "broadcast",             
      { event: "status_update" },
      (payload) => {
        console.log("📡 Received:", payload);
        setStatus(payload.payload.status);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [transaction?.id]);

  return (
    <div className="p-8 border rounded-xl shadow-lg bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{username}</h2>
        <p className="text-sm text-gray-500">
          Transaction ID: {transaction?.id}
        </p>
        <p className="text-sm text-gray-500">
          Status:{" "}
          <span
            className={`font-semibold capitalize ${
              status === "successful"
                ? "text-green-600"
                : status === "pending"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {status}
          </span>
        </p>
      </div>

      <div className="space-y-3">
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
            Total NGN:
          </span>{" "}
          ₦{transaction?.amount?.toLocaleString()}
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
            { label: "Account Number", value: bankDetails.accountNumber, key: "number" },
            { label: "Account Name", value: bankDetails.accountName, key: "name" },
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

        {/* ✅ Visual feedback banner when transaction is successful */}
        {status === "successful" && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-xl text-center font-semibold">
            ✓ Your transaction has been confirmed!
          </div>
        )}

        <p className="text-sm text-gray-500">
          Created: {new Date(transaction?.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}