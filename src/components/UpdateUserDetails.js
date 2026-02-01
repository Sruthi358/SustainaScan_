// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function UpdateUserDetails() {
//   const [formData, setFormData] = useState({
//     username: "",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     q1: "",
//     a1: "",
//     q2: "",
//     a2: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/user-profile/",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             },
//           }
//         );
//         setFormData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//         setMessage("Failed to load user details.");
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put("http://localhost:8000/api/user-profile/", formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // 🔐 Update security questions
//       await axios.post(
//         "http://localhost:8000/setup_security_questions/",
//         {
//           user_id: localStorage.getItem("user_id"),
//           q1: formData.q1,
//           a1: formData.a1,
//           q2: formData.q2,
//           a2: formData.a2,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage("Details updated successfully!");
//     } catch (error) {
//       console.error("Error updating user details:", error.response);
//       setMessage("Failed to update details.");
//     }
//   };

//   if (loading)
//     return <div className="p-6 text-gray-700 text-center">Loading...</div>;

//   return (
//     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
//         <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//           Update Your Details
//         </h2>
//       </div>

//       <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-2xl">
//         {message && (
//           <div
//             className={`mb-4 p-4 rounded text-center text-sm ${
//               message.includes("successfully")
//                 ? "bg-green-100 border border-green-400 text-green-700"
//                 : "bg-red-100 border border-red-400 text-red-700"
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username and Full Name */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm/6 font-medium text-gray-900">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 disabled
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md bg-gray-100 border border-gray-400 px-3 py-1.5 text-base text-gray-900 sm:text-sm/6"
//               />
//             </div>
//             <div>
//               <label className="block text-sm/6 font-medium text-gray-900">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           {/* Email and Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm/6 font-medium text-gray-900">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//             <div>
//               <label className="block text-sm/6 font-medium text-gray-900">
//                 Phone
//               </label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-sm/6 font-medium text-gray-900">
//               Address
//             </label>
//             <textarea
//               name="address"
//               rows={3}
//               value={formData.address}
//               onChange={handleChange}
//               className="mt-2 block w-full rounded-md bg-white border border-gray-700 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
//             />
//           </div>

//           {/* Security Questions */}
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Update Security Questions
//             </h3>

//             {/* Question 1 */}
//             <div className="mb-4">
//               <select
//                 name="q1"
//                 value={formData.q1}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
//                 required
//               >
//                 <option value="">Select Question 1</option>
//                 <option value="sign">What is your Zodiac Sign?</option>
//                 <option value="city">What is your birth city?</option>
//                 <option value="school">What is your first school name?</option>
//                 <option value="sibling">How many siblings do you have?</option>
//                 <option value="friend">What is your bestfriend name?</option>
//                 <option value="mother">
//                   What is your mother’s first name?
//                 </option>
//               </select>

//               <input
//                 type="text"
//                 name="a1"
//                 placeholder="Answer"
//                 value={formData.a1}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
//                 required
//               />
//             </div>

//             {/* Question 2 */}
//             <div>
//               <select
//                 name="q2"
//                 value={formData.q2}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
//                 required
//               >
//                 <option value="">Select Question 2</option>
//                 <option value="sign">What is your Zodiac Sign?</option>
//                 <option value="city">What is your birth city?</option>
//                 <option value="school">What is your first school name?</option>
//                 <option value="sibling">How many siblings do you have?</option>
//                 <option value="friend">What is your bestfriend name?</option>
//                 <option value="mother">
//                   What is your mother’s first name?
//                 </option>
//               </select>

//               <input
//                 type="text"
//                 name="a2"
//                 placeholder="Answer"
//                 value={formData.a2}
//                 onChange={handleChange}
//                 className="mt-2 block w-full rounded-md border border-gray-700 px-3 py-1.5"
//                 required
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
//             >
//               Update Details
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateUserDetails() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    q1: "",
    a1: "",
    q2: "",
    a2: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // 1️⃣ Fetch basic user profile
        const response = await axios.get(
          "http://localhost:8000/api/user-profile/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        // setFormData((prev) => ({
        //   ...prev,
        //   ...response.data,
        // }));

        setFormData((prev) => ({
          ...prev,
          username: response.data.username || "",
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        }));
        

        // 2️⃣ Fetch saved security questions
        // const secRes = await axios.get(
        //   "http://localhost:8000/api/mfa/get-security-questions/",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //     },
        //   }
        // );
        const secRes = await axios.get(
          "http://localhost:8000/api/mfa/get-security-questions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        
        if (secRes.data.questions && secRes.data.questions.length === 2) {
          setFormData((prev) => ({
            ...prev,
            q1: secRes.data.questions[0].question_key,
            a1: secRes.data.questions[0].answer,
            q2: secRes.data.questions[1].question_key,
            a2: secRes.data.questions[1].answer,
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
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
      // 3️⃣ Update user profile
      await axios.put("http://localhost:8000/api/user-profile/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      // 4️⃣ Update security questions
      // await axios.post(
      //   "http://localhost:8000/api/mfa/setup-security/",
      //   {
      //     user_id: JSON.parse(localStorage.getItem("user"))?.id,
      //     q1: formData.q1,
      //     a1: formData.a1,
      //     q2: formData.q2,
      //     a2: formData.a2,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // await axios.post(
      //   "http://localhost:8000/api/mfa/setup-security/",
      //   {
      //     q1: formData.q1,
      //     a1: formData.a1,
      //     q2: formData.q2,
      //     a2: formData.a2,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      await axios.post(
        "http://localhost:8000/api/mfa/setup-security/",
        {
          q1: formData.q1,
          a1: formData.a1,
          q2: formData.q2,
          a2: formData.a2,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      

      setMessage("Details updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Failed to update details.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-700 text-center">Loading...</div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
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
          {/* Username + Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                disabled
                name="username"
                value={formData.username}
                className="mt-2 w-full rounded-md bg-gray-100 border px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border px-3 py-1.5"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border px-3 py-1.5"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border px-3 py-1.5"
            />
          </div>

          {/* Security Questions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Update Security Questions
            </h3>

            {/* Q1 */}
            <select
              name="q1"
              value={formData.q1}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-1.5"
              required
            >
              <option value="">Select Question 1</option>
              <option value="sign">What is your Zodiac Sign?</option>
              <option value="city">What is your birth city?</option>
              <option value="school">What is your first school name?</option>
              <option value="sibling">How many siblings do you have?</option>
              <option value="friend">What is your bestfriend name?</option>
              <option value="mother">What is your mother’s first name?</option>
            </select>

            <input
              name="a1"
              value={formData.a1}
              onChange={handleChange}
              placeholder="Answer"
              className="mt-2 w-full rounded-md border px-3 py-1.5"
              required
            />

            {/* Q2 */}
            <select
              name="q2"
              value={formData.q2}
              onChange={handleChange}
              className="mt-4 w-full rounded-md border px-3 py-1.5"
              required
            >
              <option value="">Select Question 2</option>
              <option value="sign">What is your Zodiac Sign?</option>
              <option value="city">What is your birth city?</option>
              <option value="school">What is your first school name?</option>
              <option value="sibling">How many siblings do you have?</option>
              <option value="friend">What is your bestfriend name?</option>
              <option value="mother">What is your mother’s first name?</option>
            </select>

            <input
              name="a2"
              value={formData.a2}
              onChange={handleChange}
              placeholder="Answer"
              className="mt-2 w-full rounded-md border px-3 py-1.5"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-teal-700 text-white py-2 font-semibold hover:bg-teal-600"
          >
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
}
