"use client"

import { useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    outletName: "",
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

    if (!formData.outletName.trim()) newErrors.outletName = "Outlet name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccessMessage("Outlet Added successful! 🎉");
      const signInResult = await signIn("credentials", {
        redirect: false,
        outletName: formData.outletName
      })
      setFormData({ outletName: ""});
      setErrors({});
      // Call API here
    }
  };

  const handleAddMenu = () => {
    router.push("/addmenu");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Outlet</h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Outlet Name */}
          <div>
            <label className="block text-gray-700">Outlet Name</label>
            <input
              type="text"
              name="outletName"
              value={formData.outletName}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.outletName && <p className="text-red-500 text-sm">{errors.outletName}</p>}
          </div>
 {/** 
             * The owner must be logged in first before they can add an outlet.
             * Therefore the outlet addition will use the owner id that is in session.
             */}
        
          {/* Add Menu Button */}
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleAddMenu}
          >
            Add Menu
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/owner-login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}