"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import ReviewForm from "./Reviews/ReviewForm";
import ReviewList from "./Reviews/Display";
import ReviewsPage from "./Reviews/page";

export default function Page({params}) {
  const { Id: id } = useParams();

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`,
        );
        if (!response.ok) throw new Error("Coin not found");
        const data = await response.json();
        setCoin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCoin();
  }, [id]);
  return (
    <div>
      <h1 className="text-2xl font-bold">Product Details</h1>
      <Link href={`/Product/${id}/Reviews`} className="text-blue-500 underline">
        Review
      </Link>
      <div className="grid grid-rows-2 gap-4 md:grid-cols-2 ">
        <div className="border-2 p-4 shadow-lg justify-center items-center flex  h-screen">
          <p>Product ID: {id}</p>
        </div>
        <div className="border-2 p-4 shadow-lg justify-center items-center flex  h-screen">
          <h1>Review on the particular Coin</h1>
          {/* <ReviewForm productId={params.Id} />
          <ReviewList productId={params.Id} /> */}
          <ReviewsPage params={params} />
        </div>
      </div>
    </div>
  );
}
