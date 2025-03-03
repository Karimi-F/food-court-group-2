"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  fetchFoodByOutlet,
  updateFoodItem,
  deleteFoodItem,
  addFoodItem,
  fetchOutletDetails,
} from "../../lib/utils";

export default function OutletMenu() {
  const router = useRouter();
  const { outletId } = useParams();
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    waiting_time: "",
    photo_url: "",
    category: "",
  });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [outletName, setOutletName] = useState(""); // State for outlet name

  // Fetch food items for the outlet
  useEffect(() => {
    if (!outletId) return;

    const fetchFoods = async () => {
      try {
        const foodData = await fetchFoodByOutlet(outletId);
        if (Array.isArray(foodData)) setFoods(foodData);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoods();
  }, [outletId]);

  // Fetch the logged-in user
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await fetch("/api/user"); // Replace with your actual API endpoint
        const userData = await user.json();
        setLoggedInUser(userData);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  // Fetch outlet details (including name)
  useEffect(() => {
    if (!outletId) return;

    const fetchOutlet = async () => {
      try {
        const outletData = await fetchOutletDetails(outletId); // Fetch outlet details
        setOutletName(outletData.name); // Set the outlet name
      } catch (error) {
        console.error("Error fetching outlet details:", error);
      }
    };

    fetchOutlet();
  }, [outletId]);

  // Handle deleting a food item
  const handleDelete = async (foodId) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteFoodItem(foodId);
        setFoods((prevFoods) => prevFoods.filter((item) => item.id !== foodId));
      } catch (error) {
        console.error("Error deleting food item:", error);
      }
    }
  };

  // Handle editing a food item
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingFood || !editingFood.id) {
      console.error("No food item or food ID provided for editing");
      return;
    }

    try {
      await updateFoodItem(editingFood.id, editingFood);
      setFoods((prevFoods) =>
        prevFoods.map((food) =>
          food.id === editingFood.id ? editingFood : food
        )
      );
      setEditingFood(null);
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  // Handle adding a food item
  const handleAddFoodSubmit = async (e) => {
    if (
      !newFood.name ||
      !newFood.price ||
      !newFood.waiting_time ||
      !newFood.category ||
      !newFood.photo_url
    )
      return;

    const foodData = {
      ...newFood,
      outlet_id: outletId,
      price: parseFloat(newFood.price),
      photo_url: newFood.photo_url,
      waiting_time: parseInt(newFood.waiting_time, 10),
      category: newFood.category
    };

    try {
      const addedFood = await addFoodItem(foodData);
      if (addedFood?.id) {
        setFoods((prevFoods) => [...prevFoods, addedFood]);
        setNewFood({ name: "", price: "", waiting_time: "", category: "" ,photo_url: ""});
        setIsAddingFood(false);
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffeeee] p-6">
      {/* Updated Header with Outlet Name and Back Button */}
      <header className="bg-[#ff575a] text-white p-4 text-center text-2xl relative">
        <button
          onClick={() => router.push("/owner-dashboard")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-[#ff575a] px-4 py-2 rounded-xl"
        >
          ← Back to Outlets
        </button>
        {outletName ? `${outletName}'s Menu` : "Loading..."}
      </header>

      <div className="max-w-4xl mx-auto mt-6 bg-[#ffeeee] p-6 shadow-md rounded-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-[#ff575a] font-semibold mb-4">Food Items</h2>
          <button
            onClick={() => setIsAddingFood(true)}
            className="bg-[#ff575a] text-white px-4 py-2 rounded-xl"
          >
            + Add Food
          </button>
        </div>

        {foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food.id} className="p-4 rounded-xl shadow bg-[#e6d6d6] hover:shadow-xl hover:scale-105 transition-transform duration-300">
                <img
                  src={food.photo_url}
                  alt={food.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
                {editingFood?.id === food.id ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="flex flex-col space-y-3 text-[#ff575a]"
                  >
                    <input
                      type="text"
                      placeholder="Food Name"
                      value={editingFood.name}
                      onChange={(e) =>
                        setEditingFood({ ...editingFood, name: e.target.value })
                      }
                      className="p-2 border rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Photo Url"
                      value={editingFood.photo_url}
                      onChange={(e) =>
                        setEditingFood({
                          ...editingFood,
                          photo_url: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={editingFood.price}
                      onChange={(e) =>
                        setEditingFood({
                          ...editingFood,
                          price: parseInt(e.target.value, 10),
                        })
                      }
                      className="p-2 border rounded-md w-40"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Wait time"
                      value={editingFood.waiting_time}
                      onChange={(e) =>
                        setEditingFood({
                          ...editingFood,
                          waiting_time: parseInt(e.target.value, 10),
                        })
                      }
                      className="p-2 border rounded-md w-40"
                      required
                    />
                    <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-3 py-1 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFood(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-xl"
                    >
                      Cancel
                    </button>
                    </div>
                    
                  </form>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{food.name}</h3>
                      <p className="text-gray-500">Ksh. {food.price}</p>
                      <p className="text-gray-500">
                        Waiting time: {food.waiting_time}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setEditingFood(food)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-xl"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No food items found.</p>
        )}
      </div>

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#ffeeee] p-6 rounded-2xl shadow-md w-96">
            <h2 className="text-[#ff575a] font-semibold mb-4">Add New Food</h2>
            <form onSubmit={handleAddFoodSubmit} className="space-y-3 text-[#ff575a]">
              <input
                type="text"
                placeholder="Food Name"
                value={newFood.name}
                onChange={(e) =>
                  setNewFood({ ...newFood, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newFood.price}
                onChange={(e) =>
                  setNewFood({ ...newFood, price: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Photo_url"
                value={newFood.photo_url}
                onChange={(e) =>
                  setNewFood({ ...newFood, photo_url: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Waiting Time (min)"
                value={newFood.waiting_time}
                onChange={(e) =>
                  setNewFood({ ...newFood, waiting_time: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={newFood.category}
                onChange={(e) =>
                  setNewFood({ ...newFood, category: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
                <option value="Dinner">Dinner</option>
              </select>
              <div className="flex justify-between">
                
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingFood(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
