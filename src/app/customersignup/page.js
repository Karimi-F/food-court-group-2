"use client"

import { useState } from "react";
import { signIn, useSession } from "next-auth/react"

export default function Signup() {
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession()

  const handleChange = (e) => {
    setFormData({ ...formData, 
      [e.target.name]: e.target.value, });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";

    if (!formData.password1.trim()) newErrors.password1 = "Password is required";
    else if (formData.password1.length < 6) newErrors.password1 = "Password must be at least 6 characters";

    if (!formData.password2.trim()) newErrors.password2 = "Please confirm your password.";
    else if (formData.password1 !== formData.password2) newErrors.password2 = "Oops! The confirmation password does not match."
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Data:", formData);
      setSuccessMessage("Customer Signup successful! 🎉");
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
      })
      setFormData({ fullName: "", email: "", password1: "", password2: "" });
      setErrors({});
      // Call API here
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up As A Customer</h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700">Enter Password</label>
            <input
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password1 && <p className="text-red-500 text-sm">{errors.password1}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password2 && <p className="text-red-500 text-sm">{errors.password2}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/customerlogin" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}
