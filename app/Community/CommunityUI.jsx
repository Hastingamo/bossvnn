"use client";

import React from "react";
import { motion } from "framer-motion";
import community from "../Component/community.json";
import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const items = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function CommunityUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e1cbd7] to-[#b6abcf] flex flex-col items-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl md:text-5xl font-bold">
            Join Our Community
          </h1>
        </div>
        <p className="text-gray-600 max-w-xl mx-auto">
          Connect, learn, and grow with like-minded people across different
          platforms.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
      >
        {community.map((item) => (
          <motion.div
            key={item.name}
            variants={items}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative w-full h-32 mb-4 overflow-hidden rounded-xl">
              <Image
                src={item.images}
                fill
                alt={item.name}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.discreption}
              </p>

              <Link
                href={item.href}
                className="mt-2 text-center bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Join Now →
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
