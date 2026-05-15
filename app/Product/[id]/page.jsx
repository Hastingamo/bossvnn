import Link from "next/link";
import React from "react";
import Revie from "./Reviews/Revie";

export default async function Page({ params }) {
  const { id } = await params;
  let coin = null;
  let error = null;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error("Coin not found");
    coin = await response.json();
  } catch (err) {
    error = err.message;
    console.error("Fetch coin error:", err);
  }

  return (
    <div className="p-8 bg-[#f2e0d0] dark:bg-[#1a0f08] transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Details</h1>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      <Link href={`/Product/${id}/Reviews`} className="text-blue-500 dark:text-blue-400 underline mb-8 inline-block">
        View All Reviews
      </Link>

      <div className="grid grid-cols-1 gap-8 w-full md:w-2/4">
        <div className="border-2 dark:border-gray-800 p-8 shadow-lg rounded-xl bg-white dark:bg-gray-900 flex flex-col items-center justify-center h-[200px] transition-colors">
          {coin && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{coin.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 uppercase mb-4">{coin.symbol}</p>
              {coin.market_data?.current_price?.usd && (
                <p className="text-2xl font-mono text-green-600 dark:text-green-400">
                  Price: ${coin.market_data.current_price.usd.toLocaleString()}
                </p>
              )}
            </div>
          )}
          <button>
            <Link href="/Exchanges" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded hover:opacity-80 transition">
              buy {coin?.name}
            </Link>
          </button>
        </div>
        
        <div className="border-2 dark:border-gray-800 p-8 shadow-lg rounded-xl bg-white dark:bg-gray-900 h-fit overflow-y-hidden transition-colors">
          <h2 className="text-xl font-bold mb-6 border-b dark:border-gray-700 pb-2 text-gray-900 dark:text-white">Reviews for this Coin</h2>
          <div className="max-h-[600px] overflow-y-auto">
            <Revie params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}
