import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import carbon1 from "../images/carbon1.png";
import carbon2 from "../images/carbon2.png";
import carbon3 from "../images/carbon3.png";
import carbon4 from "../images/carbon4.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CarbonImpactForm() {
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [breakdown, setBreakdown] = useState(null);

  const [formData, setFormData] = useState({
    electricity_units: "",
    bike_km: "",
    car_km: "",
    public_bus_km: "",
    public_auto_km: "",
    train_annual_km: "",
    cooking_fuel: "LPG",
    lpg_cylinders_per_month: "",
    uses_ac: false,
    eats_non_veg: false,
    uses_plastic_daily: false,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const averageValues = {
    electricity: 120,
    transport: 180,
    cooking: 60,
    lifestyle: 80,
  };

  const barData = breakdown && {
    labels: ["Electricity", "Transport", "Cooking", "Lifestyle"],
    datasets: [
      {
        label: "Average CO₂ (kg)",
        data: Object.values(averageValues),
        backgroundColor: "#9CA3AF",
      },
      {
        label: "Your CO₂ (kg)",
        data: Object.values(breakdown),
        backgroundColor: "#0F766E",
      },
    ],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      electricity_units: Number(formData.electricity_units || 0),
      bike_km: Number(formData.bike_km || 0),
      car_km: Number(formData.car_km || 0),
      public_bus_km: Number(formData.public_bus_km || 0),
      public_auto_km: Number(formData.public_auto_km || 0),
      train_annual_km: Number(formData.train_annual_km || 0),
      cooking_fuel: formData.cooking_fuel,
      lpg_cylinders_per_month: Number(formData.lpg_cylinders_per_month || 0),
      uses_ac: formData.uses_ac,
      eats_non_veg: formData.eats_non_veg,
      uses_plastic_daily: formData.uses_plastic_daily,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/carbon/calculate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error("Calculation failed");

      setResult(data.total_co2);
      setCategory(data.category);
      setSuggestions(data.suggestions);

      setBreakdown({
        electricity: data.electricity_co2,
        transport: data.transport_co2,
        cooking: data.cooking_co2,
        lifestyle: data.lifestyle_co2,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6">
        {/* LEFT IMAGE COLUMN */}
        <div className="space-y-6 lg:col-span-1 flex flex-col items-center">
          <img src={carbon1} className="w-64 h-72 object-cover shadow" />
          <img src={carbon2} className="w-64 h-72 object-cover shadow" />
          <img src={carbon3} className="w-64 h-72 object-cover shadow" />
          <img src={carbon4} className="w-64 h-72 object-cover shadow" />
        </div>

        {/* RIGHT FORM COLUMN */}
        <div className="lg:col-span-3 bg-gray-50 shadow">
          {/* FORM HEADER (ATTACHED TO FORM) */}
          <div className="bg-gray-800 text-white text-center py-2 text-base font-semibold">
            Start Calculating Your Carbon Footprint
          </div>

          <div className="p-8 bg-gray-130">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* ===== ELECTRICITY ===== */}
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Your Household Electricity Usage
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your total electricity consumption for the current month
                  (as shown in your electricity bill).
                </p>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="font-medium">Electricity Units</span>
                  <input
                    type="number"
                    name="electricity_units"
                    placeholder="Units (kWh)"
                    value={formData.electricity_units}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                  <span className="text-sm text-gray-500">
                    Units consumed this month
                  </span>
                </div>
              </section>

              {/* ===== PRIVATE TRANSPORT ===== */}
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Your Footprint when you Drive Around
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your average monthly distance travelled using private
                  vehicles.
                </p>

                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  <span className="font-medium">Bike</span>
                  <input
                    type="number"
                    name="bike_km"
                    placeholder="Distance"
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500">
                    Avg distance (km) per month
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="font-medium">Car</span>
                  <input
                    type="number"
                    name="car_km"
                    placeholder="Distance"
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500">
                    Avg distance (km) per month
                  </span>
                </div>
              </section>

              {/* ===== PUBLIC TRANSPORT ===== */}
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Your Footprint from Using Public Transport
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your average monthly distance for public transport. For
                  train, enter annual distance.
                </p>

                <div className="grid grid-cols-3 gap-4 items-center mb-3">
                  <span>Bus</span>
                  <input
                    type="number"
                    name="public_bus_km"
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500">km per month</span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center mb-3">
                  <span>Auto</span>
                  <input
                    type="number"
                    name="public_auto_km"
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500">km per month</span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <span>Train</span>
                  <input
                    type="number"
                    name="train_annual_km"
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500">km per year</span>
                </div>
              </section>

              {/* ===== COOKING ===== */}
              <section className="bg-gray-100 p-6 rounded">
                <h2 className="text-xl font-semibold mb-3">Cooking Fuel</h2>

                <p className="text-sm mb-3">
                  <strong>Approx values:</strong>
                  <br />1 LPG cylinder ≈ <strong>42 kg CO₂</strong>
                </p>

                <div className="mb-4">
                  <label className="block mb-1">Fuel Type</label>
                  <select
                    name="cooking_fuel"
                    onChange={handleChange}
                    className="border p-2 rounded w-1/2"
                  >
                    <option value="LPG">LPG</option>
                    <option value="Electric">Electric Stove</option>
                    <option value="Induction">Induction</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Cylinders used per month</label>
                  <input
                    type="number"
                    name="lpg_cylinders_per_month"
                    onChange={handleChange}
                    className="border p-2 rounded w-1/2"
                  />
                </div>
              </section>

              {/* ===== LIFESTYLE ===== */}
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Lifestyle Factors
                </h2>

                <div className="space-y-2">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="uses_ac"
                      onChange={handleChange}
                    />
                    Uses Air Conditioner regularly
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="eats_non_veg"
                      onChange={handleChange}
                    />
                    Consumes non-vegetarian food frequently
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="uses_plastic_daily"
                      onChange={handleChange}
                    />
                    Uses single-use plastic daily
                  </label>
                </div>
              </section>

              {/* ===== SUBMIT ===== */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-600"
                >
                  {loading ? "Calculating..." : "CALCULATE NOW!"}
                </button>
              </div>
            </form>

            {/* RESULTS / CHART / ANALYSIS – unchanged */}
            {result && (
              <div className="mt-6 p-4 bg-green-100 border border-green-400 text-center rounded">
                <h3 className="font-semibold text-lg">
                  Your Monthly Carbon Footprint
                </h3>
                <p className="text-2xl font-bold mt-2">{result} kg CO₂</p>
              </div>
            )}

            {category && (
              <div className="mt-4 text-center">
                <span
                  className={`px-4 py-1 rounded-full text-white font-semibold ${
                    category === "Low"
                      ? "bg-green-600"
                      : category === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {category} Impact
                </span>
              </div>
            )}

            {breakdown && (
              <div className="mt-10 p-6 bg-white border rounded">
                <Bar data={barData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
