"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { fetchOutlets } from "../lib/utils";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchOutlet, setSearchOutlet] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle logout functionality
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signOut({ redirect: false });
      alert("You have been logged out successfully");
      router.push("/home");
    }
  };

  // Fetch outlets based on search input
  const getOutlets = async () => {
    const data = await fetchOutlets({ outlet: searchOutlet });
    setOutlets(data);
  };

  // Debounce search input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOutlets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchOutlet]);

  // Poll localStorage for recent order updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const order = localStorage.getItem("recentOrder");
      if (order) {
        setRecentOrder(JSON.parse(order));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch past orders for the logged-in customer
  useEffect(() => {
    const fetchPastOrders = async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `https://food-court-group-2-1.onrender.com/orders?customer_id=${session.user.id}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await res.json();
          setPastOrders(data);
        } catch (error) {
          console.error("Error fetching past orders:", error);
          setError("Failed to fetch orders. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPastOrders();
  }, [session]);

  return (
    <div className="bg-[#ffeeee] min-h-screen p-6">
      <Head>
        <title>Customer Dashboard</title>
      </Head>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-[#ff575a] font-bold">
            {session?.user?.name
              ? `${session.user.name}'s Dashboard`
              : "Customer Dashboard"}
          </h1>
          <div className="flex gap-2">
            <Link href="/home">
              <button className="bg-white text-[#ff575a] p-3 rounded">
                ↝ Back to Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#ff575a] text-white p-3 rounded hover:bg-[#e04e50] transition"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Recent Order Summary (if any) */}
      {recentOrder && (
        <div className="bg-green-50 border border-green-300 p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Recent Order Summary
          </h2>
          <ul className="list-disc list-inside">
            {recentOrder.order_items &&
              recentOrder.order_items.map((item, index) => (
                <li key={index} className="text-green-800">
                  {item.food?.name || "Item"}
                  {item.quantity > 1 ? ` x${item.quantity}` : ""}
                </li>
              ))}
          </ul>
          <p className="mt-2 text-green-800">
            Time to be served: {recentOrder.orderTime}
          </p>
          {recentOrder.status && (
            <p className="mt-2 text-green-800">
              Current Status: {recentOrder.status}
            </p>
          )}
        </div>
      )}

      {/* Past Orders Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Past Orders</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : pastOrders.length === 0 ? (
          <p className="text-gray-600">No past orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Order Time</th>
                  <th className="py-2 px-4 border">Total (Ksh)</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {pastOrders.slice(-3).map((order) => (
                  <tr key={order.id} className="text-center border-b">
                    <td className="py-2 px-4 border">{order.id}</td>
                    <td className="py-2 px-4 border">{order.datetime}</td>
                    <td className="py-2 px-4 border">{order.total}</td>
                    <td className="py-2 px-4 border">{order.status}</td>
                    <td className="py-2 px-4 border">
                      <ul className="list-disc list-inside text-left">
                        {order.order_items &&
                          order.order_items.map((item, idx) => (
                            <li key={idx}>
                              {item.food?.name || "Item"}{" "}
                              {item.quantity > 1 ? `x${item.quantity}` : ""}
                            </li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Search Form */}
      <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search restaurants..."
          className="p-2 text-[#ff575a] border rounded w-full mb-2"
          value={searchOutlet}
          onChange={(e) => setSearchOutlet(e.target.value)}
        />
      </form>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outlets.length > 0 ? (
          outlets.map((outlet, index) => (
            <div
              key={index}
              className="border p-4 rounded-2xl shadow bg-[#e6d6d6] hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-2xl mb-2"
              />
              <h2 className="text-xl text-[#ff575a] font-bold">{outlet.name}</h2>
              <p className="text-gray-800">{outlet.description}</p>
              <Link href={`/foodmenu/${outlet.id}`}>
                <button className="mt-2 bg-[#ff575a] text-white p-2 rounded-xl w-full hover:bg-[#e04e50] transition">
                  View Menu
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No outlets found</p>
        )}
      </div>
    </div>
  );
}