"use client"; // ✅ Add this at the top
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link"; // ✅ Import Link for navigation
import {
  fetchOutlets,
  createCustomer,
  getCustomer,
  searchOutletByName,
} from "../lib/utils";

export default function CustomerDashboard() {
  const [searchOutlet, setSearchOutlet] = useState(""); // ✅ Renamed from searchRestaurants
  const [searchFood, setSearchFood] = useState("");
  const [category, setCategory] = useState("");
  const [outlets, setOutlets] = useState([]); // ✅ Renamed from restaurants

  // Fetch outlets based on search criteria
  const getOutlets = async () => {
    const data = await fetchOutlets({
      outlet: searchOutlet, // ✅ Using searchOutlet instead of searchRestaurants
      food: searchFood,
      category,
    });
    setOutlets(data); // ✅ Renamed from setRestaurants
  };

  // Debounce search input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOutlets();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchOutlet, searchFood, category]); // ✅ Updated dependencies

  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <Head>
        <title>Customer Dashboard</title>
      </Head>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-blue-700 font-bold">
            Customer Name, Welcome to BiteScape Outlets
          </h1>
          <button className="bg-blue-700 text-white p-3 rounded">
            Log out
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="p-2 text-blue-700 border rounded w-full md:w-2/3"
          value={searchOutlet}
          onChange={(e) => setSearchOutlet(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search food..."
          className="p-2 text-blue-700 border rounded w-full md:w-2/3"
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
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {outlets.length > 0 ? (
          outlets.map((outlet, index) => (
            <div key={index} className="border p-4 rounded-lg shadow bg-white">
              {/* Outlet Image */}
              <img
                src={outlet.photo_url} // Ensure this matches your API response key
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />

              {/* Outlet Name */}
              <h2 className="text-xl text-blue-700 font-bold">{outlet.name}</h2>

              {/* Outlet Description */}
              <p className="text-gray-800">{outlet.description}</p>

              {/* View Menu Button with Navigation */}
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
