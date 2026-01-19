import React from "react";
import {Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <>
      <header className="bg-gray-800 text-white px-6 py-4">
        <nav className=" text-sm font-medium gap-4 flex-wrap">
          <ul className="ml-auto mr-8 flex items-center justify-between">
            <li>
              <Link to="/user-orders" className="hover:text-teal-700">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/home-user" className="hover:text-teal-700">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="p-8 bg-white border border-green-400 rounded shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-700">Thank you for your purchase.</p>
        </div>
      </div>
    </>
  );
}
