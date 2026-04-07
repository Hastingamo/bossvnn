"use server";
import React from "react";
import ExchangesContent from "./ExchangeContent";
import { redirect } from 'next/navigation';
import { createClient } from "../lib/server";

export default async function Page() {
      const supabase = await createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      redirect('/SignUp');
    }
  let initialCoins = [];
  let error = null;

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100",
      {
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coin data");
    }

    initialCoins = await response.json();
  } catch (err) {
    error = err.message;
    console.error("Exchanges ISR fetch error:", err);
  }

  return (
    <div className=" bg-background min-h-screen">
      {error && (
        <div className="bg-red-500/10 p-4 border-b border-red-500/20">
          <p className="text-red-500 text-center font-bold">
            Notice: Error loading latest asset list. Using cached data.
          </p>
        </div>
      )}
      <ExchangesContent initialCoins={initialCoins} />
    </div>
  );
}
