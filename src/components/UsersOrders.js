import React, { useState, useEffect } from "react";
import { format } from "date-fns/format";
import { Link } from "react-router-dom";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log("Orders data:", data); // Debug log
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  // return (
  //   <>
  //     <header className="bg-gray-800 text-white px-6 py-4">
  //       <nav className=" text-sm font-medium gap-4 flex-wrap">
  //         <ul className="ml-auto mr-8 flex items-center justify-between">
  //           <li>
  //             <Link to="/cart" className="hover:text-teal-700">
  //               Cart
  //             </Link>
  //           </li>
  //           <li>
  //             <Link to="/home-user" className="hover:text-teal-700">
  //               Home
  //             </Link>
  //           </li>
  //         </ul>
  //       </nav>
  //     </header>
  //     <div className="container mx-auto px-4 py-8 max-w-4xl">
  //       <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

  //       {orders.length === 0 ? (
  //         <p className="text-gray-600">You haven't placed any orders yet.</p>
  //       ) : (
  //         <div className="space-y-4">
  //           {orders.map((order) => (
  //             <div
  //               key={order.id}
  //               className="border rounded-lg p-4 shadow-sm bg-white"
  //             >
  //               <div className="flex justify-between items-start mb-3">
  //                 <div>
  //                   <h2 className="font-semibold text-lg">Order #{order.id}</h2>
  //                   <p className="text-sm text-gray-500">
  //                     {format(
  //                       new Date(order.created_at),
  //                       "MMMM d, yyyy - h:mm a"
  //                     )}
  //                   </p>
  //                 </div>
  //                 <div className="text-right">
  //                   <p className="font-semibold text-lg">
  //                     ₹{order.amount.toFixed(2)}
  //                   </p>
  //                   <span
  //                     className={`px-2 py-1 rounded text-xs ${
  //                       order.status === "Pending"
  //                         ? "bg-yellow-100 text-yellow-800"
  //                         : order.status === "Processing"
  //                         ? "bg-blue-100 text-blue-800"
  //                         : order.status === "Completed"
  //                         ? "bg-green-100 text-green-800"
  //                         : "bg-gray-100 text-gray-800"
  //                     }`}
  //                   >
  //                     {order.status}
  //                   </span>
  //                 </div>
  //               </div>

  //               <div className="border-t pt-3">
  //                 <h3 className="font-medium mb-2">Products:</h3>
  //                 <div className="space-y-2">
  //                   {order.items.map((item) => (
  //                     <div key={item.id} className="flex justify-between py-1">
  //                       <div>
  //                         <p className="font-medium">{item.product_name}</p>
  //                         <p className="text-sm text-gray-600">
  //                           Quantity: {item.quantity}
  //                         </p>
  //                       </div>
  //                       <p className="font-medium">
  //                         ₹{(item.price * item.quantity).toFixed(2)}
  //                       </p>
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
  
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4">
        <nav>
          <ul className="flex items-center justify-between text-sm font-medium">
            <li>
              <Link to="/cart" className="hover:text-teal-400">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/home-user" className="hover:text-teal-400">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
  
      {/* Main Content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
  
          {orders.length === 0 ? (
            <p className="text-gray-600 text-lg">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-xl p-6 shadow-md bg-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="font-semibold text-xl">
                        Order #{order.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(order.created_at),
                          "MMMM d, yyyy - h:mm a"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xl">
                        ₹{order.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Products:</h3>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
  
    </div>
  );
  
}
