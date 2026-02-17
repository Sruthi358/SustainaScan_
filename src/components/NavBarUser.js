import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBarUser(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();
  const handleEcoScoreClick = () => {
    navigate("/calculate-ecoscore"); // redirect to ecoscore page
  };
  return (
    <>
      <header className="bg-[#131921] text-white px-6 py-4 sticky top-0 z-20 w-full">
        <nav className="flex items-center justify-between text-sm font-medium gap-4 flex-wrap">
          <p className="font-bold text-xl">SustainaScan.</p>
          {/* Left Section: About, Contact, EcoScore */}
          <div className="flex items-center gap-4">
          <Link to="/" className="cursor-pointer hover:text-teal-500">
              Home
            </Link>
            <Link to="/aboutUs" className="cursor-pointer hover:text-teal-500">
              About
            </Link>
            <Link
              to="/contactUs"
              className="cursor-pointer hover:text-teal-500"
            >
              Contact Us
            </Link>
            <button
              className="flex items-center gap-2 border border-teal-500 text-teal-700 px-4 py-2 rounded-full hover:bg-teal-700 hover:text-white transition"
              onClick={handleEcoScoreClick}
            >
              <span>Calculate EcoScore</span>
            </button>
          </div>
          {/* Center: Search Bar */}
          <div className="flex items-center w-full max-w-md rounded-full bg-white shadow-inner">
            <input
              type="text"
              name="search"
              placeholder="Search for a product"
              className="w-full px-4 py-2 text-gray-700 focus:outline-none rounded-l-full"
            />
            <button className="bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 rounded-r-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
          {/* Right Section: Account, Cart, Orders */}
          <div className="flex items-center gap-4 relative">
            {/* chatpt said to change this to get dropdowm menu */}
            {/* Dropdown button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-teal-600 focus:outline-none"
              >
                {props.AboutAccount} &#11206;
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg top-full z-50">
                  <Link
                    to="/update-user-details"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Update Details
                  </Link>
                  <Link
                    to="/my-impact"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Impact Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      // Optional: Add logout logic here
                      localStorage.clear(); // example for token-based logout
                      window.location.href = "/login"; // redirect to login
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link to="/" className="flex items-center gap-1">
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
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </Link>
            <button
              onClick={() => navigate("/cart")}
              className="text-white hover:text-teal-600"
            >
              Cart
            </button>
            <button
              onClick={() => navigate("/user-orders")}
              className="text-white hover:text-teal-600"
            >
              Orders
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
