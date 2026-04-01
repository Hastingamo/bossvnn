import { createClient } from "@/app/lib/server";

export default async function ReviewList({ productId }) {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {reviews?.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="p-6 border rounded-lg shadow-sm bg-white">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}