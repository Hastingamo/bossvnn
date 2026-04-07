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
        updated_at: new Date().toISOString(),
      })
      .eq("id", review.id);

    if (error) {
      console.log(error);
      setMessage("Error updating review");
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
      <div className="mt-4 border-t pt-4">
        {message && (
          <div className={`p-3 rounded mb-4 ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ⭐
              </button>
            ))}
          </div>
          <label className="text-sm text-gray-600">Rating: {rating}/5</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full rounded"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded"
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
              className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
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
        className="text-sm text-blue-500 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm text-red-500 hover:underline"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}