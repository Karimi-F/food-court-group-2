"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// export default function Dashboard() {
//     const { data: session, status } = useSession();
//     const router = useRouter();

//     useEffect(() => {
//         if (status === "unauthenticated") {
//             router.push("/owner-login"); // Redirect to login page
//         }
//     }, [status, router]);

//     if (status === "loading") return <p>Loading...</p>;

//     return (
//         <>
//             <h1>Hi {session?.user?.name}, <br />Welcome to your dashboard</h1>
//         </>
//     );
// }

// pages/outlet-dashboard.js

import { useState } from "react";

export default function OutletDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    wait_time: "",
  });

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // For now, we'll just log the new item
    console.log("New Item Added: ", newItem);

    // You can replace this with an API call to add the item to the menu in your backend
    // Example API call (replace with actual endpoint):
    // const response = await fetch('/api/menu', { method: 'POST', body: JSON.stringify(newItem) });

    setShowForm(false); // Close form after submitting
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Outlet Name Dashboard
      </header>

      <div className="max-w-4xl mx-auto mt-6">
        {/* Orders Section */}
        <section className="mt-6 bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl text-blue-700 font-bold mb-4">Pending Orders</h2>

          {/* Placeholder Orders */}
          {/* Replace with dynamic order data */}
          <div className="p-4 mb-4 text-black border rounded-md bg-gray-50">
            <h3 className="font-semibold">Order #1</h3>
            <p>Customer: John Doe</p>
            <ul>
              <li>Burger</li>
              <li>Fries</li>
            </ul>
            <div className="flex justify-between mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                Confirm Order
              </button>
              <span className="text-gray-600">Estimated Wait: 15 mins</span>
            </div>
          </div>
        </section>

        {/* Menu Management Section */}
        <section className="mt-6 bg-white p-4 shadow-md rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-blue-700 font-bold">Manage Menu</h2>

            {/* Add Item Button (Top-right) */}
            <button
              onClick={() => setShowForm(!showForm)} // Toggle form visibility
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
          </div>

          {/* Form to Add New Item (only visible when showForm is true) */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
              <div>
                <label className="block text-blue-700 font-semibold">Food Name</label>
                <input
                  type="text"
                  placeholder="Enter food name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full text-blue-700 px-4 py-2 border rounded-md"
                />
              </div>

              <div>
  <label className="block text-blue-700 font-semibold">Food Category</label>
  <select
    value={newItem.name}
    onChange={(e) =>
      setNewItem({ ...newItem, name: e.target.value })
    }
    className="w-full text-blue-700 px-4 py-2 border rounded-md"
  >
    <option value="" disabled>Select a category</option>
    <option value="Burger">Breakfast</option>
    <option value="Pizza">Lunch</option>
    <option value="Sushi">Snacks</option>
    <option value="Dessert">Dessert</option>
    <option value="Beverage">Beverage</option>
  </select>
</div>


              <div>
                <label className="block text-blue-700 font-semibold">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="w-full text-blue-700 px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-blue-700 font-semibold">Wait Time(in minutes)</label>
                <textarea
                  placeholder="Wait time"
                  value={newItem.wait_time}
                  onChange={(e) =>
                    setNewItem({ ...newItem, wait_time: e.target.value })
                  }
                  className="w-full  text-blue-700 px-4 py-2 border rounded-md"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4"
              >
                Add Item
              </button>
            </form>
          )}

          {/* Existing Menu Items List */}
          <div className="space-y-4">
            {/* Example Menu Item */}
            <div className="flex flex-col justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-black font-semibold">Smocha</p>
                <p className="text-gray-600">Ksh.60</p>
                <p className="text-gray-600">7 minutes</p>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 flex justify-between space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-black font-semibold">Chapai</p>
                <p className="text-gray-600">Ksh.20</p>
                <p className="text-gray-600">3 minutes</p>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 flex justify-between space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between p-4 border rounded-md bg-gray-50">
              <div>
                <p className="text-black font-semibold">Fries</p>
                <p className="text-gray-600">Ksh.100</p>
                <p className="text-gray-600">15 minutes</p>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 flex justify-between space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
              </div>
            </div>
            {/* Add more menu items similarly */}
          </div>
        </section>
      </div>
    </div>
  );
}

  