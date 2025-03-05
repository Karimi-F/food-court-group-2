"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchOwnerOutlets, addOutlet, fetchOrdersByOutlet, handleConfirmOrder } from "../lib/utils"; // Ensure correct path

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [isAddingOutlet, setIsAddingOutlet] = useState(false); // State for modal visibility
  const [newOutlet, setNewOutlet] = useState({ name: "", photo_url: "" });
  const [selectedOutletOrders, setSelectedOutletOrders] = useState([]); // State for orders of a specific outlet
  const [isViewingOrders, setIsViewingOrders] = useState(false); // State to toggle orders modal

  // Fetch outlets owned by the logged-in user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/home"); // Redirect if not logged in
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchOwnerOutlets(session.user.id).then(setOutlets);
    }
  }, [status, session, router]);

  // Handle adding a new outlet
  const handleAddOutletSubmit = async (e) => {
    e.preventDefault();
    if (!newOutlet.name || !newOutlet.photo_url) return;

    const outletData = {
      ...newOutlet,
      owner_id: session.user.id, // Auto-fill the owner ID
    };

    try {
      const addedOutlet = await addOutlet(outletData);
      if (addedOutlet?.id) {
        setOutlets((prevOutlets) => [...prevOutlets, addedOutlet]);
        setNewOutlet({ name: "", photo_url: "" });
        setIsAddingOutlet(false);
        alert("Outlet added successfully!");
      }
    } catch (error) {
      console.error("Error adding outlet:", error);
    }
  };

  // Fetch orders for a specific outlet
  const handleViewOrders = async (outletId) => {
    try {
      const orders = await fetchOrdersByOutlet(outletId);
      setSelectedOutletOrders(orders);
      setIsViewingOrders(true); // Open the orders modal
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut({ redirect: false });
      alert("You have been logged out successfully");
      router.push("/home");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#ffeeee] p-6">
      {/* Header */}
      <header className="flex justify-between items-center text-[#ff575a] p-4 text-center text-2xl font-bold">
        <h1 className="text-2xl font-bold">
          {session?.user?.name ? `${session.user.name}'s Dashboard` : "Owner Dashboard"}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-[#ff575a] text-white px-4 py-2 rounded-xl hover:bg-[#e04e50] transition"
        >
          Logout
        </button>
      </header>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {outlets.length > 0 ? (
          outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="border p-4 rounded-2xl shadow bg-[#e6d6d6] hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-2xl mb-2"
              />
              <h2 className="text-[#ff575a] font-semibold mt-2">{outlet.name}</h2>
              <p className="text-gray-500">{outlet.owner?.name}</p>
              <p className="text-gray-500">{outlet.description}</p>

              {/* View Menu Button */}
              <button
                onClick={() => router.push(`/menu/${outlet.id}`)}
                className="mt-3 bg-[#ff575a] text-white w-full px-4 py-2 rounded-xl hover:bg-[#e04e50] transition"
              >
                View Menu
              </button>

              {/* View Orders Button */}
              <button
                onClick={() => handleViewOrders(outlet.id)}
                className="mt-3 bg-[#4CAF50] text-white w-full px-4 py-2 rounded-xl hover:bg-[#45a049] transition"
              >
                View Orders
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No outlets found.</p>
        )}
      </div>

      {/* Orders Modal */}
      {isViewingOrders && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-4xl">
            <h2 className="text-lg font-semibold mb-4">Orders for Outlet</h2>
            <button
              onClick={() => setIsViewingOrders(false)}
              className="absolute top-4 right-4 bg-gray-400 text-white px-3 py-1 rounded"
            >
              Close
            </button>
            {selectedOutletOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border">Order ID</th>
                      <th className="py-2 px-4 border">Customer ID</th>
                      <th className="py-2 px-4 border">Table Reservation ID</th>
                      <th className="py-2 px-4 border">Date & Time</th>
                      <th className="py-2 px-4 border">Total</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOutletOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`text-center ${
                          order.status === "pending" ? "bg-yellow-50" : "bg-green-50"
                        }`}
                      >
                        <td className="py-2 px-4 border">{order.id}</td>
                        <td className="py-2 px-4 border">{order.customer_id}</td>
                        <td className="py-2 px-4 border">{order.tablereservation_id}</td>
                        <td className="py-2 px-4 border">{order.datetime}</td>
                        <td className="py-2 px-4 border">${order.total.toFixed(2)}</td>
                        <td className="py-2 px-4 border capitalize">{order.status}</td>
                        <td className="py-2 px-4 border">
                          {/* Add a Confirm button for pending orders */}
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleConfirmOrder(order.id, setSelectedOutletOrders)} // Call handleConfirmOrder
                              className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No orders found for this outlet.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Outlet Button */}
      <button
        onClick={() => setIsAddingOutlet(true)}
        className="mt-6 bg-[#ff575a] text-white px-4 py-2 rounded-xl hover:bg-[#e04e50] transition"
      >
        + Add Outlet
      </button>

      {/* Add Outlet Modal */}
      {isAddingOutlet && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Outlet</h2>
            <form onSubmit={handleAddOutletSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Outlet Name"
                value={newOutlet.name}
                onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={newOutlet.photo_url}
                onChange={(e) => setNewOutlet({ ...newOutlet, photo_url: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOutlet(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
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