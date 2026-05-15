"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/Client";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productId }) {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);


  useEffect(() => {
    const checkExistingReview = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCheckingReview(false); return; }

      const { data } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (data) setHasReviewed(true);
      setCheckingReview(false);
    };

    checkExistingReview();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

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
        username: user.user_metadata?.username || "User",  

      created_at: new Date().toISOString(),
    });

    if (error) {
      const isDuplicate = error.code === "23505";
      setMessage(isDuplicate ? "You have already reviewed this product." : "Error submitting review");
      setMessageType("error");
      if (isDuplicate) setHasReviewed(true);
    } else {
      setMessage("Review added successfully!");
      setMessageType("success");
      setComment("");
      setRating(5);

      setHasReviewed(true);
      router.refresh();
    }

    setLoading(false);
  };

  if (checkingReview) return null;

  if (hasReviewed) {
    return (
      <div className="w-full max-w-md mx-auto border-2 dark:border-gray-800 p-6 shadow-lg rounded-lg bg-white dark:bg-gray-900 transition-colors">
        <p className="text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded">
          You have already reviewed this product.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border-2 dark:border-gray-800 p-6 shadow-lg rounded-lg bg-white dark:bg-gray-900 transition-colors">
      {message && (
        <div className={`p-3 rounded ${messageType === "success" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"} mb-4`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            >
    {star <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        <label className="text-gray-700 dark:text-gray-300 font-medium">Rating: {rating}/5</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="border dark:border-gray-700 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded hover:opacity-80 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}