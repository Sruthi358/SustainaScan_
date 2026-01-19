import React from "react";
import { Link } from "react-router-dom";

export default function CommonResult({ result }) {
  if (!result) return null;

  console.log("COMMON RESULT:", result);

  /* ================= EXISTING BARCODE LOGIC (UNCHANGED) ================= */

  const product = result.product || (result.title ? result : null);
  const alternatives = result.alternatives || result.alternativeProducts || [];
  const ecoscore = product?.ecoscore || result.ecoscore;

  /* ❗ DO NOT REMOVE THIS (barcode safety) */
  if (!product && !result.success && result.type !== "image") return null;

  return (
    <div className="mt-6 border-t pt-4 max-w-5xl mx-auto">
      {/* ================= BARCODE RESULT (UNCHANGED) ================= */}
      {product && (
        <>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-40 object-contain mb-3"
            />
          )}

          <p>
            <b>Name:</b> {product.title}
          </p>
          <p>
            <b>Brand:</b> {product.brand}
          </p>
          <p>
            <b>Category:</b> {product.category}
          </p>

          <p className="mt-2 font-bold text-green-600">
            EcoScore: {ecoscore} / 100
          </p>

          {product.carbon_footprint !== undefined && (
            <>
              <p>Carbon Footprint: {product.carbon_footprint}</p>
              <p>Toxicity: {product.toxicity}</p>
              <p>Biodegradability: {product.biodegradability}</p>
            </>
          )}
        </>
      )}

      {/* ================= IMAGE UPLOAD RESULT (ADDED SAFELY) ================= */}
      {result.type === "image" && result.result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-xl font-bold text-center mb-2">
            EcoScore (Ingredients Analysis)
          </h3>

          <p className="text-center text-green-700 font-semibold text-lg">
            EcoScore: {result.result.ecoscore} / 100
          </p>

          {/* <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-medium">🌍 Carbon</p>
              <p>{result.result.cf_score}</p>
            </div>
            <div>
              <p className="font-medium">⚠️ Toxicity</p>
              <p>{result.result.toxicity_score}</p>
            </div>
            <div>
              <p className="font-medium">🌱 Biodegradability</p>
              <p>{result.result.bio_score}</p>
            </div>
          </div> */}
        </div>
      )}

      {/* ================= ALTERNATIVES (COMMON FOR BOTH) ================= */}
      <h3 className="text-xl font-bold mt-8 mb-6 text-center">
        Better Eco Alternatives
      </h3>

      {alternatives.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {alternatives.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-72 rounded-lg overflow-hidden"
            >
              <div className="aspect-[3/2] bg-gray-100">
                {/* 🔍 DEBUG: print image URL */}
                {/* <p className="text-xs text-red-500 break-all p-2">
                  {String(p.product_image)}
                </p> */}
                {p.product_image ? (
                  <img
                    src={
                      p.product_image.startsWith("http")
                        ? p.product_image
                        : `http://127.0.0.1:8000${p.product_image}`
                    }
                    className="w-full h-full object-cover"
                    alt={p.product_name}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-xl font-semibold">{p.product_name}</h3>

                <p className="text-green-600">
                  ₹{p.price?.toFixed(2) || "N/A"}
                </p>

                <p className="text-amber-600">
                  EcoScore: {p.ecoscore?.toFixed(1)} / 100
                </p>

                {/* Short Description */}
                {p.product_description && (
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {p.product_description.slice(0, 80)}...
                  </p>
                )}

                <Link
                  to={`/products/${p.id}`}
                  className="mt-3 inline-block px-5 py-2 rounded-lg text-sm font-medium border border-teal-500 text-teal-700 hover:bg-teal-700 hover:text-white"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No alternative products found.
        </p>
      )}
    </div>
  );
}
