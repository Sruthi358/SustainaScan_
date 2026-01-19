import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateUserDetails() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user-profile/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage("Failed to load user details.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8000/api/user-profile/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });
      setMessage("Details updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error.response);
      setMessage("Failed to update details.");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-700 text-center">Loading...</div>;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Update Your Details
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-2xl">
        {message && (
          <div
            className={`mb-4 p-4 rounded text-center text-sm ${
              message.includes("successfully")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username and Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <input
                type="text"
                name="username"
                disabled
                value={formData.username}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-gray-100 border border-gray-400 px-3 py-1.5 text-base text-gray-900 sm:text-sm/6"
              />
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Update Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
