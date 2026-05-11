"use client";   
import React, { useState, useEffect } from 'react'
import Loader from '../Component/Loadings';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const items = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
export default function ProductPage({initializeCoins}) {
    const [coins, setCoins] = useState(initializeCoins || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(initializeCoins || []);
    const [loading, setLoading] = useState(false);
      useEffect(() => {
    const filtered = (initializeCoins || []).filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
}, [searchTerm, initializeCoins]);

  return (
    <div className='p-2'>
        <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold">Product</h1>
          <input
            type="text"
            placeholder="Search news headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border-none w-full md:w-1/2 lg:w-1/3 rounded-xl text-black bg-white shadow-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        {
            searchTerm ? (
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
            ):(
                 <motion.div variants={container} initial="hidden" animate="visible">
              {filteredData.map((item, index) => (
                <motion.div
                  variants={items}
                  whileHover={{ scale: 1.02 }}
                  key={index}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="lg:text-[18px] text-white"
                >
                  <Link 
                    href={`/Product/${item.id}`}
                    className="m-4 p-6 border-2 bg-gradient-to-br from-[#1B3358] to-[#06142E] xl:ml-[2rem] rounded-2xl xl:rounded-[10px] xl:pt-4 xl:pb-4 grid  md:grid-cols-2 lg:p-0 lg:grid-cols-4 xl:grid-cols-6"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <p>
                      #{index + 1} {item.name} ({item.symbol.toUpperCase()} ||{" "}
                      {item.category})
                    </p>
                    <p>💰 Price: ${item.current_price.toLocaleString()}</p>
                    <p>📈 Market Cap: ${item.market_cap.toLocaleString()}</p>
                    <p
                      className={`font-semibold ${
                        (item.price_change_percentage_24h ?? 0) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      1min Change:{" "}
                      {typeof item.price_change_percentage_24h === "number"
                        ? `${item.price_change_percentage_24h.toFixed(2)}%`
                        : "N/A"}
                    </p>
                    <p>🔄 Volume: ${item.total_volume.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            
        )}
        </div>
        
    </div>
  )
}
