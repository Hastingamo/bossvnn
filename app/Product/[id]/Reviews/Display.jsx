// "use server";

// import { createClient } from "../../../lib/server";
// import ReviewActions from "./ReviewAction";



// export default async function ReviewList({ productId }) {
//   const supabase = await createClient();

//   const [
//     { data: reviews },
//     { data: { user } },
//   ] = await Promise.all([
//     supabase
//       .from("reviews")
//       .select("*")
//       .eq("product_id", productId)
//       .order("date", { ascending: false }), 
//     supabase.auth.getUser(),
//   ]);

//     console.log("=== ReviewList Debug ===");
//   console.log("productId received:", productId);
//   console.log("reviews:", JSON.stringify(reviews, null, 2));
//   console.log("user:", user?.id);
//   // console.log("userError:", userError);
//   // console.log("=======================");
//   const hasReviewed = reviews?.some((review) => review.user_id === user?.id);

//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

//       {hasReviewed && (
//         <p className="mb-4 text-sm text-yellow-600">
//           You have already reviewed this product.
//         </p>
//       )}

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         {!reviews?.length ? (
//           <p>No reviews yet. Be the first to review!</p>
//         ) : (
//           <div className="space-y-4">
//             {reviews.map((review) => (
//               <div key={review.id} className="p-6 border rounded-lg shadow-sm bg-white">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                   {review.username ?? "Anonymous"} 
//                 </h3>

//                 <div className="flex items-center mb-2">
//                   <span className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
//                         ⭐
//                       </span>
//                     ))}
//                   </span>
//                   <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
//                 </div>

//                 <p className="text-gray-900">{review.comment}</p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   {new Date(review.date).toLocaleDateString()} {/* ✅ fixed: was created_at */}
//                 </p>

//                 {review.user_id === user?.id && <ReviewActions review={review} />}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use server";

// import { createClient } from "../../../lib/server";
// import ReviewAction from "./ReviewAction";

// export default async function ReviewList({ productId }) {
//   const supabase = await createClient();

//   const [
//     { data: reviews },
//     {
//       data: { user },
//     },
//   ] = await Promise.all([
//     supabase
//       .from("reviews")
//       .select("*")
//       .eq("product_id", productId)
//       .order("created_at", { ascending: false }),
//     supabase.auth.getUser(),
//   ]);
//    const { user_metadata = {} } = user ?? {};
// const username = user_metadata.username || "User";



//   const hasReviewed = reviews?.some((review) => review.user_id === user?.id);

//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

//       {hasReviewed && (
//         <p className="mb-4 text-sm text-yellow-600">
//           You have already reviewed this product.
//         </p>
//       )}

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         {reviews?.length === 0 ? (
//           <p>No reviews yet. Be the first to review!</p>
//         ) : (
//           <div className="space-y-4">
//             {reviews?.map((review) => (
//               <div
//                 key={review.id}
//                 className="p-6 border rounded-lg shadow-sm bg-white"
//               >
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                   {username}
//                 </h1>{" "}
//                 <div className="flex items-center mb-2">
//                   <span className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <span
//                         key={i}
//                         className={
//                           i < review.rating
//                             ? "text-yellow-400"
//                             : "text-gray-300"
//                         }
//                       >
//                         ⭐
//                       </span>
//                     ))}
//                   </span>
//                   <span className="ml-2 text-sm text-gray-600">
//                     ({review.rating}/5)
//                   </span>
//                 </div>
//                 <p className="text-gray-900">{review.comment}</p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   {new Date(review.created_at).toLocaleDateString()}
//                 </p>
//                 {review.user_id === user?.id && (
//                   <ReviewAction review={review} />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use server";

import { createClient } from "../../../lib/server";
import ReviewAction from "./ReviewAction";

export default async function ReviewList({ productId }) {
  const supabase = await createClient();
;

  const [
    { data: reviews, error },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  console.log("reviews:", reviews);
  console.log("error:", error);

  const hasReviewed = reviews?.some((review) => review.user_id === user?.id);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {hasReviewed && (
        <p className="mb-4 text-sm text-yellow-600">
          You have already reviewed this product.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!reviews?.length ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 border rounded-lg shadow-sm bg-white">
                {/* ✅ review.username — each reviewer's own name saved at insert time */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {review.username || "Anonymous"}
                </h3>

                <div className="flex items-center mb-2">
                  <span className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                </div>

                <p className="text-gray-900">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>

                {review.user_id === user?.id && <ReviewAction review={review} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}