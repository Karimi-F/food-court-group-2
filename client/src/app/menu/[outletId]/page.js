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
  const [orders, setOrders] = useState([]); // State for orders
  const [editingFood, setEditingFood] = useState(null);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", price: "", waiting_time: "", category: "" });
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

  // Fetch orders for this outlet
  useEffect(() => {
    if (!outletId) return;

    const fetchOrders = async () => {
      try {
        // Update this URL to your orders endpoint and pass outletId as needed.
        const res = await fetch(`/api/orders?outletId=${outletId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    // Optionally, you might poll the orders endpoint every few seconds:
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [outletId]);

  // Function to update order status (e.g., Confirm, Serve, Complete)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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
      {/* Header with Outlet Name and Back Button */}
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold relative">
        <button
          onClick={() => router.push("/owner-dashboard")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          &#8592; Back to Outlets
        </button>
        {outletName ? `${outletName}'s Menu & Orders` : "Loading..."}
      </header>

      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 shadow-md rounded-lg">
        {/* Food Items Section */}
        <div className="mb-8">
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

        {/* Orders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="p-4 border rounded-md">
                  <div className="mb-2">
                    <p className="font-semibold">Order ID: {order.id}</p>
                    <p className="text-gray-600">Order Time: {order.orderTime}</p>
                    <p className="text-gray-600">Total: ${order.total}</p>
                    <p className="text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="mb-2">
                    <h3 className="font-semibold">Items:</h3>
                    <ul className="list-disc list-inside">
                      {order.foodItems.map((item, index) => (
                        <li key={index}>
                          {item.name} {item.quantity > 1 && ` x${item.quantity}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Confirmed")}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === "Confirmed" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Served")}
                        className="bg-orange-500 text-white px-3 py-1 rounded-md"
                      >
                        Serve
                      </button>
                    )}
                    {order.status === "Served" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Completed")}
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No orders yet.</p>
          )}
        </div>
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
              <select
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
                <option value="Dinner">Dinner</option>
              </select>
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
