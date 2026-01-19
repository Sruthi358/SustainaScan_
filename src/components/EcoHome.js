import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SmartNavbar from "./SmartNavbar";

export default function EcoHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((res) => setProducts(res.data.slice(0, 5)))
      .catch((err) => console.error(err));
  }, []);

  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    fetch(
      `https://content.guardianapis.com/search?tag=world/india&section=environment&order-by=newest&page-size=4&show-fields=thumbnail&api-key=5bc35e6a-6c92-4ec4-8932-6c9722fa1ecf`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.response?.results) {
          setLatestNews(data.response.results);
        }
      })
      .catch((err) => console.error("EcoHome news error:", err));
  }, []);

  return (
    <>
      {/* <NavBar/> */}
      {/* <EcoHomeNavBar/> */}
      <SmartNavbar onSearch={(q) => navigate(`/user-home?search=${q}`)} />

      <div className="min-h-screen bg-gray-50">
        {/* HERO SECTION */}
        <div className="relative h-[50vh] bg-[url('./images/forest6.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-white text-4xl md:text-3xl font-bold leading-tight">
              SHOP SMARTER, LIVE <span className="text-green-400">GREENER</span>
              ,<br />
              YOUR SUSTAINABLE JOURNEY
              <br />
              POWERED BY AI
            </h1>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/eco-home")}
                className="bg-orange-500 hover:bg-orange-600 text-sm text-white px-6 py-2 rounded-md font-semibold"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>

        {/* AI GATEWAY */}
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">OUR TOOLS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* ASK OUR AI */}
            <div
              onClick={() => navigate("/ask-ai")}
              className="bg-orange-500 cursor-pointer rounded-xl px-4 py-3 text-white shadow-md
                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 3l1.5 4.5L15 9l-4.5 1.5L9 15l-1.5-4.5L3 9l4.5-1.5L9 3Zm9 9l.75 2.25L21 15l-2.25.75L18 18l-.75-2.25L15 15l2.25-.75L18 12Z"
                  />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold">Ask our AI</h3>
                  <p className="text-[11px] opacity-90">
                    Smart answers for sustainable choices
                  </p>
                </div>
              </div>
            </div>

            {/* SCAN & LEARN */}
            <div
              onClick={() => navigate("/calculate-ecoscore")}
              className="bg-teal-500 cursor-pointer rounded-xl px-4 py-3 text-white shadow-md
                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7h3l2-3h8l2 3h3v12H3V7Zm9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
                  />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold">Scan & Learn</h3>
                  <p className="text-[11px] opacity-90">
                    Know what you consume using Barcode Scanner
                  </p>
                </div>
              </div>
            </div>

            {/* TRACK YOUR IMPACT */}
            <div
              onClick={() => navigate("/carbon-impact")}
              className="bg-green-600 cursor-pointer rounded-xl px-4 py-3 text-white shadow-md
                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 19h16M8 15v-4M12 15V9M16 15v-6"
                  />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold">Track your impact</h3>
                  <p className="text-[11px] opacity-90">
                    Measure your carbon footprint
                  </p>
                </div>
              </div>
            </div>

            {/* SUSTAINABILITY INSIGHTS */}
            <div
              onClick={() => navigate("/sus-news")}
              className="bg-blue-500 cursor-pointer rounded-xl px-4 py-3 text-white shadow-md
                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4h11M6 12h11M6 16h7"
                  />
                </svg>

                <div>
                  <h3 className="text-sm font-semibold">
                    Sustainability Insights
                  </h3>
                  <p className="text-[11px] opacity-90">
                    Insights that inspire sustainable living
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED PRODUCTS – SAME AS SCREENSHOT */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            FEATURED PRODUCTS{" "}
            <span
              onClick={() => navigate("/eco-home")}
              className="text-teal-600 pl-6 font-thin text-xs cursor-pointer hover:underline"
            >
              &gt; See more
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="h-32 bg-gray-100 rounded mb-3">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="h-full w-full object-cover rounded"
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-800">
                  {product.product_name}
                </h3>

                <p className="text-xs text-green-600 font-medium mt-1">
                  EcoScore ✓
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SUSTAINABILITY NEWS – EXACT STYLE */}
        <div className="max-w-6xl mx-auto px-6 mt-6 mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            SUSTAINABILITY NEWS
            <span
              onClick={() => navigate("/sus-news")}
              className="text-teal-600 pl-6 font-thin text-xs cursor-pointer hover:underline"
            >
              &gt; See more
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {latestNews.map((item) => (
              <a
                key={item.id}
                href={item.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-36 bg-gray-200">
                  {item.fields?.thumbnail && (
                    <img
                      src={item.fields.thumbnail}
                      alt={item.webTitle}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                    {item.webTitle}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.webPublicationDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}{" "}
                    • The Guardian
                  </p>

                  <p className="text-xs text-teal-600 mt-1">Read more →</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
