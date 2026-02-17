// // import React, { useEffect, useRef, useState } from "react";
// // import { Html5Qrcode } from "html5-qrcode";
// // import { useNavigate } from "react-router-dom";

// // const BarcodeScanner = () => {
// //   console.log("✅ BarcodeScanner component rendered");  
// //   const navigate = useNavigate();
// //   const scannerRef = useRef(null);

// //   const [scanMode, setScanMode] = useState(null); // camera | upload
// //   const [barcodeImage, setBarcodeImage] = useState(null);
// //   const [product, setProduct] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   // ---------------- CAMERA SCAN ----------------
// //   useEffect(() => {
// //     if (scanMode !== "camera") return;

// //     const scanner = new Html5Qrcode("camera-scanner");

// //     scanner
// //       .start(
// //         { facingMode: "environment" },
// //         { fps: 10, qrbox: { width: 250, height: 100 } },
// //         (decodedText) => {
// //           scanner.stop();
// //           fetchProduct(decodedText);
// //           // fetchProduct("020714776114");
// //         }
// //       )
// //       .catch(() => setError("Camera access failed"));

// //     return () => {
// //       scanner.stop().catch(() => {});
// //     };
// //   }, [scanMode]);

// //   // ---------------- FETCH PRODUCT ----------------
// //   const fetchProduct = async (barcode) => {
// //     setLoading(true);
// //     setError("");
// //     setProduct(null);

// //     const formData = new FormData();
// //     formData.append("barcode", barcode);

// //     try {
// //       const res = await fetch(
// //         "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
// //         {
// //           method: "POST",
// //           body: formData,
// //         }
// //       );      

// //       const data = await res.json();
// //       console.log("RAW RESPONSE:", data);

// //       if (!data.success) throw new Error(data.message);

// //       setProduct(data.product);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ---------------- IMAGE UPLOAD ----------------
// //   const handleUploadScan = async () => {
// //     if (!barcodeImage) {
// //       setError("Please upload a barcode image");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");
// //     setProduct(null);

// //     const formData = new FormData();
// //     formData.append("barcode_image", barcodeImage);

// //     try {
// //       const res = await fetch(
// //         "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
// //         {
// //           method: "POST",
// //           body: formData,
// //         }
// //       );
      

// //       const data = await res.json();
// //       console.log("RAW RESPONSE:", data);
// //       if (!data.success) throw new Error(data.message);

// //       setProduct(data.product);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex justify-center items-center">
// //       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

// //         <h2 className="text-2xl font-bold text-center mb-4">
// //           Scan Product Barcode
// //         </h2>

// //         {/* <button
// //   onClick={() => {
// //     console.log("🔥 Hardcoded barcode test clicked");
// //     fetchProduct("020714776114");
// //   }}
// //   className="w-full bg-black text-white py-2 mb-4 rounded"
// // >
// //   TEST HARDCODED BARCODE
// // </button> */}


// //         {/* OPTIONS */}
// //         {!scanMode && (
// //           <div className="space-y-4">
// //             <button
// //               onClick={() => setScanMode("camera")}
// //               className="w-full bg-teal-600 text-white py-3 rounded-md"
// //             >
// //               📷 Scan using Camera
// //             </button>

// //             <button
// //               onClick={() => setScanMode("upload")}
// //               className="w-full border border-teal-600 text-teal-600 py-3 rounded-md"
// //             >
// //               🖼️ Upload Barcode Image
// //             </button>

// //             <button
// //               onClick={() => navigate("/")}
// //               className="w-full text-sm text-gray-500"
// //             >
// //               Back to Home
// //             </button>
// //           </div>
// //         )}

// //         {/* CAMERA VIEW */}
// //         {scanMode === "camera" && (
// //           <>
// //             <div id="camera-scanner" className="mt-4"></div>
// //             <button
// //               onClick={() => setScanMode(null)}
// //               className="mt-4 text-sm text-red-500"
// //             >
// //               Cancel
// //             </button>
// //           </>
// //         )}

// //         {/* IMAGE UPLOAD */}
// //         {scanMode === "upload" && (
// //           <>
// //             <input
// //               type="file"
// //               accept="image/*"
// //               onChange={(e) => setBarcodeImage(e.target.files[0])}
// //               className="mt-4"
// //             />
// //             <button
// //               onClick={handleUploadScan}
// //               className="mt-4 w-full bg-teal-600 text-white py-2 rounded-md"
// //             >
// //               Scan Image
// //             </button>
// //             <button
// //               onClick={() => setScanMode(null)}
// //               className="mt-2 text-sm text-red-500"
// //             >
// //               Cancel
// //             </button>
// //           </>
// //         )}

// //         {/* STATUS */}
// //         {loading && <p className="text-center mt-4">Scanning...</p>}
// //         {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

// //         {/* RESULT */}
// //         {product && (
// //           <div className="mt-6 border-t pt-4">
// //             <img
// //               src={product.image_url}
// //               alt={product.title}
// //               className="w-full h-40 object-contain mb-3"
// //             />
// //             <p><b>Name:</b> {product.title}</p>
// //             <p><b>Brand:</b> {product.brand}</p>
// //             <p><b>Category:</b> {product.category}</p>
// //             <p className="mt-2 font-bold text-green-600">
// //               EcoScore: {product.ecoscore} / 100
// //             </p>
// //             <p>Carbon Footprint: {product.carbon_footprint}</p>
// //             <p>Toxicity: {product.toxicity}</p>
// //             <p>Biodegradability: {product.biodegradability}</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BarcodeScanner;



// import React, { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useNavigate } from "react-router-dom";

// const BarcodeScanner = ({ onResult }) => {
//   const navigate = useNavigate();
//   const scannerRef = useRef(null);

//   const [scanMode, setScanMode] = useState(null);
//   const [barcodeImage, setBarcodeImage] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ---------------- CAMERA SCAN ----------------
//   useEffect(() => {
//     if (scanMode !== "camera") return;

//     const scanner = new Html5Qrcode("camera-scanner");

//     scanner
//       .start(
//         { facingMode: "environment" },
//         { fps: 10, qrbox: { width: 250, height: 100 } },
//         (decodedText) => {
//           scanner.stop();
//           fetchProduct(decodedText);
//         }
//       )
//       .catch(() => setError("Camera access failed"));

//     return () => {
//       scanner.stop().catch(() => {});
//     };
//   }, [scanMode]);

//   // ---------------- FETCH PRODUCT ----------------
//   const fetchProduct = async (barcode) => {
//     setLoading(true);
//     setError("");
//     setProduct(null);

//     const formData = new FormData();
//     formData.append("barcode", barcode);

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);

//       setProduct(data.product);
//       if (onResult) onResult(data.product); // ✅ SEND TO COMMON RESULT
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- IMAGE UPLOAD ----------------
//   const handleUploadScan = async () => {
//     if (!barcodeImage) {
//       setError("Please upload a barcode image");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setProduct(null);

//     const formData = new FormData();
//     formData.append("barcode_image", barcodeImage);

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);

//       setProduct(data.product);
//       if (onResult) onResult(data.product); // ✅ SEND TO COMMON RESULT
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {!scanMode && (
//         <div className="space-y-4">
//           <button
//             onClick={() => setScanMode("camera")}
//             className="w-full bg-teal-600 text-white py-3 rounded-md"
//           >
//             📷 Scan using Camera
//           </button>

//           <button
//             onClick={() => setScanMode("upload")}
//             className="w-full border border-teal-600 text-teal-600 py-3 rounded-md"
//           >
//             🖼️ Upload Barcode Image
//           </button>

//           <button
//             onClick={() => navigate("/")}
//             className="w-full text-sm text-gray-500"
//           >
//             Back to Home
//           </button>
//         </div>
//       )}

//       {scanMode === "camera" && (
//         <>
//           <div id="camera-scanner" className="mt-4"></div>
//           <button
//             onClick={() => setScanMode(null)}
//             className="mt-4 text-sm text-red-500"
//           >
//             Cancel
//           </button>
//         </>
//       )}

//       {scanMode === "upload" && (
//         <>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setBarcodeImage(e.target.files[0])}
//             className="mt-4"
//           />
//           <button
//             onClick={handleUploadScan}
//             className="mt-4 w-full bg-teal-600 text-white py-2 rounded-md"
//           >
//             Scan Image
//           </button>
//           <button
//             onClick={() => setScanMode(null)}
//             className="mt-2 text-sm text-red-500"
//           >
//             Cancel
//           </button>
//         </>
//       )}

//       {loading && <p className="text-center mt-4">Scanning...</p>}
//       {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
//     </div>
//   );
// };

// export default BarcodeScanner;


import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = ({ onResult }) => {
  const navigate = useNavigate();

  const [scanMode, setScanMode] = useState(null);
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- CAMERA SCAN ----------------
  useEffect(() => {
    if (scanMode !== "camera") return;

    const scanner = new Html5Qrcode("camera-scanner");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 100 } },
        (decodedText) => {
          scanner.stop();
          fetchProduct(decodedText);
        }
      )
      .catch(() => setError("Camera access failed"));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [scanMode]);

  // ---------------- FETCH PRODUCT ----------------
  const fetchProduct = async (barcode) => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("barcode", barcode);

    try {
      const res = await fetch(
        // "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
        // "http://10.209.81.82:8000/api/ecoscore/scan-barcode/",
        `${process.env.REACT_APP_PHONE_API_URL}/api/ecoscore/scan-barcode/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      console.log("FULL BARCODE RESPONSE:", data);

      // ✅ SEND PRODUCT DATA TO COMMON RESULT
      // if (onResult) onResult(data.product);
      if (onResult) {
        // onResult({
        //   ...data.product,
        //   alternatives: data.alternatives || []
        // });
        onResult({
          type: "barcode",
          product: data.product,
          alternatives: data.alternatives || []
        });
        
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleUploadScan = async () => {
    if (!barcodeImage) {
      setError("Please upload a barcode image");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("barcode_image", barcodeImage);

    try {
      const res = await fetch(
        // "http://127.0.0.1:8000/api/ecoscore/scan-barcode/",
        // "http://10.209.81.82:8000/api/ecoscore/scan-barcode/",
        `${process.env.REACT_APP_PHONE_API_URL}/api/ecoscore/scan-barcode/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      console.log("ALTERNATIVES:", data.alternatives);

      // ✅ SEND PRODUCT DATA TO COMMON RESULT
      // if (onResult) onResult(data.product);
      if (onResult) {
        onResult({
          type: "barcode",
          product: data.product,
          alternatives: data.alternatives || []
        });
        
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!scanMode && (
        <div className="space-y-4">
          <button
            onClick={() => setScanMode("camera")}
            className="w-full bg-teal-600 text-white py-3 rounded-md"
          >
            📷 Scan using Camera
          </button>

          <button
            onClick={() => setScanMode("upload")}
            className="w-full border border-teal-600 text-teal-600 py-3 rounded-md"
          >
            🖼️ Upload Barcode Image
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-sm text-gray-500"
          >
            Back to Home
          </button>
        </div>
      )}

      {scanMode === "camera" && (
        <>
          <div id="camera-scanner" className="mt-4"></div>
          <button
            onClick={() => setScanMode(null)}
            className="mt-4 text-sm text-red-500"
          >
            Cancel
          </button>
        </>
      )}

      {scanMode === "upload" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBarcodeImage(e.target.files[0])}
            className="mt-4"
          />
          <button
            onClick={handleUploadScan}
            className="mt-4 w-full bg-teal-600 text-white py-2 rounded-md"
          >
            Scan Image
          </button>
          <button
            onClick={() => setScanMode(null)}
            className="mt-2 text-sm text-red-500"

          >
            Cancel
          </button>
        </>
      )}

      {loading && <p className="text-center mt-4">Scanning...</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default BarcodeScanner;
