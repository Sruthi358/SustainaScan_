import React, { useEffect, useState } from "react";

export default function SustainabilityNews() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("sustainability");

  const API_KEY = "5bc35e6a-6c92-4ec4-8932-6c9722fa1ecf";

  const categories = [
    { label: "All", value: "sustainability" },
    { label: "Climate", value: "climate change" },
    { label: "Plastic", value: "plastic pollution" },
    { label: "Energy", value: "renewable energy" },
    { label: "Forest", value: "forest conservation" },
    { label: "Deforestation", value: "deforestation" },
  ];

  const fetchNews = async (pageNo, selectedCategory) => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://content.guardianapis.com/search?tag=world/india|environment/environment&q=${encodeURIComponent(
          selectedCategory
        )}&order-by=newest&show-fields=thumbnail,trailText&page-size=12&page=${pageNo}&api-key=${API_KEY}`
      );

      const data = await res.json();

      // ⏳ Artificial delay (2–3 seconds)
      setTimeout(() => {
        if (data.response && data.response.results.length > 0) {
          setNews((prev) =>
            pageNo === 1
              ? data.response.results
              : [...prev, ...data.response.results]
          );
        } else {
          setHasMore(false);
        }
        setLoading(false);
      }, 2500); // 2.5 seconds delay
    } catch (err) {
      console.error("Guardian fetch error:", err);
      setError(true);
      setLoading(false);
    }
  };

  // Initial & category change
  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1, category);
  }, [category]);

  // Pagination
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, category);
    }
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (error) {
    return (
      <p className="text-center text-sm text-red-500 mt-6">
        Unable to load sustainability news.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 mt-16 pb-16">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        SUSTAINABILITY NEWS
      </h2>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 text-xs rounded-full border transition ${
              category === cat.value
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* NEWS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {news.map((item) => (
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
                {new Date(item.webPublicationDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                • The Guardian
              </p>

              <p className="text-xs text-teal-600 mt-1">Read more →</p>
            </div>
          </a>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* END */}
      {!hasMore && (
        <p className="text-center text-sm text-gray-400 mt-8">
          No more news to load
        </p>
      )}
    </div>
  );
}
