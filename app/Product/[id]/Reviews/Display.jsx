
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
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Reviews</h2>

      {hasReviewed && (
        <p className="mb-4 text-sm text-yellow-600 dark:text-yellow-400">
          You have already reviewed this product.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!reviews?.length ? (
          <p className="dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
                {/* ✅ review.username — each reviewer's own name saved at insert time */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {review.username}
                </h3>

                <div className="flex items-center mb-2">
                  <span className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>
                        ⭐
                      </span>
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({review.rating}/5)</span>
                </div>

                <p className="text-gray-900 dark:text-gray-300">{review.comment}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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