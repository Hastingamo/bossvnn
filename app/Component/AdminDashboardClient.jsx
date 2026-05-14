"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function AdminDashboardClient({ user, initials, accessDenied }) {
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-center p-8 bg-white border border-red-100 rounded-2xl shadow-sm max-w-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </motion.div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Access Denied</h1>
          <p className="text-sm text-gray-500">You do not have permission to view this page.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-6 py-10 max-w-2xl mx-auto font-sans"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        custom={0}
        className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100"
      >
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-1">
            Control panel
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage coin orders and user requests
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-green-100"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-green-500"
          />
          Admin access
        </motion.span>
      </motion.div>

      {/* User row */}
      <motion.div
        variants={fadeUp}
        custom={1}
        className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl mb-8"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-mono font-medium flex-shrink-0"
        >
          {initials}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          <p className="text-xs text-gray-400 font-mono">role: admin</p>
        </div>
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </motion.div>

      {/* Section label */}
      <motion.p
        variants={fadeUp}
        custom={2}
        className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-3"
      >
        Quick actions
      </motion.p>

      {/* Action cards */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-2 gap-3 mb-8"
      >
        {[
          {
            href: "/Admin/Buy",
            label: "Buy orders",
            desc: "Review coins users want to purchase",
            iconColor: "bg-green-50 text-green-600",
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            ),
          },
          {
            href: "/Admin/Sell",
            label: "Sell orders",
            desc: "Review coins users want to sell",
            iconColor: "bg-red-50 text-red-500",
            icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            ),
          },
        ].map((card, i) => (
          <motion.div
            key={card.href}
            variants={fadeUp}
            custom={3 + i}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={card.href}
              className="flex flex-col gap-3 p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-colors duration-150 group relative h-full"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">{card.label}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{card.desc}</p>
              </div>
              <motion.svg
                className="w-4 h-4 text-gray-300 absolute top-5 right-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 3, color: "#6b7280" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Info callout */}
      <motion.div
        variants={fadeUp}
        custom={5}
        className="flex items-start gap-3 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl"
      >
        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <p className="text-sm text-gray-500 leading-relaxed">
          This panel shows pending coin requests from users. Use the buy and sell sections above to view, approve, or reject orders.
        </p>
      </motion.div>
    </motion.div>
  );
}