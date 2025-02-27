"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchOwnerOutlets, addOutlet } from "../lib/utils"; // Ensure correct path

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [isAddingOutlet, setIsAddingOutlet] = useState(false); // State for modal visibility
  const [newOutlet, setNewOutlet] = useState({ name: "", photo_url: "" });
  
  // Dummy orders data with order summary, table and serving time
  const [orders, setOrders] = useState([
    {
      id: 1,
      outletId: 1,
      table: "Table 1",
      orderSummary: [
        { name: "Burger", quantity: 2 },
        { name: "Fries", quantity: 1 },
      ],
      orderTime: "2025-02-23T10:30",
      status: "pending",
    },
    {
      id: 2,
      outletId: 2,
      table: "Table 3",
      orderSummary: [
        { name: "Pizza", quantity: 1 },
        { name: "Coke", quantity: 2 },
      ],
      orderTime: "2025-02-23T11:00",
      status: "pending",
    },
  ]);

  // Fetch outlets owned by the logged-in user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/owner-login"); // Redirect if not logged in
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

  // Handle order confirmation
  const handleConfirmOrder = (orderId) => {
    const orderToConfirm = orders.find((order) => order.id === orderId);
    if (orderToConfirm && orderToConfirm.status === "pending") {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "confirmed" } : order
        )
      );
      alert(
        `Notification sent to customer: Your order for ${orderToConfirm.orderSummary
          .map((item) => item.name)
          .join(", ")} will be served at ${orderToConfirm.orderTime}.`
      );
    }
  };

  // Handle logout with confirmation
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut({ redirect: false });
      alert("You have been logged out successfully");
      router.push("/");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {session?.user?.name ? `${session.user.name}'s Dashboard` : "Owner Dashboard"}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {outlets.length > 0 ? (
          outlets.map((outlet) => (
            <div key={outlet.id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{outlet.name}</h2>
              <p className="text-gray-500">{outlet.owner?.name}</p>

              {/* View Menu Button */}
              <button
                onClick={() => router.push(`/menu/${outlet.id}`)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Menu
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No outlets found.</p>
        )}
      </div>

      {/* Order Notifications Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Order Notifications
        </h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Outlet</th>
                  <th className="py-2 px-4 border">Table</th>
                  <th className="py-2 px-4 border">Order Summary</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  // Lookup outlet name based on order.outletId
                  const outletArray = Array.isArray(outlets) ? outlets : [];
                  const outlet = outletArray.find((o) => o.id === order.outletId) || {};
                  return (
                    <tr
                      key={order.id}
                      className={`text-center ${
                        order.status === "pending"
                          ? "bg-yellow-50"
                          : "bg-green-50"
                      }`}
                    >
                      <td className="py-2 px-4 border">
                        {outlet ? outlet.name : "N/A"}
                      </td>
                      <td className="py-2 px-4 border">{order.table}</td>
                      <td className="py-2 px-4 border">
                        {order.orderSummary.map((item, idx) => (
                          <div key={idx}>
                            {item.name}
                            {item.quantity > 1 ? ` x${item.quantity}` : ""}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-4 border">{order.orderTime}</td>
                      <td className="py-2 px-4 border capitalize">
                        {order.status}
                      </td>
                      <td className="py-2 px-4 border">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Outlet Button */}
      <button
        onClick={() => setIsAddingOutlet(true)}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
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
