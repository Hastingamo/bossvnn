"use client";
import { Search, Minimize2, Maximize2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

function Chart({ initialSymbol = "BINANCE:BTCUSDT" }) {
  const [currentSymbol, setCurrentSymbol] = useState(initialSymbol);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [search, setSearch] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [filtered, setFilteredData] = useState("");
  const [show, setShow] = useState(false);
  const [coinss, setCoinss] = useState([]);

  const chartContainerRef = useRef(null);
  const widgetRef = useRef(null);
  const [interval, setInterval] = useState("1D");

  const changeInterval = (newInterval) => {
    setInterval(newInterval);

    if (widgetRef.current) {
      widgetRef.current.onChartReady(() => {
        widgetRef.current.chart().setResolution(newInterval);
      });
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc"
        );
        const data = await res.json();
        setCoins(data.slice(0, 100));
        setCoinss(data.slice(0, 7));
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (window.TradingView) {
        // setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !chartContainerRef.current) return;

    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    chartContainerRef.current.innerHTML = "";

    widgetRef.current = new window.TradingView.widget({
      autosize: true,
      symbol: currentSymbol,
      container_id: chartContainerRef.current.id,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
    });
  }, [isScriptLoaded, currentSymbol, interval]);

  const toggleFullscreen = () => setIsFullScreen(!isFullScreen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (search.trim()) {
      const input = search.trim().toLowerCase();

      const coin = coins.find(
        (c) =>
          c.symbol.toLowerCase() === input || c.name.toLowerCase() === input
      );

      if (coin) {
        setCurrentSymbol(input);
        setSearch("");
      } else {
        setError("Coin does not exist");
      }
    }
  };

  const type = (e) => {
    setSearch(e.target.value);
    setShow(true);
  };
  useEffect(() => {
    const filtered = coins.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coins]);

  const symbolOnly = currentSymbol.split("/")[0];
  const selectedCoin = coins.find(
    (coin) => coin.symbol.toUpperCase() === symbolOnly.toUpperCase()
  );
  useEffect(() => {
  const close = () => setShow(false);
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);


  return (
    <div
      className={`bg-[#8487bf] h-screen rounded-2xl shadow-xl p-4
      ${isFullScreen ? "fixed inset-0 w-full h-screen z-50" : "relative"}`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="text-lg text-gray-100 font-semibold">
            {selectedCoin ? selectedCoin.name : "Loading..."}
            {error && <span className="text-red-500">{error}</span>}
          </p>
          <h2 className="text-sm font-bold text-gray-800">({currentSymbol})</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4" /> Exit
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" /> Fullscreen
              </>
            )}
          </button>
        </div>
      </div>


      <div className="mt-4 w-full h-[60vh] lg:h-[75vh] relative bg-white rounded-md overflow-hidden">
        <div
          ref={chartContainerRef}
          id="tradingview-chart"
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}

export default Chart;
