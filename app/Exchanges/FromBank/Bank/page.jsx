"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Banknote, 
  Copy, 
  CheckCircle2, 
  Info, 
  ArrowLeft,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BankTransferPage() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedAmount = localStorage.getItem("bankTransferAmount");
    const storedCurrency = localStorage.getItem("bankTransferCurrency");
    
    if (storedAmount || storedCurrency) {
      setTimeout(() => {
        if (storedAmount) setAmount(JSON.parse(storedAmount));
        if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
      }, 0);
    }
  }, []);

  const bankDetails = {
    bankName: "access Bank",
    accountNumber: "0123456789",
    accountName: "BossVNN Exchange",
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center"
    >
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center relative">
          <Link 
            href="/Exchanges/FromBank" 
            className="absolute left-6 top-1/2 -translate-y-1/2 hover:bg-white/20 p-2 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <Banknote className="mx-auto mb-2" size={40} />
          <h1 className="text-2xl font-bold">Bank Transfer Details</h1>
          <p className="text-blue-100 opacity-90">Please make the payment to complete your deposit</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center bg-secondary/20 p-6 rounded-2xl border border-border/50">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Amount to Pay</span>
            <div className="text-[18px] font-black mt-1 text-foreground">
              ₦{Number(amount).toLocaleString()}
            </div>
            {currency && (
              <p className="text-sm text-blue-600 font-medium mt-1">
                For {currency.toUpperCase()} Purchase
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info size={18} className="text-blue-600" />
              Recipient Account
            </h3>
            
            <div className="grid gap-3">
              {[
                { label: "Bank Name", value: bankDetails.bankName, key: "bank" },
                { label: "Account Number", value: bankDetails.accountNumber, key: "number" },
                { label: "Account Name", value: bankDetails.accountName, key: "name" }
              ].map((field) => (
                <div 
                  key={field.key}
                  className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-blue-500/50 transition-colors group"
                >
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">{field.label}</p>
                    <p className="text-lg font-semibold">{field.value}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(field.value, field.key)}
                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-blue-600 transition"
                  >
                    {copiedField === field.key ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-4 rounded-xl flex gap-4">
            <Clock className="text-orange-500 shrink-0" size={24} />
            <div className="text-sm text-orange-800 dark:text-orange-200">
              <p className="font-bold mb-1">Payment Instructions:</p>
              <ul className="list-disc ml-4 space-y-1 opacity-90">
                <li>Please transfer the <strong>exact amount</strong> shown above.</li>
                <li>Ensure you include your wallet address in the transfer narration if possible.</li>
                <li>Your transaction will be processed once payment is confirmed (usually within 10-30 minutes).</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/Exchanges/Confirm")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              I Have Made the Payment
            </button>
            <Link 
              href="/Exchanges"
              className="w-full text-center text-muted-foreground hover:text-foreground font-medium py-2 transition"
            >
              Cancel Transaction
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
