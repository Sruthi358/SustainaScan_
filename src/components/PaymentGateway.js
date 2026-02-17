import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SiGooglepay,
  SiPhonepe,
  SiPaytm,
  SiVisa,
  SiMastercard,
} from "react-icons/si";

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  // Get the total and cart items from location state
  const { total = "0.00", cartItems = [] } = location.state || {};

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    if (
      method === "card" &&
      (!cardDetails.name ||
        !cardDetails.number ||
        !cardDetails.expiry ||
        !cardDetails.cvv)
    ) {
      setError("Please fill all card details");
      return;
    }

    if (method === "upi" && !upiId) {
      setError("Please enter UPI ID");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/orders/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(total),
          payment_method: method,
          items: cartItems.map((item) => ({
            product: item.product.id, // Make sure this matches your Product model ID
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Payment failed");
      }

      const orderData = await response.json();
      navigate("/payment-success", { state: { order: orderData } });
    } catch (err) {
      setError(err.message);
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (

    <>
    <header className='bg-gray-800 text-white px-6 py-4'>
  <nav className='flex items-center justify-between text-sm font-medium gap-4 flex-wrap'>
    <ul className='ml-auto mr-8'>
      <li>
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

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Complete Your Payment
        </h2>

        {/* Payment Method Tabs */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setMethod("card")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              method === "card"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setMethod("upi")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              method === "upi"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            UPI / QR
          </button>
        </div>

        {/* Total */}
        <div className="text-center text-xl font-semibold text-gray-700">
          Total: ₹{total}
        </div>

        {/* Payment Icons */}
        <div className="flex justify-center gap-4 text-3xl text-teal-700">
          <SiGooglepay title="Google Pay" />
          <SiPhonepe title="PhonePe" />
          <SiPaytm title="Paytm" />
          <SiVisa title="Visa" />
          <SiMastercard title="Mastercard" />
        </div>

        {method === "card" && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={handleCardChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="number"
              placeholder="Card Number"
              maxLength="16"
              value={cardDetails.number}
              onChange={handleCardChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleCardChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                maxLength="4"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {method === "upi" && (
          <div className="flex flex-col items-center space-y-4">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=MerchantName&am=499"
              alt="UPI QR"
              className="w-40 h-40"
            />
            <input
              type="text"
              placeholder="Enter your UPI ID (e.g., yourname@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500">
              Scan QR or enter UPI ID above to pay
            </p>
          </div>
        )}

        {error && <div className="text-red-500 text-center">{error}</div>}

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className={`w-full text-center py-2 px-4 font-semibold text-white rounded-md ${
            isProcessing
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
    </>
  );
}
