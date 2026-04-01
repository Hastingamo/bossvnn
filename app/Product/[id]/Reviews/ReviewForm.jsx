"use client";

import { useState } from "react";
import { supabase } from "../../../lib/Client";

export default function ReviewForm({ productId }) {


  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment,
      Date: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      alert("Error submitting review");
    } else {
      alert("Review added!");
      setComment("");
    }

    setLoading(false);
  };

  return (
      <div className=" w-3/4 border-2 p-4 shadow-lg justify-center items-center flex  h-screen">
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r}><h1>Rating: {r}</h1></div>
        ))}
      </div> */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="border p-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
      </div>
  
  );
}