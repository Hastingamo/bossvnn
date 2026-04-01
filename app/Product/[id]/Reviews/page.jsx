"use server";
import ReviewForm from "./ReviewForm";
import ReviewList from "./Display";
import { useEffect } from "react";
export default async function ReviewsPage({ params }) {
    const { id } = params; 
    useEffect(() => {
        console.log("Product ID in ReviewsPage:", id);
    }, [id]);
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>
      <ReviewForm productId={params.id} />
      <ReviewList productId={params.id} />
    </div>
  );
}
