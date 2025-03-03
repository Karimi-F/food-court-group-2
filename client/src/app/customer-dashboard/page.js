"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { fetchOutlets } from "../lib/utils";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchOutlet, setSearchOutlet] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [searchFood, setSearchFood] = useState("");
  const [category, setCategory] = useState("");
  const [recentOrder, setRecentOrder] = useState(null);

  // Handle logout functionality
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Sign out without redirect
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

  // Retrieve recent order from localStorage (if available) on component mount
  useEffect(() => {
    const order = localStorage.getItem("recentOrder");
    if (order) {
      setRecentOrder(JSON.parse(order));
      localStorage.removeItem("recentOrder"); // Clear after showing
    }
  }, []);

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
            {recentOrder.foodItems.map((food, index) => (
              <li key={index} className="text-green-800">
                {food.name}
                {food.quantity > 1 ? ` x${food.quantity}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-green-800">
            Time to be served: {recentOrder.orderTime}
          </p>
        </div>
      )}

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
