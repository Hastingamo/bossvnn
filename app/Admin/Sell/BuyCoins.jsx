"use client";
import React from 'react'
import { createClient } from "../../lib/server";
import { useState, useEffect } from "react";
export default  function BuyCoins() {

     const [currency, setCurrency] = useState("");
  
    localStorage.setItem("bankTransferAmount", JSON.stringify(totalNgn));
    localStorage.setItem("bankTransferCurrency", JSON.stringify(currency));
  useEffect(() => {
    const storedAmount = localStorage.getItem("cryptoAmount");
    const storedCurrency = localStorage.getItem("fromBankCurrency");

    if (storedAmount && storedCurrency) {
      setTimeout(() => {
        if (storedAmount) setCryptoAmount(JSON.parse(storedAmount));
        if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
      }, 0);
    }
  }, []);
  const [
    { data: transactions },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);
  const { user_metadata = {} } = user;

  const username = user_metadata.username || "User";
  return (
    <div>
      
    </div>
  )
}




