import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [selectedProductType, setSelectedProductType] = useState("");

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

  // added for adding fucntionality
  // Add state for form data
  const [formData, setFormData] = useState({
    ingredients: "",
    productimage: null,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productimage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Automatically captures all inputs including files

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://localhost:8000/api/admin/add-products/",
        {
          method: "POST",
          body: formData, // Send as FormData
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert(`Product added! Eco-Score: ${result.ecoscore}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const productTypes = Object.keys(productCategories);
  //for logout functionality
  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("is_admin");
    window.location.href = "/login";
  };

  return (
    <>
      <header className="bg-gray-800 text-white px-6 py-4">
        <nav className="flex items-center justify-between text-sm font-medium gap-4 flex-wrap">
          <ul className="ml-auto mr-8">
            <li>
              <Link
                to="/login"
                className="hover:text-teal-700"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Add Products
          </h2>
        </div>
        <div className="mt-6 mx-16">
          <form
            action="#"
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <label
                  htmlFor="productname"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product Name
                </label>
                <input
                  id="productname"
                  name="productname"
                  type="text"
                  required
                  autoComplete="productname"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="producttype"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product type
                </label>
                <select
                  id="producttype"
                  name="producttype"
                  required
                  value={selectedProductType}
                  onChange={(e) => setSelectedProductType(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value="">Select a product type</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  disabled={!selectedProductType}
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                >
                  <option value="">
                    {selectedProductType
                      ? "Select a category"
                      : "First select product type"}
                  </option>
                  {selectedProductType &&
                    productCategories[selectedProductType].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="brandname"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Brand Name
                </label>
                <input
                  id="brandname"
                  name="brandname"
                  type="text"
                  required
                  autoComplete="brandname"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <label
                  htmlFor="productlink"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product Link
                </label>
                <input
                  id="productlink"
                  name="productlink"
                  type="text"
                  required
                  autoComplete="productlink"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="volume"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Volume
                </label>
                <input
                  id="volume"
                  name="volume"
                  type="text"
                  required
                  autoComplete="volume"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="chemicalfree"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Chemical Free
                </label>
                <input
                  id="chemicalfree"
                  name="chemicalfree"
                  type="text"
                  required
                  autoComplete="chemicalfree"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="packagingtype"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Packaging Type
                </label>
                <input
                  id="packagingtype"
                  name="packagingtype"
                  type="text"
                  required
                  autoComplete="packagingtype"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  autoComplete="price"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="instock"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Instock
                </label>
                <select
                  id="instock"
                  name="instock"
                  required
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="returnperiod"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Return Period
                </label>
                <input
                  id="returnperiod"
                  name="returnperiod"
                  type="text"
                  required
                  autoComplete="returnperiod"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="expirydate"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Expiry Date
                </label>
                <input
                  id="expirydate"
                  name="expirydate"
                  type="date"
                  required
                  autoComplete="expirydate"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div>
                <label
                  htmlFor="volume"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product description
                </label>
                <textarea
                  name="productdescription"
                  id="productdescription"
                  cols="143"
                  rows="3"
                  className="mt-2 py-1.5 rounded-md bg-white border border-gray-700"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="ingredients"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Ingredients
                </label>
                <input
                  id="ingredients"
                  name="ingredients"
                  type="text"
                  required
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="productimage"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Upload Image
                </label>
                <input
                  id="productimage"
                  name="productimage"
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm/6 file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-600"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:mx-auto sm:w-full sm:max-w-md"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
