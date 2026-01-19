import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 🔹 Images (same style as calculator page)
import carbon1 from "../images/carbon1.png";
import carbon2 from "../images/carbon2.png";
import carbon3 from "../images/carbon3.png";
import carbon4 from "../images/carbon4.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function MyImpactDashboard() {
  const [history, setHistory] = useState([]);
  const [trend, setTrend] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    Promise.all([
      fetch("http://localhost:8000/api/carbon/history/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8000/api/carbon/monthly-trend/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([historyRes, trendRes]) => {
        const historyData = await historyRes.json();
        const trendData = await trendRes.json();

        setHistory(historyData);
        setTrend(trendData);

        const total = historyData.reduce(
          (sum, item) => sum + item.total_co2,
          0
        );
        setTotalImpact(total);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading your impact data...
      </div>
    );
  }

  /* ================= LINE CHART DATA ================= */
  const lineData = {
    labels: trend.map((t) => t.label),
    datasets: [
      {
        label: "Monthly Carbon Footprint (kg CO₂)",
        data: trend.map((t) => t.value),
        borderColor: "#0F766E",
        backgroundColor: "#99F6E4",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-gray-100 py-10 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6">
        {/* ================= LEFT IMAGE COLUMN ================= */}
        <div className="space-y-6 lg:col-span-1 flex flex-col items-center">
          <img src={carbon1} className="w-64 h-72 object-cover shadow" />
          <img src={carbon2} className="w-64 h-72 object-cover shadow" />
          <img src={carbon3} className="w-64 h-72 object-cover shadow" />
          {/* <img src={carbon4} className="w-64 h-72 object-cover shadow" /> */}
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="lg:col-span-3 bg-gray-50 shadow">
          {/* HEADER */}
          <div className="bg-gray-800 text-white text-center py-2 text-base font-semibold">
            My Impact Dashboard
          </div>

          <div className="p-8">
            {/* ================= TOTAL IMPACT ================= */}
            <div className="mb-8 p-6 bg-green-100 border border-green-400 rounded text-center">
              <h2 className="text-xl font-semibold">
                Total Carbon Footprint Till Now
              </h2>
              <p className="text-3xl font-bold mt-2">
                {totalImpact.toFixed(2)} kg CO₂
              </p>
            </div>

            {/* ================= LINE CHART ================= */}
            <div className="mb-10 p-6 bg-white border rounded">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Monthly Carbon Footprint Trend
              </h3>
              <Line data={lineData} />
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">
                Month-wise Carbon Footprint Details
              </h3>

              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Month</th>
                    <th className="border p-2">Electricity (kg)</th>
                    <th className="border p-2">Transport (kg)</th>
                    <th className="border p-2">Cooking (kg)</th>
                    <th className="border p-2">Lifestyle (kg)</th>
                    <th className="border p-2 font-semibold">Total (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className="text-center border-t">
                      <td className="border p-2">
                        {item.month}/{item.year}
                      </td>
                      <td className="border p-2">{item.electricity_co2}</td>
                      <td className="border p-2">{item.transport_co2}</td>
                      <td className="border p-2">{item.cooking_co2}</td>
                      <td className="border p-2">{item.lifestyle_co2}</td>
                      <td className="border p-2 font-semibold">
                        {item.total_co2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
