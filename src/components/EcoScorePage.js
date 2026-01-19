import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EcoScoreForm from "./EcoScoreForm";
import BarcodeScanner from "./BarcodeScanner";
import CommonResult from "./CommonResult";

export default function EcoScorePage() {
  const navigate = useNavigate();
  const [commonResult, setCommonResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Upload Ingredients Image
          </h2>
          <EcoScoreForm onResult={setCommonResult} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Scan Product Barcode
          </h2>
          <BarcodeScanner onResult={setCommonResult} />
        </div>
      </div>

      {/* ✅ COMMON RESULT (EXACT SAME UI) */}
      {commonResult && (
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Result</h2>

          <CommonResult result={commonResult} />
        </div>
      )}
    </div>
  );
}
