
import ReviewForm from "./ReviewForm";
import ReviewList from "./Display";
export default  async function ReviewsPage({ params }) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>

      <ReviewForm productId={id} />
      <ReviewList productId={id} />
    </div>
  );
}
