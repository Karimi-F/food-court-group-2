"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchOutlets } from "../lib/utils";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [searchOutlet, setSearchOutlet] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [searchFood, setSearchFood] = useState("");
  const [category, setCategory] = useState("");

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

  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <Head>
        <title>Customer Dashboard</title>
      </Head>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-blue-700 font-bold">
            {session?.user?.name ? `${session.user.name}'s Dashboard` : "Customer Dashboard"}, Welcome to BiteScape Outlets
          </h1>
          <div className="flex gap-2">
            <Link href="/">
              <button className="bg-gray-500 text-white p-3 rounded">
                ← Back to Home
              </button>
            </Link>
            <button className="bg-blue-700 text-white p-3 rounded">Log out</button>
          </div>
        </div>
      </header>

      {/* Search Form */}
      <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search restaurants..."
          className="p-2 text-blue-700 border rounded w-full"
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
      </form>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outlets.length > 0 ? (
          outlets.map((outlet, index) => (
            <div key={index} className="border p-4 rounded-lg shadow bg-white">
              <img
                src={outlet.photo_url} // Ensure this matches your API response key
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