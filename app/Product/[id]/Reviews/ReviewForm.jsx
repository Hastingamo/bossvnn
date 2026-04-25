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
        username,

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
      <div className="w-full max-w-md mx-auto border-2 p-6 shadow-lg rounded-lg">
        <p className="text-yellow-700 bg-yellow-50 p-3 rounded">
          You have already reviewed this product.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border-2 p-6 shadow-lg rounded-lg">
      {message && (
        <div className={`p-3 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-4`}>
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
              className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
    {star <= rating ? "⭐" : "☆"}
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