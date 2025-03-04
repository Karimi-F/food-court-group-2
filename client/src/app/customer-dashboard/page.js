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
  const [searchFood, setSearchFood] = useState("");
  const [category, setCategory] = useState("");
  const [recentOrder, setRecentOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);

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
        try {
          const res = await fetch(`http://localhost:5000/orders?customer_id=${session.user.id}`);
          const data = await res.json();
          if (res.ok) {
            // Assuming your backend returns an array of orders
            setPastOrders(data);
          } else {
            console.error("Error fetching orders:", data.error);
          }
        } catch (error) {
          console.error("Error fetching past orders:", error);
        }
      }
    };
    fetchPastOrders();
  }, [session]);

  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <Head>
        <title>Customer Dashboard</title>
      </Head>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-blue-700 font-bold">
            {session?.user?.name
              ? `${session.user.name}'s Dashboard`
              : "Customer Dashboard"}
            , Welcome to BiteScape Outlets
          </h1>
          <div className="flex gap-2">
            <Link href="/">
              <button className="bg-gray-500 text-white p-3 rounded">
                &#8678; Back to Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-white p-3 rounded"
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
            <p className="mt-2 text-green-800">Current Status: {recentOrder.status}</p>
          )}
        </div>
      )}

      {/* Past Orders Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Past Orders</h2>
        {pastOrders.length === 0 ? (
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
                  <th className="py-2 px-4 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {pastOrders.map((order) => (
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
          className="p-2 text-blue-700 border rounded w-full mb-2"
          value={searchOutlet}
          onChange={(e) => setSearchOutlet(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search food..."
          className="p-2 text-blue-700 border rounded w-full md:w-2/3 mb-2"
          value={searchFood}
          onChange={(e) => setSearchFood(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full md:w-1/3 text-blue-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Pick a category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
          <option value="Dinner">Dinner</option>
        </select>
      </form>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outlets.length > 0 ? (
          outlets.map((outlet, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow bg-white hover:shadow-lg transition"
            >
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl text-blue-700 font-bold">{outlet.name}</h2>
              <p className="text-gray-800">{outlet.description}</p>
              <Link href={`/foodmenu/${outlet.id}`}>
                <button className="mt-2 bg-blue-700 text-white p-2 rounded w-full">
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
