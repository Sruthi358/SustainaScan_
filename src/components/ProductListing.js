import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../images/logo1.png";

const ProductListing = ({ searchTerm }) => {
  const navigate = useNavigate();

  // State for UI interactions
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // State for product data
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category structure
  const productCategories = {
    "Personal Care": [
      "Shampoo",
      "Conditioner",
      "Moisturizer",
      "Sunscreen",
      "Lip Balm",
      "Perfume",
      "Deodorant",
      "Hair Oil",
      "Face Wash",
      "Body Lotion",
      "Soap Bar",
    ],
    "Home & Kitchen": [
      "Cookware",
      "Cutlery",
      "Storage Containers",
      "Dinnerware",
      "Glass Bottles",
      "Lunch Boxes",
      "Home Decor",
      "Candles",
      "Food Items",
    ],
    "Cleaning Supplies": [
      "Dish Soap",
      "Laundry Detergent",
      "Surface Cleaner",
      "Scrubbers",
      "Sponges",
      "Trash Bags",
    ],
    "Bathroom Essentials": [
      "Toothpaste",
      "Toothbrush",
      "Towels",
      "Shower Curtains",
      "Bath Mats",
      "Soap Dispensers",
    ],
    "Kids & Pets": [
      "Baby Shampoo",
      "Diapers",
      "Pet Shampoo",
      "Toys",
      "Feeding Bottles",
      "Organic Snacks",
    ],
    Electronics: [
      "Solar Chargers",
      "Eco-Friendly Batteries",
      "LED Bulbs",
      "Energy-Efficient Fans",
    ],
  };

  // Fetch products based on search term and filters
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = "http://localhost:8000/api/products/";
      const params = new URLSearchParams();

      if (searchTerm) params.append("category", searchTerm);
      if (selectedCategory) params.append("product_type", selectedCategory);
      if (selectedSubcategory) params.append("category", selectedSubcategory);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSubcategory]);

  // Selection handlers
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secondary Navigation Bar */}
      <header className="bg-[#232f3e] top-0 z-20 w-full">
        <nav className="bg-gray-800 text-white relative z-10">
          <div className="flex items-center px-6 py-4 relative">
            <div className="w-40"></div>
            <ul className="flex gap-8 text-sm font-medium ml-1 pl-10">
              {Object.keys(productCategories).map((category) => (
                <li
                  key={category}
                  className="relative flex items-center gap-1 hover:text-teal-600 cursor-pointer px-3"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <span
                    onClick={() => handleCategorySelect(category)}
                    className="py-2"
                  >
                    {category}
                  </span>

                  {hoveredCategory === category && (
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white text-gray-800 shadow-lg rounded-b-md z-30">
                      <ul className="py-1">
                        {productCategories[category].map((subCategory) => (
                          <li
                            key={subCategory}
                            className="px-4 py-2 hover:bg-gray-100 hover:text-teal-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategorySelect(subCategory);
                            }}
                          >
                            {subCategory}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="absolute -bottom-20 left-6 z-20 pointer-events-none">
              <img src={logo1} alt="Logo" className="h-48" />
            </div>
          </div>
        </nav>
      </header>

      {/* Product Display Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Simple filter status - minimal design change */}
        <div className="mb-6">
          <div></div>
          <h2 className="text-xl text-gray-800 text-center font-bold">
            {searchTerm
              ? `Search Results for "${searchTerm}"`
              : selectedSubcategory
              ? `${selectedSubcategory}`
              : selectedCategory
              ? `${selectedCategory}`
              : "All Products"}
          </h2>
          {(selectedCategory || selectedSubcategory || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 flex float-right"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No products found for this selection.
            </p>
          </div>
        ) : (
          /* EXACT ProductCard grid layout from your original */
          <div className="flex flex-wrap justify-center gap-6 mt-10 mb-6 mx-20">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-72 max-w-sm rounded-lg overflow-hidden"
              >
                <div className="aspect-[3/2]">
                  {product.product_image ? (
                    <img
                      src={product.product_image}
                      className="w-full h-full object-cover"
                      alt={product.product_name}
                    />
                  ) : (
                    <svg
                      className="h-16 w-16 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-slate-900 text-xl font-semibold">
                    {product.product_name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-green-600">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-amber-600 font-medium">
                    EcoScore: {product.ecoscore?.toFixed(1) || "N/A"} / 100
                  </p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {product.product_description?.slice(0, 80)}...
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="mt-3 px-5 py-2 rounded-lg text-sm font-medium tracking-wider border border-teal-500 text-teal-700 hover:bg-teal-700 hover:text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
