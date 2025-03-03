"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddFood() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    food: "",
    food_category: "",
    price: "",
    wait_time: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.food.trim()) newErrors.food = "Food item is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.wait_time) newErrors.wait_time = "Wait time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Construct payload with the current outlet id from session
      // (Adjust according to how your outlet id is stored in session)
      const payload = {
        ...formData,
        outletId: session?.user?.outletId, 
      };

      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Food added successfully! ??");
        // Clear form fields
        setFormData({
          food: "",
          food_category: "",
          price: "",
          wait_time: "",
          description: "",
        });
        setErrors({});
        // After a delay, redirect to the outlet's menu page.
        setTimeout(() => {
          router.push(`/menu/${session?.user?.outletId}`);
        }, 2000);
      } else {
        setErrors({ api: data.error || "Error adding food" });
      }
    } catch (error) {
      console.error("Error adding food:", error);
      setErrors({ api: "Error adding food" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Add Food to Your Outlet Menu
        </h2>
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {errors.api && <p className="text-red-500 text-center mb-4">{errors.api}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div>
            <label className="block font-semibold text-blue-700">Food Name</label>
            <input
              type="text"
              name="food"
              value={formData.food}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.food && (
              <p className="text-red-500 text-sm">{errors.food}</p>
            )}
          </div>
          
          {/* Food Category */}
          <div>
            <label className="block font-semibold text-blue-700">Food Category</label>
            <input
              type="text"
              name="food_category"
              value={formData.food_category}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold text-blue-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          {/* Wait Time */}
          <div>
            <label className="block font-semibold text-blue-700">
              Wait Time (in minutes)
            </label>
            <input
              type="text"
              name="wait_time"
              value={formData.wait_time}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.wait_time && (
              <p className="text-red-500 text-sm">{errors.wait_time}</p>
            )}
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block font-semibold text-blue-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
}
