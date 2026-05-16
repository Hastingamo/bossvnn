"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/Client";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const StatusBadge = ({ status }) => {
  const config = {
    completed:  { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)",  dot: "#4ade80", label: "Completed" },
    successful: { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)",  dot: "#4ade80", label: "Successful" },
    pending:    { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",   border: "rgba(251,191,36,0.25)",   dot: "#fbbf24", label: "Pending" },
    processing: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",   border: "rgba(96,165,250,0.25)",   dot: "#60a5fa", label: "Processing" },
    failed:     { color: "#f87171", bg: "rgba(248,113,113,0.12)",  border: "rgba(248,113,113,0.25)",  dot: "#f87171", label: "Failed" },
    cancelled:  { color: "#9ca3af", bg: "rgba(156,163,175,0.12)", border: "rgba(156,163,175,0.25)", dot: "#9ca3af", label: "Cancelled" },
  };
  const c = config[status] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)", dot: "#9ca3af", label: status };

  return (
    <motion.span
      key={status}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        borderRadius: 999,
        padding: "3px 12px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <motion.span
        style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block" }}
        animate={status === "pending" || status === "processing" ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.4 }}
      />
      {c.label}
    </motion.span>
  );
};

const InfoRow = ({ label, value, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "14px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase" }}>
      {label}
    </span>
    <span style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>{value || "—"}</span>
  </motion.div>
);

const BankCard = ({ field, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    style={{
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.04)",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: "14px 18px",
    }}
  >
    <div>
      <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>
        {field.label}
      </p>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{field.value}</p>
    </div>
  </motion.div>
);

export default function SellingDetails({ transaction, username }) {
  const [status, setStatus] = useState(transaction?.status);

  const bankDetails = [
    { label: "Bank Name",      value: "Access Bank",      key: "bank" },
    { label: "Account Number", value: "0123456789",       key: "number" },
    { label: "Account Name",   value: "BossVNN Exchange", key: "name" },
  ];

  // Realtime subscription
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

  const isSuccess = status === "successful" || status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: 820,
        margin: "0 auto",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#0f1117",
        borderRadius: 24,
        boxShadow: "0 8px 48px 0 rgba(0,0,0,0.5), 0 1px 2px 0 rgba(0,0,0,0.4)",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 5,
          background: "linear-gradient(90deg, #14b8a6, #0ea5e9, #6366f1)",
          transformOrigin: "left",
        }}
      />

      <div style={{ padding: "32px 32px 28px" }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          style={{ marginBottom: 28 }}
        >
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", margin: 0, letterSpacing: "-0.02em" }}>
                {username}
              </h2>
              <p style={{ fontSize: 12, color: "#4b5563", marginTop: 4, fontFamily: "monospace" }}>
                ID: {transaction?.id}
              </p>
            </div>
            <AnimatePresence mode="wait">
              <StatusBadge status={status} />
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "rgba(74,222,128,0.08)",
                  border: "1.5px solid rgba(74,222,128,0.2)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
                  style={{ fontSize: 20 }}
                >
                  🎉
                </motion.span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>
                  Your transaction has been confirmed!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ borderBottom: "1.5px dashed rgba(255,255,255,0.07)", marginBottom: 6 }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        >
          <InfoRow label="Wallet ID"      value={transaction?.wallet_id}      index={0} />
          <InfoRow label="Wallet Address" value={transaction?.wallet_address} index={1} />
          <InfoRow label="Total NGN"      value={transaction?.amount ? `₦${transaction.amount.toLocaleString()}` : null} index={2} />
          <InfoRow label="Currency"       value={transaction?.currency}       index={3} />
          <InfoRow label="Comment"        value={transaction?.comment}        index={4} />
        </motion.div>

        {/* Bank payment info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ marginTop: 24 }}
        >
          <p style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#2dd4bf",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>
            paid to this account
          </p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {bankDetails.map((field, i) => (
              <BankCard key={field.key} field={field} index={i} />
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ fontSize: 11, color: "#374151", textAlign: "center", marginTop: 24 }}
        >
          Created {new Date(transaction?.created_at).toLocaleString()}
        </motion.p>
      </div>
    </motion.div>
  );
}