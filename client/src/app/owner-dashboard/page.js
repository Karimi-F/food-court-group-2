"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchOwnerOutlets, addOutlet } from "../lib/utils"; // Ensure correct path

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [isAddingOutlet, setIsAddingOutlet] = useState(false);
  const [newOutlet, setNewOutlet] = useState({ name: "", photo_url: "" });
  
  // Dummy orders data updated to reflect backend's order_items structure
  const [orders, setOrders] = useState([
    {
      id: 1,
      outletId: 1,
      table: "Table 1",
      order_items: [
        { food: { name: "Burger" }, quantity: 2 },
        { food: { name: "Fries" }, quantity: 1 },
      ],
      orderTime: "2025-02-23T10:30",
      status: "pending",
    },
    {
      id: 2,
      outletId: 2,
      table: "Table 3",
      order_items: [
        { food: { name: "Pizza" }, quantity: 1 },
        { food: { name: "Coke" }, quantity: 2 },
      ],
      orderTime: "2025-02-23T11:00",
      status: "pending",
    },
  ]);

  // Automatically sign out after 1 hour (3600000 ms) when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        signOut({ redirect: false });
        alert("Your session has expired. Please log in again.");
        router.push("/home");
      }, 3600000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Fetch outlets owned by the logged-in user and handle unauthenticated state
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/home");
    }
    if (status === "authenticated" && session?.user?.id) {
      fetchOwnerOutlets(session.user.id).then(setOutlets);
    }
  }, [status, session, router]);

  // Logout handler
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut({ redirect: false });
      alert("You have been logged out successfully");
      router.push("/home");
    }
  };

  // Helper to update localStorage with recent order if it matches a specific order
  const updateRecentOrderLocalStorage = (order) => {
    const recentOrder = localStorage.getItem("recentOrder");
    if (recentOrder) {
      const parsed = JSON.parse(recentOrder);
      // Adjust matching criteria as needed
      if (parsed.orderTime === order.orderTime) {
        localStorage.setItem(
          "recentOrder",
          JSON.stringify({
            foodItems: order.order_items,
            orderTime: order.orderTime,
            status: order.status,
          })
        );
      }
    }
  };

  // Update order status helper
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          updateRecentOrderLocalStorage(updatedOrder);
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const handleConfirmOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status === "pending") {
      updateOrderStatus(orderId, "confirmed");
      alert(
        `Order for ${order.order_items
          .map((item) => item.food.name)
          .join(", ")} has been confirmed.`
      );
    } else {
      alert("Order cannot be confirmed.");
    }
  };

  const handleServeOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status === "confirmed") {
      updateOrderStatus(orderId, "served");
      alert(
        `Order for ${order.order_items
          .map((item) => item.food.name)
          .join(", ")} is now being served.`
      );
    } else {
      alert("Order must be confirmed before serving.");
    }
  };

  const handleCompleteOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status === "served") {
      updateOrderStatus(orderId, "completed");
      alert(
        `Order for ${order.order_items
          .map((item) => item.food.name)
          .join(", ")} is completed.`
      );
    } else {
      alert("Order must be served before it can be completed.");
    }
  };

  // Handle adding a new outlet
  const handleAddOutletSubmit = async (e) => {
    e.preventDefault();
    if (!newOutlet.name || !newOutlet.photo_url) return;
    const outletData = {
      ...newOutlet,
      owner_id: session.user.id,
    };
    try {
      const addedOutlet = await addOutlet(outletData);
      if (addedOutlet?.id) {
        setOutlets((prevOutlets) => [...(prevOutlets || []), addedOutlet]);
        setNewOutlet({ name: "", photo_url: "" });
        setIsAddingOutlet(false);
        alert("Outlet added successfully!");
      }
    } catch (error) {
      console.error("Error adding outlet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        <h1>
          {session?.user?.name
            ? `${session.user.name}'s Dashboard`
            : "Owner Dashboard"}
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
                  <th className="py-2 px-4 border">Order Items</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const outlet =
                    (Array.isArray(outlets) ? outlets : []).find(
                      (o) => o.id === order.outletId
                    ) || {};
                  return (
                    <tr
                      key={order.id}
                      className={`text-center ${
                        order.status === "pending"
                          ? "bg-yellow-50"
                          : order.status === "confirmed"
                          ? "bg-blue-50"
                          : order.status === "served"
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <td className="py-2 px-4 border">
                        {outlet.name || "N/A"}
                      </td>
                      <td className="py-2 px-4 border">{order.table}</td>
                      <td className="py-2 px-4 border">
                        {order.order_items.map((item, idx) => (
                          <div key={idx}>
                            {item.food.name}
                            {item.quantity > 1 ? ` x${item.quantity}` : ""}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-4 border">{order.orderTime}</td>
                      <td className="py-2 px-4 border capitalize">
                        {order.status}
                      </td>
                      <td className="py-2 px-4 border space-y-1">
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded block"
                        >
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleServeOrder(order.id)}
                          className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded block"
                        >
                          Serve Order
                        </button>
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded block"
                        >
                          Completed Order
                        </button>
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
                onChange={(e) =>
                  setNewOutlet({ ...newOutlet, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={newOutlet.photo_url}
                onChange={(e) =>
                  setNewOutlet({ ...newOutlet, photo_url: e.target.value })
                }
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
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
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
