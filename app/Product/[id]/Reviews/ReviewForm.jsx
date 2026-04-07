// "use client";

// import { useState } from "react";
// import { supabase } from "../../../lib/Client";
// import { useRouter } from "next/navigation";

// export default function ReviewForm({ productId }) {
//     const router = useRouter();


//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       setMessage("You must be logged in");
//       setMessageType("error");
//       setLoading(false);
//       return;
//     }

//     const { error } = await supabase.from("reviews").insert({
//       user_id: user.id,
//       product_id: productId,
//       rating,
//       comment,
//       created_at: new Date().toISOString(),
//     });
//    if (existingReview) {
//       const { error } = await supabase     
//          .from("reviews")
//         .update({
//           rating, 
//           comment,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", existingReview.id);
        
//     }


//     if (error) {
//       console.error(error);
//       alert("Something went wrong");
//     } else {
//       alert(existingReview ? "Updated!" : "Review added!");
//     }
//     if (error) {
//       setMessage("Error submitting review");
//       setMessageType("error");
//     } else {
//       setMessage("Review added successfully!");
//       setMessageType("success");
//       setComment("");
//       setRating(5);
//             router.refresh();

//     }

//     setLoading(false);
//   };


//   useEffect(() => {
//     if (existingReview) {
//       setRating(existingReview.rating);
//       setComment(existingReview.comment);
//     }
//   }, [existingReview]);


//   return (
//       <div className="w-full max-w-md mx-auto border-2 p-6 shadow-lg rounded-lg">
//         {message && (
//           <div className={`p-3 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-4`}>
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-4">

//       <div className="flex space-x-1 mb-4">
//         {[1,2,3,4,5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => setRating(star)}
//             className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
//           >
//             ⭐
//           </button>
//         ))}
//       </div>
//       <label>Rating: {rating}/5</label>
//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         placeholder="Write your review..."
//         className="border p-2 w-full"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-black text-white px-4 py-2"
//       >
//         {existingReview  ? "Submitting..." : "Submit Review"}
//       </button>
//     </form>
//       </div>
  
//   );
// }


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
  const [existingReview, setExistingReview] = useState(null);

  // useEffect(() => {
  //   const fetchExistingReview = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) return;

  //     const { data } = await supabase
  //       .from("reviews")
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .eq("product_id", productId)
  //       .single();

  //     if (data) {
  //       setExistingReview(data);
  //       setRating(data.rating);
  //       setComment(data.comment);
  //     }
  //   };

  //   fetchExistingReview();
  // }, [productId]);

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

    let error;

    // if (existingReview) {
    //   ({ error } = await supabase
    //     .from("reviews")
    //     .update({
    //       rating,
    //       comment,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("id", existingReview.id));
    // } else {
    //   ({ error } = await supabase.from("reviews").insert({
    //     user_id: user.id,
    //     product_id: productId,
    //     rating,
    //     comment,
    //     created_at: new Date().toISOString(),
    //   }));
    // }

({ error } = await supabase.from("reviews").upsert(
  {
    ...(existingReview ? { id: existingReview.id } : {}),
    user_id: user.id,
    product_id: productId,
    rating,
    comment,
    updated_at: new Date().toISOString(),
  },
  { onConflict: "user_id,product_id" }
));

    if (error) {
      console.error(error);
      setMessage("Error submitting review");
      setMessageType("error");
    } else {
      setMessage(existingReview ? "Review updated!" : "Review added!");
      setMessageType("success");
      setComment("");
      setRating(5);
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 p-6 shadow-lg rounded-lg">
      {message && (
        <div
          className={`p-3 rounded ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } mb-4`}
        >
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
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
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
          {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}