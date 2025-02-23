"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import image1 from '@/app/assets/images/image1.jpg';
import image2 from '@/app/assets/images/image2.jpg';
import image3 from '@/app/assets/images/image3.jpg';
import image4 from '@/app/assets/images/image4.jpg';

export default function Home() {
  const [role, setRole] = useState(""); 
  const [isOpen, setIsOpen] = useState(false); 
  const [query, setQuery] = useState(""); 
  const [outlets, setOutlets] = useState([]); // Stores searched outlets
  const [selectedOutlet, setSelectedOutlet] = useState(null); // Stores clicked outlet
  const [foods, setFoods] = useState([]); // Stores food items for selected outlet

  const router = useRouter();
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 🔹 Fetch Outlets Based on Search
  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty search

    try {
      const response = await fetch(`http://127.0.0.1:5000/outlets?name=${encodeURIComponent(query)}`);
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
      const response = await fetch(`http://127.0.0.1:5000/outlets/${outletId}/foods`);
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
              <h2 className="text-xl text-white font-bold mb-4 text-center">Sign Up As:</h2>

              <form onSubmit={(e) => { e.preventDefault(); role ? router.push(`/${role}-signup`) : alert("Select an option!"); closeModal(); }} className="space-y-4 text-white">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="owner" onChange={(e) => setRole(e.target.value)} className="w-5 h-5" />
                  <span className="text-lg">Owner</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="customer" onChange={(e) => setRole(e.target.value)} className="w-5 h-5" />
                  <span className="text-lg">Customer</span>
                </label>

                <button type="submit" className="bg-yellow-500 text-white w-full p-2 rounded-md mt-4 hover:bg-red-500 transition">
                  Continue
                </button>
              </form>

              <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-500">
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-100 min-h-screen">
        <div className="bg-[url('/images/bg.jpg')] bg-cover bg-center h-screen">
          <nav className="bg-blue-100 shadow-md p-4 fixed top-0 w-full z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-red-500">Bite Scape</h1>
              <ul className="hidden md:flex text-black space-x-6">
                <li className="cursor-pointer hover:text-red-500">
                <Link href="/home">Home</Link> </li>
                <li className="cursor-pointer hover:text-red-500">
                  <Link href="/about">About us</Link>
                </li>
                <li className="cursor-pointer hover:text-red-500">Outlets</li>
                <li className="cursor-pointer hover:text-red-500">
                <Link href="/contact-us">Contact Us</Link></li>
                <li className="cursor-pointer hover:text-red-500">
                  <button className="bg-red-500 p-2 rounded-md text-white" onClick={openModal}>
                    Get Started
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <section className="relative h-[80vh] flex items-center justify-center text-center">
            <Image src="/food-hero.jpg" alt="Delicious Food" layout="fill" objectFit="cover" className="opacity-70" />
            <div className="absolute text-white">
              <h1 className="text-4xl text-white">Welcome</h1>
              <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                Discover Amazing Food at Bite Scape
              </h2>
              <p className="mt-4 text-lg md:text-xl">
                Find your favorite meals from the best restaurants near you!
              </p>

              <div className="mt-6 flex items-center bg-white text-gray-700 p-2 rounded-lg shadow-lg">
                <input type="text" placeholder="Search for food, outlets..." className="p-2 w-72 outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="bg-red-500 p-3 rounded-md text-white ml-auto" onClick={handleSearch}>
                  Search
                </button>
              </div>

              {/* 🔹 Display Outlets */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {outlets.map((outlet) => (
                  <div key={outlet.id} className="p-4 border rounded-lg shadow-md cursor-pointer bg-white" onClick={() => handleOutletClick(outlet.id)}>
                    <Image src={outlet.photo_url} alt={outlet.name} width={200} height={150} className="rounded-lg" />
                    <h2 className="text-lg font-bold mt-2 text-black">{outlet.name}</h2>
                  </div>
                ))}
              </div>

              {/* 🔹 Display Food Items */}
              {selectedOutlet && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-white">Available Food Items</h2>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {foods.map((food) => (
                      <div key={food.id} className="p-4 border rounded-lg shadow-md bg-white">
                        <Image src={food.image} alt={food.name} width={200} height={150} />
                        <h3 className="text-lg font-semibold mt-2 text-black">{food.name}</h3>
                        <p className="text-gray-600">Price: ${food.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

