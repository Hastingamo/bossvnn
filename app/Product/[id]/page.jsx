import Link from "next/link";
import React from "react";
import ReviewComponent from "./Reviews/ReviewComponent";

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
    <div className="p-8 bg-[#f2e0d0]">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}
      
      <Link href={`/Product/${id}/Reviews`} className="text-blue-500 underline mb-8 inline-block">
        View All Reviews
      </Link>

      <div className="grid grid-cols-1 gap-8 w-full md:w-2/4 bg-[#E88B00]">
        <div className="border-2 p-8 shadow-lg rounded-xl bg-white flex flex-col items-center justify-center h-[200px]">
          {coin && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{coin.name}</h2>
              <p className="text-gray-600 uppercase mb-4">{coin.symbol}</p>
              {coin.market_data?.current_price?.usd && (
                <p className="text-2xl font-mono text-green-600">
                  Price: ${coin.market_data.current_price.usd.toLocaleString()}
                </p>
              )}
            </div>
          )}
          <button>
            <Link href="/Exchanges" className="bg-black text-white px-4 py-2">
              buy {coin?.name}
            </Link>
          </button>
        </div>
        
        <div className="border-2 p-8 shadow-lg rounded-xl bg-white h-fit overflow-y-hidden">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Reviews for this Coin</h2>
          <div className="max-h-[600px] overflow-y-auto">
            <ReviewComponent params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}
