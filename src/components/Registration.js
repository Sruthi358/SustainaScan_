// // import React, { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";

// // const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// // export default function Registration() {
// //   const navigate = useNavigate();

// //   // const [security, setSecurity] = useState({
// //   //   q1: "color",
// //   //   a1: "",
// //   //   q2: "city",
// //   //   a2: "",
// //   // });
// //   const [security, setSecurity] = useState({
// //     q1: "sign",
// //     a1: "",
// //     q2: "city",
// //     a2: ""
// //   });

// //   const [formData, setFormData] = useState({
// //     username: "",
// //     full_name: "",
// //     email: "",
// //     mobile_number: "",
// //     city_state: "",
// //     password: "",
// //     confirmPassword: "",
// //   });

// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const validateForm = () => {
// //     if (!formData.username.match(/^[a-zA-Z0-9_]+$/)) {
// //       setError("Username can only contain letters, numbers and underscores");
// //       return false;
// //     }
// //     if (formData.password.length < 8) {
// //       setError("Password must be at least 8 characters");
// //       return false;
// //     }
// //     if (formData.password !== formData.confirmPassword) {
// //       setError("Passwords do not match");
// //       return false;
// //     }
// //     if (!security.a1 || !security.a2) {
// //       setError("Please answer both security questions");
// //       return false;
// //     }
// //     return true;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     if (!validateForm()) return;
// //     setIsLoading(true);

// //     try {
// //       const response = await fetch(`${API_BASE_URL}/api/register/`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           username: formData.username,
// //           email: formData.email,
// //           full_name: formData.full_name,
// //           mobile_number: formData.mobile_number,
// //           city_state: formData.city_state,
// //           password: formData.password,
// //           confirmPassword: formData.confirmPassword,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || "Registration failed");
// //       }

// //       await fetch(`${API_BASE_URL}/api/mfa/setup-security/`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           user_id: data.user_id,
// //           q1: security.q1,
// //           a1: security.a1,
// //           q2: security.q2,
// //           a2: security.a2,
// //         }),
// //       });

// //       setSuccess(true);
// //       setTimeout(() => navigate("/login"), 2000);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
// //       <div className="sm:mx-auto sm:w-full sm:max-w-md">
// //         <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
// //           Create a new account
// //         </h2>
// //       </div>

// //       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
// //         {error && (
// //           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
// //             {error}
// //           </div>
// //         )}

// //         {success && (
// //           <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
// //             Registration successful! Redirecting to login...
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {/* Username */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-900">
// //               Username
// //             </label>
// //             <input
// //               name="username"
// //               required
// //               value={formData.username}
// //               onChange={handleChange}
// //               className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //             />
// //           </div>

// //           {/* Name & Email */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium">Full Name</label>
// //               <input
// //                 name="full_name"
// //                 required
// //                 value={formData.full_name}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium">Email</label>
// //               <input
// //                 type="email"
// //                 name="email"
// //                 required
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //             </div>
// //           </div>

// //           {/* Mobile & City */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium">Mobile Number</label>
// //               <input
// //                 name="mobile_number"
// //                 required
// //                 value={formData.mobile_number}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium">City & State</label>
// //               <input
// //                 name="city_state"
// //                 required
// //                 value={formData.city_state}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //             </div>
// //           </div>

// //           {/* Passwords */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="relative">
// //               <label className="block text-sm font-medium">Password</label>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 name="password"
// //                 required
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="absolute right-3 top-9"
// //               >
// //                 👁️
// //               </button>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium">
// //                 Confirm Password
// //               </label>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 name="confirmPassword"
// //                 required
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //               />
// //             </div>
// //           </div>

// //           {/* Security Questions */}
// //           {/* <div className="space-y-4">
// //             <h3 className="font-semibold">Security Questions</h3>

// //             <select
// //               value={security.q1}
// //               onChange={(e) => setSecurity({ ...security, q1: e.target.value })}
// //               className="w-full rounded-md border px-3 py-2"
// //             >
// //               <option value="color">Favorite color</option>
// //               <option value="city">Birth city</option>
// //               <option value="school">First school</option>
// //               <option value="food">Favorite food</option>
// //               <option value="pet">Pet name</option>
// //               <option value="mother">Mother's first name</option>
// //             </select>

// //             <input
// //               placeholder="Answer 1"
// //               value={security.a1}
// //               onChange={(e) => setSecurity({ ...security, a1: e.target.value })}
// //               className="w-full rounded-md border px-3 py-2"
// //             />

// //             <select
// //               value={security.q2}
// //               onChange={(e) => setSecurity({ ...security, q2: e.target.value })}
// //               className="w-full rounded-md border px-3 py-2"
// //             >
// //               <option value="city">Birth city</option>
// //               <option value="color">Favorite color</option>
// //               <option value="school">First school</option>
// //               <option value="food">Favorite food</option>
// //               <option value="pet">Pet name</option>
// //               <option value="mother">Mother's first name</option>
// //             </select>

// //             <input
// //               placeholder="Answer 2"
// //               value={security.a2}
// //               onChange={(e) => setSecurity({ ...security, a2: e.target.value })}
// //               className="w-full rounded-md border px-3 py-2"
// //             />
// //           </div> */}

// //           {/* 🔐 Security Questions */}
// //           {/* <div className="space-y-6">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               Security Questions
// //             </h3>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Security Question 1
// //               </label>
// //               <select
// //                 value={security.q1}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, q1: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
// //               >
// //                 <option value="color">Favorite color</option>
// //                 <option value="city">Birth city</option>
// //                 <option value="school">First school</option>
// //                 <option value="food">Favorite food</option>
// //                 <option value="pet">Pet name</option>
// //                 <option value="mother">Mother's first name</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Answer
// //               </label>
// //               <input
// //                 type="text"
// //                 value={security.a1}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, a1: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Security Question 2
// //               </label>
// //               <select
// //                 value={security.q2}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, q2: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
// //               >
// //                 <option value="city">Birth city</option>
// //                 <option value="color">Favorite color</option>
// //                 <option value="school">First school</option>
// //                 <option value="food">Favorite food</option>
// //                 <option value="pet">Pet name</option>
// //                 <option value="mother">Mother's first name</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Answer
// //               </label>
// //               <input
// //                 type="text"
// //                 value={security.a2}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, a2: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-gray-900 focus:outline-2 focus:outline-teal-600"
// //                 required
// //               />
// //             </div>
// //           </div> */}

// //           {/* 🔐 Security Questions */}
// //           <div className="space-y-6">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               Security Questions
// //             </h3>

// //             {/* Question 1 */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Security Question 1
// //               </label>
// //               <select
// //                 value={security.q1}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, q1: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //                 required
// //               >
// //                 <option value="sign">What is your Zodiac Sign?</option>
// //                 <option value="city">What is your birth city?</option>
// //                 <option value="school">What is your first school name?</option>
// //                 <option value="sibling">How many siblings do you have?</option>
// //                 <option value="friend">What is your bestfriend name?</option>
// //                 <option value="mother">
// //                   What is your mother’s first name?
// //                 </option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Answer
// //               </label>
// //               <input
// //                 type="text"
// //                 value={security.a1}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, a1: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //                 required
// //               />
// //             </div>

// //             {/* Question 2 */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Security Question 2
// //               </label>
// //               <select
// //                 value={security.q2}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, q2: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //                 required
// //               >
// //                 <option value="sign">What is your Zodiac Sign?</option>
// //                 <option value="city">What is your birth city?</option>
// //                 <option value="school">What is your first school name?</option>
// //                 <option value="sibling">How many siblings do you have?</option>
// //                 <option value="friend">What is your bestfriend name?</option>
// //                 <option value="mother">
// //                   What is your mother’s first name?
// //                 </option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-900">
// //                 Answer
// //               </label>
// //               <input
// //                 type="text"
// //                 value={security.a2}
// //                 onChange={(e) =>
// //                   setSecurity({ ...security, a2: e.target.value })
// //                 }
// //                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
// //                 required
// //               />
// //             </div>
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className={`w-full rounded-md bg-teal-700 px-3 py-2 text-white font-semibold hover:bg-teal-600 ${
// //               isLoading ? "opacity-50 cursor-not-allowed" : ""
// //             }`}
// //           >
// //             {isLoading ? "Creating account..." : "Sign up"}
// //           </button>
// //         </form>

// //         <p className="mt-10 text-center text-sm text-gray-500">
// //           Already have an account?{" "}
// //           <Link
// //             to="/login"
// //             className="font-bold text-emerald-500 hover:text-teal-700"
// //           >
// //             Sign in
// //           </Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://localhost:8000";

// export default function Registration() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     full_name: "",
//     email: "",
//     mobile_number: "",
//     city_state: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [security, setSecurity] = useState({
//     q1: "sign",
//     a1: "",
//     q2: "city",
//     a2: "",
//   });

//   const [showA1, setShowA1] = useState(false);
//   const [showA2, setShowA2] = useState(false);

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return false;
//     }
//     if (!security.a1 || !security.a2) {
//       setError("Please answer both security questions");
//       return false;
//     }
//     if (security.q1 === security.q2) {
//       setError("Security questions must be different");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateForm()) return;
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/register/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error("Registration failed");

//       await fetch(`${API_BASE_URL}/api/mfa/setup-security/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: data.user_id,
//           q1: security.q1,
//           a1: security.a1,
//           q2: security.q2,
//           a2: security.a2,
//         }),
//       });

//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-full flex-col justify-center px-6 py-12">
//       <h2 className="text-center text-2xl font-bold">Create Account</h2>

//       {error && (
//         <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md mx-auto">
//         <input name="username" placeholder="Username" onChange={handleChange} required className="w-full border p-2" />
//         <input name="full_name" placeholder="Full Name" onChange={handleChange} required className="w-full border p-2" />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2" />
//         <input name="mobile_number" placeholder="Mobile Number" onChange={handleChange} required className="w-full border p-2" />
//         <input name="city_state" placeholder="City & State" onChange={handleChange} required className="w-full border p-2" />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2" />
//         <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required className="w-full border p-2" />

//         {/* 🔐 Security Questions */}
//         <h3 className="font-semibold mt-4">Security Questions</h3>

//         <select
//           value={security.q1}
//           onChange={(e) => setSecurity({ ...security, q1: e.target.value })}
//           className="w-full border p-2"
//         >
//           <option value="sign" disabled={security.q2 === "sign"}>Zodiac Sign</option>
//           <option value="city" disabled={security.q2 === "city"}>Birth City</option>
//           <option value="school" disabled={security.q2 === "school"}>First School</option>
//           <option value="sibling" disabled={security.q2 === "sibling"}>Siblings Count</option>
//           <option value="friend" disabled={security.q2 === "friend"}>Best Friend</option>
//           <option value="mother" disabled={security.q2 === "mother"}>Mother Name</option>
//         </select>

//         <div className="relative">
//           <input
//             type={showA1 ? "text" : "password"}
//             placeholder="Answer"
//             value={security.a1}
//             onChange={(e) => setSecurity({ ...security, a1: e.target.value })}
//             className="w-full border p-2 pr-10"
//           />
//           <button type="button" onClick={() => setShowA1(!showA1)} className="absolute right-3 top-2">👁️</button>
//         </div>

//         <select
//           value={security.q2}
//           onChange={(e) => setSecurity({ ...security, q2: e.target.value })}
//           className="w-full border p-2"
//         >
//           <option value="sign" disabled={security.q1 === "sign"}>Zodiac Sign</option>
//           <option value="city" disabled={security.q1 === "city"}>Birth City</option>
//           <option value="school" disabled={security.q1 === "school"}>First School</option>
//           <option value="sibling" disabled={security.q1 === "sibling"}>Siblings Count</option>
//           <option value="friend" disabled={security.q1 === "friend"}>Best Friend</option>
//           <option value="mother" disabled={security.q1 === "mother"}>Mother Name</option>
//         </select>

//         <div className="relative">
//           <input
//             type={showA2 ? "text" : "password"}
//             placeholder="Answer"
//             value={security.a2}
//             onChange={(e) => setSecurity({ ...security, a2: e.target.value })}
//             className="w-full border p-2 pr-10"
//           />
//           <button type="button" onClick={() => setShowA2(!showA2)} className="absolute right-3 top-2">👁️</button>
//         </div>

//         <button className="w-full bg-teal-700 text-white p-2" disabled={isLoading}>
//           {isLoading ? "Creating..." : "Register"}
//         </button>
//       </form>

//       <p className="text-center mt-4">
//         Already have an account? <Link to="/login" className="text-teal-600">Login</Link>
//       </p>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    mobile_number: "",
    city_state: "",
    password: "",
    confirmPassword: "",
  });

  const [security, setSecurity] = useState({
    q1: "sign",
    a1: "",
    q2: "city",
    a2: "",
  });

  const [showA1, setShowA1] = useState(false);
  const [showA2, setShowA2] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Registration failed");

      await fetch(`${API_BASE_URL}/api/mfa/setup-security/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: data.user_id,
          ...security,
        }),
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-700 focus:outline-2 focus:outline-teal-600";

  return (
    // <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    //   <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    //     <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
    //       Create your account
    //     </h2>
    //   </div>

    //   <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    //     {error && (
    //       <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    //         {error}
    //       </div>
    //     )}
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-12">
      <div className="w-full">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 w-full">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl mx-auto">
          {/* Row 1: Username | Full Name | Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ["Username", "username"],
              ["Full Name", "full_name"],
              ["Email", "email"],
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-900">
                  {label}
                </label>
                <div className="mt-2">
                  <input
                    name={name}
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Mobile | City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Mobile Number", "mobile_number"],
              ["City & State", "city_state"],
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-900">
                  {label}
                </label>
                <div className="mt-2">
                  <input
                    name={name}
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Password | Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 🔐 Security Questions */}
          <h3 className="text-sm font-semibold text-gray-900">
            Security Questions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Question 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Question 1
              </label>
              <select
                className={`${inputClass} mt-2`}
                value={security.q1}
                onChange={(e) =>
                  setSecurity({ ...security, q1: e.target.value })
                }
              >
                <option value="sign">Zodiac Sign</option>
                <option value="city">Birth City</option>
                <option value="school">First School</option>
                <option value="sibling">Siblings</option>
                <option value="friend">Best Friend</option>
                <option value="mother">Mother Name</option>
              </select>

              <div className="relative mt-3">
                <input
                  type={showA1 ? "text" : "password"}
                  placeholder="Answer"
                  className={inputClass}
                  onChange={(e) =>
                    setSecurity({ ...security, a1: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowA1(!showA1)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Question 2
              </label>
              <select
                className={`${inputClass} mt-2`}
                value={security.q2}
                onChange={(e) =>
                  setSecurity({ ...security, q2: e.target.value })
                }
              >
                <option value="sign">Zodiac Sign</option>
                <option value="city">Birth City</option>
                <option value="school">First School</option>
                <option value="sibling">Siblings</option>
                <option value="friend">Best Friend</option>
                <option value="mother">Mother Name</option>
              </select>

              <div className="relative mt-3">
                <input
                  type={showA2 ? "text" : "password"}
                  placeholder="Answer"
                  className={inputClass}
                  onChange={(e) =>
                    setSecurity({ ...security, a2: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowA2(!showA2)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  👁️
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          {/* <button
    type="submit"
    disabled={isLoading}
    className={`flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-teal-600 ${
      isLoading ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {isLoading ? "Creating..." : "Register"}
  </button> */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`rounded-md bg-teal-700 px-20 py-1.5 text-sm font-semibold text-white shadow hover:bg-teal-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
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