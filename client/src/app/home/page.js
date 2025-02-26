"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchOutlets,
  createCustomer,
  getCustomer,
  searchOutletByName,
} from "../lib/utils";


export default function Home() {
  const [searchOutlet, setSearchOutlet] = useState("");
  const [searchFood, setSearchFood] = useState("");
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [outlets, setOutlets] = useState([]); // Stores searched outlets
  const [selectedOutlet, setSelectedOutlet] = useState(null); // Stores clicked outlet
  const [foods, setFoods] = useState([]); // Stores food items for selected outlet

  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const getOutlets = async () => {
    const data = await fetchOutlets({
      outlet: searchOutlet, // ✅ Using searchOutlet instead of searchRestaurants
      food: searchFood,
    });
    setOutlets(data); // ✅ Renamed from setRestaurants
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOutlets();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchOutlet, searchFood]); // ✅ Updated dependencies


  // 🔹 Fetch Outlets Based on Search
  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty search

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/outlets?name=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Outlet not found");
      }

      const data = await response.json();
      console.log("Search Results:", data);
      setOutlets(data); // 🔹 Store the outlets to display
    } catch (error) {
      console.error("Error fetching outlets:", error);
    }
  };

  // 🔹 Fetch Food Items When an Outlet is Clicked
  const handleOutletClick = async (outletId) => {
    setSelectedOutlet(outletId);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/outlets/${outletId}/foods`
      );
      if (!response.ok) {
        throw new Error("No food found for this outlet");
      }

      const data = await response.json();
      console.log("Food Items:", data);
      setFoods(data); // 🔹 Store the food items
    } catch (error) {
      console.error("Error fetching food:", error);
    }
  };

  return (
    <>
      <div>
        <button
          className="bg-red-500 p-2 rounded-md text-white"
          onClick={openModal}
        >
          Get Started
        </button>

        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-red-500 p-6 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-xl text-white font-bold mb-4 text-center">
                Sign Up As:
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  role
                    ? router.push(`/${role}-signup`)
                    : alert("Select an option!");
                  closeModal();
                }}
                className="space-y-4 text-white"
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    onChange={(e) => setRole(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Owner</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    onChange={(e) => setRole(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Customer</span>
                </label>

                <button
                  type="submit"
                  className="bg-yellow-500 text-white w-full p-2 rounded-md mt-4 hover:bg-red-500 transition"
                >
                  Continue
                </button>
              </form>

              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-xl text-gray-500"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-100 min-h-screen">
        <div className="bg-cover bg-center h-screen">
          <nav className="bg-blue-100 shadow-md p-4 fixed top-0 w-full z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-red-500">Bite Scape</h1>
              <ul className="hidden md:flex text-black space-x-6">
                <li className="cursor-pointer hover:text-red-500">
                  <Link href="/home">Home</Link>{" "}
                </li>
                <li className="cursor-pointer hover:text-red-500">
                  <Link href="/about">About us</Link>
                </li>
                <li className="cursor-pointer hover:text-red-500">
                  <Link href="/contact-us">Contact Us</Link>
                </li>
                <li className="cursor-pointer hover:text-red-500">
                  <button
                    className="bg-red-500 p-2 rounded-md text-white"
                    onClick={openModal}
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <section className="relative h-[80vh] flex items-center justify-center text-center">
            <Image
              src="/food-hero.jpg"
              alt="Delicious Food"
              layout="fill"
              objectFit="cover"
              className="opacity-70"
            />
            <div className="absolute text-white">
              <h1 className="text-4xl text-white">Welcome</h1>
              <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                Discover Amazing Food at Bite Scape
              </h2>
              <p className="mt-4 text-lg md:text-xl">
                Find your favorite meals from the best restaurants near you!
              </p>

              {/* <input type="text" placeholder="Search for food, outlets..." className="p-2 w-72 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="bg-red-500 p-3 rounded-md text-white ml-auto" onClick={handleSearch}>
                  Search
                </button> */}
              <div className="flex items-center justify-center w-full">
                <input
                  type="text"
                  placeholder="Search outlets..."
                  className="w-1/2 h-12 px-6 rounded-full 
                   bg-white text-blue-700 text-lg
                   placeholder:text-gray-400
                   border border-gray-300
                   outline-none"
                  value={searchOutlet}
                  onChange={(e) => setSearchOutlet(e.target.value)}
                />
                {/* <button className="bg-red-500 p-3 rounded-md text-white ml-auto" onClick={handleSearch}>
                  Search
                </button> */}
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
                <button className="mt-2 bg-blue-700 text-white p-2 rounded w-full"
                >
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
          </section>
         
        </div>
      </div>
      <footer className="bg-blue-100 text-black text-center py-6">
      <p>&copy; 2025 Bite Scape. All Rights Reserved.</p>
   </footer>
    </>
  );
}
