import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EcoScoreForm({ onResult }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alternativeProducts, setAlternativeProducts] = useState([]);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
    else setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) return null;

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlternativeProducts([]);

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("image", productImage);

    try {
      // const response = await fetch("http://localhost:8000/api/ecoscore/", {
      // const response = await fetch("http://10.209.81.82:8000/api/ecoscore/", {
      const response = await fetch(`${process.env.REACT_APP_PHONE_API_URL}/api/ecoscore/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "EcoScore failed");
      }

      // 📌 FETCH ALTERNATIVES
      const alternatives = await fetchAlternatives(productName);

      // ✅ SEND COMPLETE RESULT TO PARENT
      if (onResult) {
        onResult({
          type: "image",
          result: data,
          alternatives: alternatives || [],
        });
      }
    } catch (err) {
      if (onResult) {
        onResult({
          success: false,
          error: err.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- FETCH ALTERNATIVES ----------------
  const fetchAlternatives = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/?category=${encodeURIComponent(
          name.trim()
        )}`
      );

      if (!response.ok) return [];

      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || [];

      return products.slice(0, 5);
    } catch {
      return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <input
          type="text"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Upload Ingredients Image</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setProductImage(e.target.files[0])}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-700 text-white py-2 rounded"
      >
        {isSubmitting ? "Calculating..." : "Calculate EcoScore"}
      </button>
    </form>
  );
}
