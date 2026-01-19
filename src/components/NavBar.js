// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import NavBarUser from "./NavBarUser";

// export default function NavBar(props) {
//   const isLoggedIn = !!localStorage.getItem("access_token");
//   if (isLoggedIn) {
//     return <NavBarUser AboutAccount="Your Details" />;
//   }

//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   // Fetch search suggestions
//   const fetchSuggestions = async (query) => {
//     if (query.length < 2) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/products/?search=${encodeURIComponent(
//           query
//         )}`
//       );
//       const data = await response.json();
//       setSuggestions(data.slice(0, 5)); // Show top 5 suggestions
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     }
//   };

//   // Debounce the suggestion fetch
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery) {
//         fetchSuggestions(searchQuery);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       props.onSearch(searchQuery);
//       setShowSuggestions(false);
//     }
//   };

//   return (
//     <header className="bg-[#131921] text-white px-6 py-4">

//       <nav className="flex items-center justify-between text-sm font-medium gap-4 flex-wrap">
//       <p className="font-bold text-xl">SustainaScan.</p>
//         {/* Left Section */}
//         <div className="flex items-center gap-4">
//           <Link to="/aboutUs" className="cursor-pointer hover:text-teal-500">
//             About
//           </Link>
//           <Link to="/contactUs" className="cursor-pointer hover:text-teal-500">
//             Contact Us
//           </Link>
//           <button
//             onClick={props.onEcoScoreClick}
//             className="flex items-center gap-2 border border-teal-500 text-teal-700 px-4 py-2 rounded-full hover:bg-teal-700 hover:text-white transition"
//           >
//             <span>Calculate EcoScore</span>
//           </button>
//         </div>

//         {/* Search Bar with Suggestions */}
//         <div className="relative flex items-center w-full max-w-md">
//           <form onSubmit={handleSearch} className="w-full">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search for a product"
//                 className="w-full px-4 py-2 text-gray-700 rounded-full focus:outline-none"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setShowSuggestions(true);
//                 }}
//                 onFocus={() => setShowSuggestions(true)}
//                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//               />
//               <button
//                 type="submit"
//                 className="absolute right-0 top-0 h-full px-4 text-white bg-teal-600 rounded-r-full hover:bg-teal-700"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </form>

//           {/* Suggestions Dropdown */}
//           {showSuggestions && suggestions.length > 0 && (
//             <div className="absolute top-full left-0 w-full mt-1 bg-white text-gray-800 shadow-lg rounded-md z-50">
//               <ul>
//                 {suggestions.map((product) => (
//                   <li
//                     key={product.id}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                     onMouseDown={() => {
//                       setSearchQuery(product.product_name);
//                       props.onSearch(product.product_name);
//                       setShowSuggestions(false);
//                     }}
//                   >
//                     {product.product_name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           <Link to="/login" className="hover:text-teal-600">
//             {props.AboutAccount}
//           </Link>
//           <Link to="/" className="flex items-center gap-1">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
//               />
//             </svg>
//             <span className="hover:text-teal-600">Cart</span>
//           </Link>
//           <Link to="/" className="hover:text-teal-600">
//             Orders
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBarUser from "./NavBarUser";

export default function NavBar(props) {
  // ✅ Hooks ALWAYS at top
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const isLoggedIn = !!localStorage.getItem("access_token");

  const navigate = useNavigate();
  // 🔐 Redirect handler for protected pages
  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };
  const isLoggedIn = !!localStorage.getItem("access_token");

  // 🔍 Fetch search suggestions
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
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn && searchQuery) {
      const timer = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isLoggedIn]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      props.onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // 🔥 CONDITIONAL RENDER (SAFE WAY)
  if (isLoggedIn) {
    return <NavBarUser AboutAccount="Your Details" />;
  }

  return (
    <header className="bg-[#131921] text-white px-6 py-4">
      <nav className="flex items-center justify-between text-sm font-medium gap-4 flex-wrap">
        <p className="font-bold text-xl">SustainaScan.</p>

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Link to="/aboutUs" className="hover:text-teal-500">
            About
          </Link>
          <Link to="/contactUs" className="hover:text-teal-500">
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
        <div className="relative flex items-center w-full max-w-md">
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              placeholder="Search for a product"
              className="w-full px-4 py-2 text-gray-700 rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white text-gray-800 shadow-lg rounded-md z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  // onMouseDown={() => {
                  //   setSearchQuery(product.product_name);
                  //   props.onSearch(product.product_name);
                  //   setShowSuggestions(false);
                  // }}
                  onMouseDown={() => {
                    setShowSuggestions(false);
                    navigate(`/products/${product.id}`);
                  }}
                  
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {product.product_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hover:text-teal-600">
            Sign Up/Sign In
          </Link>
          <button
            onClick={() => handleProtectedClick("/cart")}
            className="text-white hover:text-teal-600"
          >
            Cart
          </button>
          <button
            onClick={() => handleProtectedClick("/user-orders")}
            className="hover:text-teal-600"
          >
            Orders
          </button>
        </div>
      </nav>
    </header>
  );
}
