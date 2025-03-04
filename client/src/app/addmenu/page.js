"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddFood() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    waiting_time: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Food item is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.waiting_time.trim())
      newErrors.waiting_time = "Wait time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Prepare payload matching the backend model
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        waiting_time: formData.waiting_time, // e.g., "10 mins"
        category: formData.category,
        outlet_id: session?.user?.outletId, // Ensure session contains outletId
      };

      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Food added successfully!");
        setFormData({
          name: "",
          category: "",
          price: "",
          waiting_time: "",
        });
        setErrors({});
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

  if (!session) return null;

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter food name"
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-blue-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Breakfast, Lunch..."
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
              placeholder="Enter price"
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Waiting Time */}
          <div>
            <label className="block font-semibold text-blue-700">
              Wait Time (e.g., 10 mins)
            </label>
            <input
              type="text"
              name="waiting_time"
              value={formData.waiting_time}
              onChange={handleChange}
              placeholder="Enter waiting time"
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {errors.waiting_time && (
              <p className="text-red-500 text-sm">{errors.waiting_time}</p>
            )}
          </div>

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
