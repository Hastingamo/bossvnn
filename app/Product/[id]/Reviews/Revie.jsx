
import ReviewForm from "./ReviewForm";

export default  async function Revie({ params }) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Product Reviews</h1>

      <ReviewForm productId={id} />
      {/* <ReviewList productId={id} /> */}
    </div>
  );
}
