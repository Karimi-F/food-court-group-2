"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddFoodModal() {
  const router = useRouter();
  const { data: session } = useSession();

  // Form fields for the food item
  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    waitingTime: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // For modal visibility control (could be managed by parent too)
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.foodName.trim())
      newErrors.foodName = "Food name is required";
    if (!formData.price)
      newErrors.price = "Price is required";
    if (!formData.waitingTime.trim())
      newErrors.waitingTime = "Waiting time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Call API to add food
      // Assumption: outlet id is available from session or query params.
      // Here we assume session.user.outletId contains the outlet id.
      const payload = {
        ...formData,
        outletId: session?.user?.outletId, // adjust according to your data
      };

      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Food added successfully! ??");
        // Clear form if desired
        setFormData({
          foodName: "",
          price: "",
          waitingTime: "",
          category: "",
        });
        // Automatically close modal and redirect after a short delay
        setTimeout(() => {
          setIsModalOpen(false);
          // Redirect to the outlet's menu page; adjust URL as needed.
          router.push(`/menu/${session?.user?.outletId}`);
        }, 2000);
      } else {
        setErrors({ api: data.error || "Error adding food" });
      }
    } catch (error) {
      console.error(error);
      setErrors({ api: "Error adding food" });
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Food</h2>
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            placeholder="Food Name"
            className="w-full p-2 border rounded"
            required
          />
          {errors.foodName && (
            <p className="text-red-500 text-sm">{errors.foodName}</p>
          )}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
          <input
            type="text"
            name="waitingTime"
            value={formData.waitingTime}
            onChange={handleChange}
            placeholder="Waiting Time (e.g., 10 mins)"
            className="w-full p-2 border rounded"
            required
          />
          {errors.waitingTime && (
            <p className="text-red-500 text-sm">{errors.waitingTime}</p>
          )}
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category (optional)"
            className="w-full p-2 border rounded"
          />
          {errors.api && (
            <p className="text-red-500 text-sm">{errors.api}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Food
          </button>
        </form>
      </div>
    </div>
  );
}
