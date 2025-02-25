"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  fetchFoodByOutlet,
  updateFoodItem,
  deleteFoodItem,
  addFoodItem,
} from "../../lib/utils"; // Removed the import for addOutlet

export default function OutletMenu() {
  const router = useRouter();
  const { outletId } = useParams();
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", price: "", waiting_time: "", category: "" });
  const [loggedInUser, setLoggedInUser] = useState(null); // State for logged-in user

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
        prevFoods.map((food) => (food.id === editingFood.id ? editingFood : food))
      );
      setEditingFood(null);
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  // Handle adding a food item
  const handleAddFoodSubmit = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price || !newFood.waiting_time || !newFood.category) return;

    const foodData = {
      ...newFood,
      outlet_id: outletId,
      price: parseFloat(newFood.price),
      waiting_time: parseInt(newFood.waiting_time, 10),
    };

    try {
      const addedFood = await addFoodItem(foodData);
      if (addedFood?.id) {
        setFoods((prevFoods) => [...prevFoods, addedFood]);
        setNewFood({ name: "", price: "", waiting_time: "", category: "" });
        setIsAddingFood(false);
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Outlet Menu
      </header>

      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 shadow-md rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Food Items</h2>
          <button
            onClick={() => setIsAddingFood(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            + Add Food
          </button>
        </div>

        {foods.length > 0 ? (
          <ul className="space-y-4">
            {foods.map((food) => (
              <li key={food.id} className="flex justify-between items-center p-3 border rounded-md">
                {editingFood?.id === food.id ? (
                  <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingFood.name}
                      onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                      className="p-2 border rounded-md"
                      required
                    />
                    <input
                      type="number"
                      value={editingFood.waiting_time}
                      onChange={(e) =>
                        setEditingFood({ ...editingFood, waiting_time: parseInt(e.target.value, 10) })
                      }
                      className="p-2 border rounded-md w-20"
                      required
                    />
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-md">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFood(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{food.name}</h3>
                      <p className="text-gray-500">${food.price}</p>
                      <p className="text-gray-500">Waiting time: {food.waiting_time} min</p>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingFood(food)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No food items found.</p>
        )}
      </div>

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Food</h2>
            <form onSubmit={handleAddFoodSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Food Name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newFood.price}
                onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Waiting Time (min)"
                value={newFood.waiting_time}
                onChange={(e) => setNewFood({ ...newFood, waiting_time: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAddingFood(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
