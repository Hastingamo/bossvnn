"use client";
import React from 'react'
import { createClient } from "../../lib/server";
import { useState, useEffect } from "react";
export default  function BuyCoins() {
  const [totalNgn, setTotalNgn] = useState("");

     const [currency, setCurrency] = useState("");
    useEffect(() => {
      const storedAmount = localStorage.setItem("bankTransferAmount");
      const storedCurrency = localStorage.getItem("fromBankCurrency");


      if (storedAmount && storedCurrency) {
        setTimeout(() => {
          if (storedAmount) setTotalNgn(JSON.parse(storedAmount));
          if (storedCurrency) setCurrency(JSON.parse(storedCurrency));
        }, 0);
      }
    }, []);
    // localStorage.setItem("bankTransferCurrency", JSON.stringify(currency));

    return (
    <div>
      
    </div>
  )
}




