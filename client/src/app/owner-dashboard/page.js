"use client";
import { useEffect, useState } from "react";
import { fetchMenu, addMenuItem, deleteMenuItem,} from "../lib/utils";

export default function OutletDashboard({ outlet_id }) {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    wait_time: "",
    category: "",
  });

  // Fetch menu items on load
  useEffect(() => {
    async function loadMenu() {
      const data = await fetchMenu(outlet_id);
      setMenuItems(data);
    }
    loadMenu();
  }, [outlet_id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const addedItem = await addMenuItem(outlet_id, newItem);
    if (addedItem) {
      setMenuItems([...menuItems, addedItem]);
      setShowForm(false);
      setNewItem({ name: "", price: "", wait_time: "", category: "" });
    }
  };

  // Handle deleting an item
  const handleDelete = async (itemId) => {
    if (await deleteMenuItem(itemId)) {
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Outlet Dashboard
      </header>

      <div className="max-w-4xl mx-auto mt-6">
        {/* Menu Management Section */}
        <section className="mt-6 bg-white p-4 shadow-md rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-blue-700 font-bold">Manage Menu</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Food Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Wait Time (mins)"
                value={newItem.wait_time}
                onChange={(e) =>
                  setNewItem({ ...newItem, wait_time: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                Add Item
              </button>
            </form>
          )}

          {/* Food Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-md bg-gray-50 shadow-md"
              >
                <h3 className="font-semibold text-black">{item.name}</h3>
                <p className="text-gray-600">Ksh. {item.price}</p>
                <p className="text-gray-600">{item.wait_time} mins</p>
                <p className="text-gray-500 text-sm">{item.category}</p>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
