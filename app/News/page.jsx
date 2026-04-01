import React from "react";
import NewsContent from "./NewContent";


export default async function Page() {
  let initialNews = [];
  let error = null;
  const apikey = process.env.NEXT_FINNHUB_API_KEY;

 

  try {
      if (!apikey) {
      console.warn("Finnhub API key is missing. Skipping news fetch.");
    } else {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=crypto&token=${apikey}`,
      {
        next: { revalidate: 600 } 
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    initialNews = await response.json();
  }
  } catch (err) {
    error = err.message;
    console.error(err);
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
      <NewsContent initialNews={initialNews} />
    </div>
  );
}
