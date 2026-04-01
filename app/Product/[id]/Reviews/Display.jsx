"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ReviewList({ productId }) {
  const cookieStore = await cookies(); 

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); 
        },
      },
    }
  );

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4 mt-6">
      {reviews?.map((review) => (
        <div key={review.id} className="border p-3 rounded">
          <p>⭐ {review.rating}/5</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}