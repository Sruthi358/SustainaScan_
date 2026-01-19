import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getDeviceFingerprint } from "../services/deviceFingerprint";

/* 🔹 Get area-level location dynamically */
const getAreaLocation = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("Hyderabad");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();

          const area =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.village ||
            data.address.city ||
            "Hyderabad";

          resolve(area + ", Hyderabad");
        } catch {
          resolve("Hyderabad");
        }
      },
      () => resolve("Hyderabad")
    );
  });
};

export default function AuthLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const device = await getDeviceFingerprint();
      const location = await getAreaLocation();

      const res = await axios.post(
        "http://192.168.29.173:8000/api/mfa/login/",
        {
          username,
          password,
          device_fingerprint: device,
          location,
        }
      );

      /**
       * 🔹 CASE 1: MFA SUCCESS (NO OTP)
       * Backend MUST return:
       * access, refresh, user
       */
      if (res.data.status === "SUCCESS") {
        const { access, refresh, user } = res.data;

        // ✅ SESSION MANAGEMENT (OLD LOGIN STYLE)
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("is_admin", user.is_admin);

        if (user.is_admin) {
          navigate("/admin/add-products", { replace: true });
        } else {
          navigate(-1); // or "/home-user"
        }
      } else if (res.data.status === "OTP_REQUIRED") {

      /**
       * 🔹 CASE 2: OTP REQUIRED
       * Do NOT store tokens yet
       */
        navigate("/otp", { state: res.data });
      }
    } catch (err) {
      const data = err.response?.data;

      if (data?.status === "INVALID_CREDENTIALS") {
        setError(data.error);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Secure Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600"
              />
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-teal-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/registration"
            className="font-bold text-emerald-500 hover:text-teal-700"
          >
            Sign-Up
          </Link>
        </p>
      </div>
    </div>
  );
}
