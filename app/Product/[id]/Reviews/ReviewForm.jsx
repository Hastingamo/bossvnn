"use client";

import { useState } from "react";
import { supabase } from "../../../lib/Client";

export default function ReviewForm({ productId }) {


  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      setMessage("Error submitting review");
      setMessageType("error");
    } else {
      setMessage("Review added successfully!");
      setMessageType("success");
      setComment("");
      setRating(5);
    }

    setLoading(false);
  };

  return (
      <div className="w-full max-w-md mx-auto border-2 p-6 shadow-lg rounded-lg">
        {message && (
          <div className={`p-3 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-4`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r}><h1>Rating: {r}</h1></div>
        ))}
      </div> */}
      {/* Star Rating */}
      <div className="flex space-x-1 mb-4">
        {[1,2,3,4,5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ⭐
          </button>
        ))}
      </div>
      <label>Rating: {rating}/5</label>
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