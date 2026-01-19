import React, { useState } from "react";
import logo1 from "../images/logo1.png";

export default function SecondaryNavBar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

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

  return (
    <>
      <header className="bg-[#232f3e]">
        <nav className="bg-gray-800 text-white relative z-10">
          
          <div className="flex items-center px-6 py-4 relative">
            {/* Spacer so logo doesn't overlap menu */}
            <div className="w-40"></div>
            {/* Navigation menu */}
            <ul className="flex gap-8 text-sm font-medium ml-1 pl-10">
              {Object.keys(productCategories).map((category) => (
                <li
                  key={category}
                  className="relative flex items-center gap-1 hover:text-teal-600 cursor-pointer px-3"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category}
                  {/* Dropdown for hovered category */}
                  {hoveredCategory === category && (
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white text-gray-800 shadow-lg rounded-b-md z-30">
                      <ul className="py-1">
                        {productCategories[category].map((subCategory) => (
                          <li
                            key={subCategory}
                            className="px-4 py-2 hover:bg-gray-100 hover:text-teal-600"
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
            {/* Logo (hanging below navbar) */}
            <div className="absolute -bottom-20 left-6 z-20 pointer-events-none">
              <img src={logo1} alt="Logo" className="h-48" />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
