"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Facebook,
  Youtube,
  Instagram,
  ArrowRight,
  Search,
} from "lucide-react";
import { fetchOutlets } from "../lib/utils";

export default function Home() {
   const popularDelicacies = [
    {
      Outlet: "Wellsy's Sweet Treat",
      name: "Oreo Milkshake",
      price: "Ksh. 450",
      image:
        "https://images.unsplash.com/photo-1586917049334-0f99406d8a6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQwfHx8ZW58MHx8fHx8",
    },
    {
      Outlet: "Wine and Dine",
      name: "Sauvignon Blanc & Salmon",
      price: "Ksh. 13000",
      image:
        "https://images.unsplash.com/photo-1565895405227-31cffbe0cf86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D",
    },
    {
      Outlet: "Maxxie Sushi",
      name: "Fusion Crunch Platter",
      price: "Ksh. 2000",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VzaGl8ZW58MHx8MHx8fDA%3D",
    },
    {
      Outlet: "Tacos and Taps",
      name: "Boba Tea",
      price: "Ksh. 400",
      image:
        "https://images.unsplash.com/photo-1529474944862-bf4949bd2f1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmV2ZXJhZ2VzJTIwYm9iYXxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

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

  const getOutlets = useCallback(async () => {
    const data = await fetchOutlets({
      outlet: searchOutlet,
      food: searchFood,
    });
    setOutlets(data);
  }, [searchOutlet, searchFood]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOutlets();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchOutlet, searchFood, getOutlets]);

  // Fetch Outlets Based on Search
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
      setOutlets(data);
    } catch (error) {
      console.error("Error fetching outlets:", error);
    }
  };

  // Fetch Food Items When an Outlet is Clicked
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
      setFoods(data);
    } catch (error) {
      console.error("Error fetching food:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md p-4 fixed top-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#FF6B6B]">
            BiteScape
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#FF6B6B]">
              Home
            </Link>
            <Link href="/foodmenu">Menu</Link>
            <Link href="/about">About us</Link>
            <Link href="/contact-us">Contact us</Link>
          </nav>
          <button
            className="px-6 py-2 rounded-full border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors"
            onClick={openModal}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#FF6B6B] p-6 rounded-lg shadow-md max-w-md w-full">
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
                className="bg-white text-[#FF6B6B] w-full p-2 rounded-md mt-4 hover:bg-gray-100 transition"
              >
                Continue
              </button>
            </form>

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 h-[80vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZvb2R8ZW58MHx8MHx8fDA%3D"
          alt="Delicious Food"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-black drop-shadow-lg">
              Welcome
              <span className="block text-[#FF6B6B]">Discover Amazing Food at Bite Scape</span>
            </h1>
            <p className="text-black text-lg drop-shadow-md">
            Find your favorite meals from the best restaurants near you!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Search outlets..."
                  className="w-full h-12 px-6 rounded-full 
                  bg-white text-gray-700 text-lg
                  placeholder:text-gray-400
                  border border-gray-300
                  outline-none"
                  value={searchOutlet}
                  onChange={(e) => setSearchOutlet(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF6B6B] p-2 rounded-full text-white"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <button className="px-6 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#FF5B5B] transition-colors">
                Order Now
              </button>
              <button className="px-6 py-3 flex items-center gap-2 text-white hover:text-[#FF6B6B] transition-colors">
                Download app <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Delicacies */}
      {popularDelicacies.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-gray-50">
          <h2 className="text-3xl font-bold mb-8">Featured Delicacies</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDelicacies.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative mb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500">{item.Outlet}</p>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#FF6B6B] font-bold">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outlets Section */}
      {outlets.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Available Outlets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outlets.map((outlet, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative mb-4">
                  <img
                    src={
                      outlet.photo_url ||
                      "/placeholder.svg?height=200&width=350"
                    }
                    alt={outlet.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-lg text-[#FF6B6B]">
                  {outlet.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {outlet.description}
                </p>
                <Link href={`/foodmenu/${outlet.id}`}>
                  <button className="mt-4 w-full bg-[#FF6B6B] text-white p-2 rounded-md hover:bg-[#FF5B5B] transition-colors">
                    View Menu
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        <Link href="#" className="text-gray-400 hover:text-[#FF6B6B]">
          <Facebook className="w-6 h-6" />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-[#FF6B6B]">
          <Youtube className="w-6 h-6" />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-[#FF6B6B]">
          <Instagram className="w-6 h-6" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-6 border-t">
        <p>&copy; 2025 BiteScape. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
