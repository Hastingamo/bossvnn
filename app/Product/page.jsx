"use server"
import React from 'react'
import ProductPage from './ProductPage';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const items = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
export default async function Page() {
    let initialCoins = [];
    let error = null;

    try {
             const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100",
      {
        next: { revalidate: 3600 }
      }
    );
        if(!response.ok){
            throw new Error("failed to fetch coins data")
        }
        const data = await response.json();
        initialCoins = data;
    } catch (err) {
        error = err.message;
        console.error("Product ISR fetch error:", err);
    }
  return (
    <div className="bg-[#2c5364] w-full min-h-screen">
              {error && (
        <div className="bg-red-500/20 p-4 mb-4 rounded-lg">
          <p className="text-red-500 text-center font-bold">
            Notice: Error loading latest news. Showing cached news if available.
          </p>
        </div>
      )}
      <ProductPage initializeCoins={initialCoins}/>
    </div>
  )
}
