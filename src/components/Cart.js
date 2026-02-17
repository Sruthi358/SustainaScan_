import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultimage from "../images/defaultimage.png";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!accessToken || !userData) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/cart/items/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      console.log("Fetched cart items:", data);

      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [navigate]);

  const handleRemoveItem = async (itemId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/cart/items/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(err.message);
      if (
        err.message.includes("token") ||
        err.message.includes("authentication")
      ) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/cart/items/${itemId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      alert(err.message);
      if (
        err.message.includes("token") ||
        err.message.includes("authentication")
      ) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-teal-600 hover:underline"
        >
          Please login again
        </button>
      </div>
    );
  }

  return (
<>
    <header className='bg-gray-800 text-white px-6 py-4 mb-8'>
          <nav className='flex items-center justify-between text-sm font-medium gap-4 flex-wrap'>
              <ul className='ml-auto mr-8'>
                  <li>
                    {/* <Link to="/" className='hover:text-teal-700'>Back</Link> */}
                    <button
          onClick={() => navigate(-1)}
          className='hover:text-teal-700'
        >
          Back
        </button>
                  </li>
              </ul>
          </nav>
      </header>

    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* <Link
          to="/home-user"
          className="inline-block text-teal-600 hover:underline"
        >
          &larr; Back to products
        </Link> */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-8">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/product-listing"
              className="text-teal-600 hover:underline font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b last:border-b-0 p-4 flex flex-col sm:flex-row"
                    >
                      <div className="sm:w-1/4 flex justify-center mb-4 sm:mb-0">
                        <img
                          // src={item.product.product_image}
                          src={defaultimage}
                          alt={item.product.product_name}
                          className="h-32 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>

                      <div className="sm:w-3/4 sm:pl-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.product.product_name}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>

                        <p className="text-gray-600 mt-1">
                          {item.product.brand_name}
                        </p>
                        <p className="text-green-700 font-bold mt-2">
                          ₹{item.product?.price?.toFixed(2) ?? "0.00"}
                        </p>

                        <div className="mt-4 flex items-center">
                          <span className="mr-3 text-gray-700">Quantity:</span>
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal (
                        {cartItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        items)
                      </span>
                      <span className="font-medium">₹{calculateTotal()}</span>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-green-700">
                        ₹{calculateTotal()}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/payment-gateway", {
                          state: {
                            products: cartItems,
                            total: calculateTotal(),
                          },
                        })
                      }
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition mt-6"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
