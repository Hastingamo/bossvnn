
import ReviewForm from "./ReviewForm";
import ReviewList from "./Display";
export default  async function ReviewsPage({ params }) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-8 bg-[#f2e0d0] dark:bg-[#1a0f08] min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Product Reviews</h1>

      <ReviewForm productId={id} />
      <ReviewList productId={id} />
    </div>
  );
}
