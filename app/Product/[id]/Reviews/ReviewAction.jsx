"use client";

import { useState } from "react";
import { supabase } from "../../../lib/Client";
import { useRouter } from "next/navigation";

export default function ReviewActions({ review, productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleDelete = async () => {
    if (!confirm("Delete your review?")) return;
    setLoading(true);
    await supabase.from("reviews").delete().eq("id", review.id);
    router.refresh();
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .update({
        rating,
        comment,
      })
      .eq("id", review.id);

    if (error) {
    console.log("Supabase error:", error.message, error.details, error.hint, error.code);
  setMessage(error.message);
  setMessageType("error");
    } else {
      setMessage("Review updated!");
      setMessageType("success");
      router.refresh();
      setTimeout(() => {
        setEditing(false);
        setMessage("");
      }, 1000);
    }

    setLoading(false);
  };

  if (editing) {
    return (
      <div className="mt-4 border-t dark:border-gray-800 pt-4">
        {message && (
          <div className={`p-3 rounded mb-4 ${messageType === "success" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex space-x-1">
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
          <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rating: {rating}/5</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border dark:border-gray-700 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded hover:opacity-80 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setRating(review.rating);
                setComment(review.comment);
                setMessage("");
              }}
              className="border dark:border-gray-700 px-4 py-2 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-blue-500 dark:text-blue-400 hover:underline font-medium"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm text-red-500 dark:text-red-400 hover:underline font-medium"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}