"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Loader from "../Component/Loadings";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const items = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function NewsContent({ initialNews }) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNews, setFilteredNews] = useState(initialNews || []);

  useEffect(() => {
    const filtered = (initialNews || []).filter(
      (item) =>
        item?.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [searchTerm, initialNews]);

  return (
    <div className="bg-[#2c5364] w-full min-h-screen text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold">Latest Crypto News</h1>
          <input
            type="text"
            placeholder="Search news headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border-none w-full md:w-1/2 lg:w-1/3 rounded-xl text-black bg-white shadow-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {searchTerm && filteredNews.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Image
              src="/Image/downloads.jfif"
              alt="No results"
              width={200}
              height={200}
              className="rounded-full opacity-50"
            />
            <p className="text-xl mt-6 text-gray-300">No matching news found.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredNews.map((item, index) => (
              <motion.div
                key={index}
                variants={items}
                className="bg-white text-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:shadow-blue-500/20 transition-all duration-300 group"
              >
                <div className="relative h-56 xl:h-36 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.headline}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 xl:p-3 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors">
                    {item.headline}
                  </h2>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-gray-500 italic">
                       {new Date(item.datetime * 1000).toLocaleDateString()}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-blue-600 hover:text-white text-blue-600 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                    >
                      Read Story
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
