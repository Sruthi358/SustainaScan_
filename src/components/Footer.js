import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#131921] text-gray-300">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            Sustaina<span className="text-green-400">Scan</span>
          </h2>
          <p className="text-sm leading-relaxed">
            SustainaScan is an AI-powered sustainable shopping platform that
            helps users make eco-friendly decisions by analyzing product impact,
            EcoScore, and carbon footprint.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-teal-400">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-teal-400">Products</Link>
            </li>
            <li>
              <Link to="/aboutUs" className="hover:text-teal-400">About Us</Link>
            </li>
            <li>
              <Link to="/contactUs" className="hover:text-teal-400">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-teal-400 cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              Help Center
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: sustainascan@gmail.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Hyderabad, India</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SustainaScan. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Built with 💚 for a sustainable future
          </p>
        </div>
      </div>

    </footer>
  );
}
