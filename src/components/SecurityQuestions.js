import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SecurityQuestions() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    city: "",
    color: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post("http://192.168.29.173:8000/api/mfa/verify-questions/", {
        user_id: state.user_id,
        city: answers.city,
        color: answers.color,
      });

      navigate("/eco-home");
    } catch {
      setError("Incorrect answers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Security Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Answer the security questions to continue
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Birth City */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Birth City
            </label>
            <div className="mt-2">
              <input
                type="text"
                required
                value={answers.city}
                onChange={(e) =>
                  setAnswers({ ...answers, city: e.target.value })
                }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600"
                placeholder="Enter your birth city"
              />
            </div>
          </div>

          {/* Favorite Color */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Favorite Color
            </label>
            <div className="mt-2">
              <input
                type="text"
                required
                value={answers.color}
                onChange={(e) =>
                  setAnswers({ ...answers, color: e.target.value })
                }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600"
                placeholder="Enter your favorite color"
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
              {isLoading ? "Verifying..." : "Verify Answers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
