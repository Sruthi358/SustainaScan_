import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBarSimple({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  // 🔐 Redirect handler for protected pages
  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Fetch search suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/?search=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSuggestions(data.slice(0, 5));
    } catch (error) {
      console.error("Suggestion fetch error:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) fetchSuggestions(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-[#131921] text-white px-6 py-2.5">
      <nav className="flex items-center justify-between gap-6 flex-wrap">
        {/* LOGO */}
        <p className="font-bold text-xl tracking-wide cursor-pointer">
          SustainaScan.
        </p>

        {/* LEFT LINKS */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/aboutUs" className="hover:text-teal-400">
            About
          </Link>
          <Link to="/contactUs" className="hover:text-teal-400">
            Contact Us
          </Link>

          <button
            className="flex items-center gap-2 border border-teal-500 text-teal-700 px-4 py-2 rounded-full hover:bg-teal-700 hover:text-white transition"
            onClick={() => handleProtectedClick("/calculate-ecoscore")}
          >
            <span>Calculate EcoScore</span>
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full max-w-md">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-4 py-2 text-gray-800 rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </form>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white text-gray-800 rounded-md shadow z-50">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onMouseDown={() => {
                    setShowSuggestions(false);
                    navigate(`/products/${item.id}`);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {item.product_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          {isLoggedIn ? (
            <span className="text-green-400 text-sm">Logged In</span>
          ) : (
            <Link to="/login" className="hover:text-teal-400">
              Sign Up / Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
