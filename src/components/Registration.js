import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Registration() {
  const navigate = useNavigate();

  // const [security, setSecurity] = useState({
  //   q1: "color",
  //   a1: "",
  //   q2: "city",
  //   a2: "",
  // });
  const [security, setSecurity] = useState({
    q1: "sign",
    a1: "",
    q2: "city",
    a2: ""
  });
  

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    mobile_number: "",
    city_state: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username.match(/^[a-zA-Z0-9_]+$/)) {
      setError("Username can only contain letters, numbers and underscores");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!security.a1 || !security.a2) {
      setError("Please answer both security questions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
          city_state: formData.city_state,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await fetch(`${API_BASE_URL}/api/mfa/setup-security/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: data.user_id,
          q1: security.q1,
          a1: security.a1,
          q2: security.q2,
          a2: security.a2,
        }),
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
            />
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
            </div>
          </div>

          {/* Mobile & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                name="mobile_number"
                required
                value={formData.mobile_number}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City & State</label>
              <input
                name="city_state"
                required
                value={formData.city_state}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9"
              >
                👁️
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
              />
            </div>
          </div>

          {/* Security Questions */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold">Security Questions</h3>

            <select
              value={security.q1}
              onChange={(e) => setSecurity({ ...security, q1: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="color">Favorite color</option>
              <option value="city">Birth city</option>
              <option value="school">First school</option>
              <option value="food">Favorite food</option>
              <option value="pet">Pet name</option>
              <option value="mother">Mother's first name</option>
            </select>

            <input
              placeholder="Answer 1"
              value={security.a1}
              onChange={(e) => setSecurity({ ...security, a1: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />

            <select
              value={security.q2}
              onChange={(e) => setSecurity({ ...security, q2: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="city">Birth city</option>
              <option value="color">Favorite color</option>
              <option value="school">First school</option>
              <option value="food">Favorite food</option>
              <option value="pet">Pet name</option>
              <option value="mother">Mother's first name</option>
            </select>

            <input
              placeholder="Answer 2"
              value={security.a2}
              onChange={(e) => setSecurity({ ...security, a2: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />
          </div> */}

          {/* 🔐 Security Questions */}
          {/* <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Security Questions
            </h3>

            
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Security Question 1
              </label>
              <select
                value={security.q1}
                onChange={(e) =>
                  setSecurity({ ...security, q1: e.target.value })
                }
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
              >
                <option value="color">Favorite color</option>
                <option value="city">Birth city</option>
                <option value="school">First school</option>
                <option value="food">Favorite food</option>
                <option value="pet">Pet name</option>
                <option value="mother">Mother's first name</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Answer
              </label>
              <input
                type="text"
                value={security.a1}
                onChange={(e) =>
                  setSecurity({ ...security, a1: e.target.value })
                }
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
                required
              />
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Security Question 2
              </label>
              <select
                value={security.q2}
                onChange={(e) =>
                  setSecurity({ ...security, q2: e.target.value })
                }
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
              >
                <option value="city">Birth city</option>
                <option value="color">Favorite color</option>
                <option value="school">First school</option>
                <option value="food">Favorite food</option>
                <option value="pet">Pet name</option>
                <option value="mother">Mother's first name</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Answer
              </label>
              <input
                type="text"
                value={security.a2}
                onChange={(e) =>
                  setSecurity({ ...security, a2: e.target.value })
                }
                className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
                required
              />
            </div>
          </div> */}

          {/* 🔐 Security Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Security Questions
            </h3>

            {/* Question 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Security Question 1
              </label>
              <select
                value={security.q1}
                onChange={(e) =>
                  setSecurity({ ...security, q1: e.target.value })
                }
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
                required
              >
                <option value="sign">What is your Zodiac Sign?</option>
                <option value="city">What is your birth city?</option>
                <option value="school">What is your first school name?</option>
                <option value="sibling">How many siblings do you have?</option>
                <option value="friend">What is your bestfriend name?</option>
                <option value="mother">
                  What is your mother’s first name?
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Answer
              </label>
              <input
                type="text"
                value={security.a1}
                onChange={(e) =>
                  setSecurity({ ...security, a1: e.target.value })
                }
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
                required
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Security Question 2
              </label>
              <select
                value={security.q2}
                onChange={(e) =>
                  setSecurity({ ...security, q2: e.target.value })
                }
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
                required
              >
                <option value="sign">What is your Zodiac Sign?</option>
                <option value="city">What is your birth city?</option>
                <option value="school">What is your first school name?</option>
                <option value="sibling">How many siblings do you have?</option>
                <option value="friend">What is your bestfriend name?</option>
                <option value="mother">
                  What is your mother’s first name?
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Answer
              </label>
              <input
                type="text"
                value={security.a2}
                onChange={(e) =>
                  setSecurity({ ...security, a2: e.target.value })
                }
                className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-md bg-teal-700 px-3 py-2 text-white font-semibold hover:bg-teal-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-emerald-500 hover:text-teal-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
