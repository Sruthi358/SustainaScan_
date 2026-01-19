import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("eco");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleOnClickBuyNow = () => {
    if (product) {
      navigate("/payment-gateway", { state: { product } });
    } else {
      alert("Purchase link not available for this product.");
    }
  };

  const handleAddToCart = async () => {
    // Get the access token directly from localStorage where login stored it
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!accessToken || !userData) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      console.log("Using access token:", accessToken); // Debug log

      const response = await fetch(
        "http://localhost:8000/api/accounts/add-to-cart/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Use the directly stored token
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific JWT errors
        if (errorData.code === "token_not_valid") {
          alert("Session expired. Please login again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(
          errorData.detail || errorData.message || "Failed to add to cart"
        );
      }

      const data = await response.json();
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);

      // If it's an authentication error, clear storage
      if (
        error.message.includes("token") ||
        error.message.includes("authentication")
      ) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch product data
    fetch("http://localhost:8000/api/products/")
      .then((res) => {
        if (!res.ok) throw new Error(`List fetch failed: ${res.status}`);
        return res.json();
      })
      .then((all) => {
        const found = all.find((p) => String(p.id) === id);
        if (!found) {
          setError("Product not found.");
        } else {
          setProduct(found);
        }
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch reviews - updated version
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${id}/reviews/`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await response.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]); // Set empty array if fetch fails
      }
    };

    fetchReviews();

    // Check authentication
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${id}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            rating: parseInt(reviewForm.rating),
            comment: reviewForm.comment,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText.includes("<html")
            ? "Server error - check backend logs"
            : errorText
        );
      }

      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewModal(false);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const tabs = {
    eco: {
      title: "Why Eco Friendly?",
      content: `In today’s world, where climate change and environmental degradation are growing concerns, choosing eco-friendly products is more important than ever. Eco-friendly products are designed to minimize harm to the planet. They are made using sustainable practices, natural or recycled materials, and are often biodegradable or reusable, reducing waste and pollution.

      Traditional manufacturing methods consume vast amounts of energy and water, and often release harmful chemicals into the environment. In contrast, eco-friendly products focus on reducing carbon emissions, conserving natural resources, and promoting cleaner production methods. By supporting such products, consumers play a direct role in protecting ecosystems, improving air and water quality, and combating global warming.
      
      Additionally, eco-friendly products are safer for humans. They are usually free from toxic substances and are designed to last longer, which means fewer replacements and less waste over time. From packaging to end-of-life disposal, every aspect of an eco-conscious product is planned with sustainability in mind.
      
      Choosing eco-friendly is not just a trend—it’s a responsible lifestyle choice. It reflects a commitment to future generations and the health of our planet. Every eco-friendly product purchased is a step toward a cleaner, greener world.`,
    },
    description: {
      title: "Description",
      content: product?.product_description || "No description available.",
    },
    details: {
      title: "Product Details",
      content: (
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Product Type:</strong> {product?.product_type || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {product?.category || "N/A"}
          </p>
          <p>
            <strong>Brand Name:</strong> {product?.brand_name || "N/A"}
          </p>
          <p>
            <strong>Volume:</strong> {product?.volume || "N/A"}
          </p>
          <p>
            <strong>Chemical Free:</strong> {product?.chemical_free || "N/A"}
          </p>
          <p>
            <strong>In Stock:</strong> {product?.in_stock || "N/A"}
          </p>
          <p>
            <strong>Packaging Type:</strong> {product?.packaging_type || "N/A"}
          </p>
          <p>
            <strong>Return Period:</strong> {product?.return_period || "N/A"}
          </p>
          <p>
            <strong>Ingredients:</strong> {product?.ingredients_raw || "N/A"}
          </p>
        </div>
      ),
    },
    SustainaScan: {
      title: "Why Us?",
      content: `At SustainaScan, we believe that shopping should not come at the cost of the planet. That’s why our products are carefully designed with sustainability at their core — combining quality, responsibility, and innovation. When you choose us, you’re not just buying a product — you’re supporting a movement toward a cleaner, greener future.

      Every item we offer is made from eco-conscious materials, free from harmful chemicals, and sourced responsibly. Our commitment to low-impact manufacturing ensures that we reduce carbon emissions and waste at every stage of production. Whether it’s biodegradable packaging, reusable goods, or ethically sourced components, we go the extra mile to reduce environmental harm.
      
      We don’t believe in greenwashing — we believe in transparency. Our EcoScore rating system gives you clear insight into the environmental impact of each product, so you can make informed, planet-friendly choices. We also partner with certified suppliers who share our values of sustainability, fair labor, and zero cruelty.
      
      Customer satisfaction is our priority. Our products are not only safe, stylish, and durable, but also competitively priced so that sustainability is accessible to everyone. And with every purchase, you’re supporting our mission to drive eco-awareness through innovation and community.
      
      Choose SustainaScan — because protecting the planet starts with the choices we make every day. 🌍💚.`,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="mt-2">{error}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-teal-600 hover:underline"
        >
          &larr; Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Product Not Found</h2>
        <Link
          to="/"
          className="mt-4 inline-block text-teal-600 hover:underline"
        >
          &larr; Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= reviewForm.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        {/* Back link */}
        <div className="p-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-teal-600 hover:underline"
          >
            &larr; Back to products
          </button>
        </div>

        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-6 ml-7">
          {/* Left Box: Product Details */}
          <div className="lg:w-2/3 bg-white shadow-md rounded-lg overflow-hidden p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/2 p-4 rounded-lg flex items-center justify-center">
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-auto max-h-96 object-contain rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 uppercase">
                  {product.product_name}
                </h1>

                <div className="mt-2 flex items-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      product.in_stock
                        ? "bg-teal-100 text-teal-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="mt-4 text-green-900 text-2xl font-bold">
                  ₹{product.price.toFixed(2)}
                </p>

                <div className="mt-4 text-gray-700">
                  {product.product_description?.slice(0, 200)}...
                </div>

                {/* Quantity and Action buttons */}
                <div className="mt-auto pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 py-1">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-1 px-2 rounded-lg font-small transition"
                      >
                        Add to Cart
                      </button>
                      {/* <button
                        className="flex-1 border border-teal-600 hover:bg-teal-600 hover:text-white text-teal-600 py-1 px-2 rounded-lg font-small transition"
                        onClick={handleOnClickBuyNow}
                      >
                        Buy Now
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box: Metrics */}
          <div className="lg:w-1/3 flex flex-col gap-6 mr-7">
            {/* Product Metrics */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Product Sustainability Metrics
              </h2>
              {[
                ["Toxicity", 100 - (product.toxicity_score || 0)],
                ["Biodegradability", product.biodegradability_score || 0],
                ["Carbon Footprint", product.carbon_footprint || 0],
                ["EcoScore", product.ecoscore || 0],
              ].map(([label, pct]) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-teal-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 m-7 bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="flex space-x-4 mb-4 border-b">
            {Object.keys(tabs).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 px-4 font-semibold ${
                  activeTab === key
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {tabs[key].title}
              </button>
            ))}
          </div>

          <div className="text-gray-700 whitespace-pre-line text-justify px-5">
            {tabs[activeTab].content}
          </div>
        </div>

        {/* Reviews section */}
        <div className="my-6 bg-white shadow-md rounded-lg overflow-hidden p-6 mx-7">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">
            Reviews ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="font-semibold text-gray-800">
                      {review.username || "Anonymous"}
                    </div>
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          {i < review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 ml-auto">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No reviews yet. Be the first to review!
            </p>
          )}

          <div className="text-center py-8">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-medium transition uppercase"
            >
              {reviews.length > 0 ? "Write a Review" : "Be the First to Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
