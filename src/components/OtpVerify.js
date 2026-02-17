import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDeviceFingerprint } from "../services/deviceFingerprint";

const getAreaLocationWithCoords = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        location: "Hyderabad",
        latitude: null,
        longitude: null,
      });
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

          resolve({
            location: area + ", Hyderabad",
            latitude: lat,
            longitude: lon,
          });
        } catch {
          resolve({
            location: "Hyderabad",
            latitude: lat,
            longitude: lon,
          });
        }
      },
      () =>
        resolve({
          location: "Hyderabad",
          latitude: null,
          longitude: null,
        })
    );
  });
};

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const device = await getDeviceFingerprint();
      const locData = await getAreaLocationWithCoords();

      // await axios.post("http://192.168.29.173:8000/api/mfa/verify-otp/", {
      // await axios.post("http://localhost:8000/api/mfa/verify-otp/", {
      //   otp,
      //   user_id: state.user_id,
      //   device_fingerprint: device,
      //   location: locData.location,
      //   latitude: locData.latitude,
      //   longitude: locData.longitude,
      // });

      // if (state.level === "HIGH") {
      //   navigate("/security-questions", { state });
      // } else {
      //   navigate("/");
      // }
      const res = await axios.post(
        // "http://localhost:8000/api/mfa/verify-otp/",
        // "http://10.209.81.82:8000/api/mfa/verify-otp/",
        `${process.env.REACT_APP_PHONE_API_URL}/api/mfa/verify-otp/`,
        {
          otp,
          user_id: state.user_id,
          device_fingerprint: device,
          location: locData.location,
          latitude: locData.latitude,
          longitude: locData.longitude,
        }
      );

      /* ✅ STEP 2: STORE LOGIN SESSION */
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("is_admin", res.data.user.is_admin);

      /* ➡️ NEXT STEP */
      if (state.level === "HIGH") {
        navigate("/security-questions", { state });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          OTP Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the one-time password sent to your email
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={verify} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              One-Time Password
            </label>
            <div className="mt-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600"
                placeholder="Enter 6-digit OTP"
              />
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
