"use client"

import Image from "next/image";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">Bite Scape</h1>
          <ul className="hidden md:flex space-x-6">
            <li className="cursor-pointer hover:text-red-500">Home</li>
            <li className="cursor-pointer hover:text-red-500">Restaurants</li>
            <li className="cursor-pointer hover:text-red-500">Categories</li>
            <li className="cursor-pointer hover:text-red-500">Contact</li>
          </ul>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md md:hidden">
            Menu
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center">
        <Image
          src="/food-hero.jpg"
          alt="Delicious Food"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
        <div className="absolute text-white">
          <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Discover Amazing Food at Bite Scape
          </h2>
          <p className="mt-4 text-lg md:text-xl">
            Find your favorite meals from the best restaurants near you!
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex items-center bg-white text-gray-700 p-2 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Search for food, restaurants..."
              className="p-2 w-72 outline-none"
            />
            <button className="bg-red-500 p-3 rounded-md text-white">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto py-16">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Burgers", img: "/burger.jpg" },
            { name: "Pasta", img: "/pasta.jpg" },
            { name: "Sushi", img: "/sushi.jpg" },
            { name: "Pizza", img: "/pizza.jpg" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src={item.img} alt={item.name} width={300} height={200} />
              <h4 className="text-center py-3 font-bold text-gray-800">{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Bite Scape. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
