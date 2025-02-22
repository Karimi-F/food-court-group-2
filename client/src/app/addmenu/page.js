"use client"

import { useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    food: "",
    price: "",
    description: "",
    wait_time: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.food) newErrors.food = "Food item is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.wait_time) newErrors.wait_time = "Wait time is required";
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Data:", formData);
      setSuccessMessage("Menu item added successful! 🎉");
      const signInResult = await signIn("credentials", {
        redirect: false,
        food:formData.food,
        food_category:formData.food_category,
        price:formData.price,
        wait_time:formData.wait_time
      })
      setFormData({ food: "", price: "", description: "", wait_time:"" });
      setErrors({});
      // Call API here
    }
  };

const handleAddMenuItem = () => {
  router.push("/addoutlet");
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Add Food to your Outlet Menu</h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
           
          {/* Food */}
          <div>
            <label className="block font-semibold text-blue-700">Food Name</label>
            <input
              type="text"
              name="food"
              value={formData.food}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.food && <p className="text-red-500 text-sm">{errors.food}</p>}
          </div>

          {/* New Password */}
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

          {/* Email */}
          <div>
            <label className="block font-semibold text-blue-700">Price</label>
            <input
              type="float"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block  font-semibold text-blue-700">Wait Time (In minutes)</label>
            <input
              type="text"
              name="wait_time"
              value={formData.wait_time}
              onChange={handleChange}
              className="w-full text-blue-700 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.wait_time && <p className="text-red-500 text-sm">{errors.wait_time}</p>}
          </div>

         
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick = {handleAddMenuItem}
          >
            Add Menu Item
          </button>
        </form>

      </div>
    </div>
  );
}
