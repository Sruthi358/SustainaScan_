import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10 mb-6 mx-20">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-72 max-w-sm rounded-lg overflow-hidden"
        >
          <div className="aspect-[3/2]">
            <img
              src={product.product_image}
              className="w-full h-full object-cover"
              alt={product.product_name}
            />
          </div>
          <div className="p-3">
            <h3 className="text-slate-900 text-xl font-semibold">
              {product.product_name}
            </h3>

            {/* Price */}
            <p className="mt-2 text-sm font-medium text-green-600">
              ₹{product.price.toFixed(2)}
            </p>

            {/* Ecoscore */}
            <p className="mt-1 text-sm text-amber-600 font-medium">
              Carbon Footprint: {product.ecoscore.toFixed(1)} Kg of CO2
            </p>

            {/* Short Description */}
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {product.product_description?.slice(0, 80)}...
            </p>

            {/* View Button */}
            <button
              type="button"
              className="mt-3 px-5 py-2 rounded-lg text-sm font-medium tracking-wider border border-teal-500 text-teal-700 hover:bg-teal-700 hover:text-white"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
