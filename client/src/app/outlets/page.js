"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { fetchOutlets } from "../lib/utils";

export default function Outlets() {
  const { data:session, status } = useSession();
  const router = useRouter();
  const [searchOutlet, setSearchOutlet] = useState("");
  const [outlets, setOutlets] = useState([]);
  


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
    <div className="bg-[#ffeeee] min-h-screen p-6">
      <Head>
        <title>All  Outlets</title>
      </Head>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-[#ff575a] font-bold">
            All BiteScape Outlets
          </h1>
          <div className="flex gap-2">
            <Link href="/home">
              <button className="bg-white text-[#ff575a] p-3 rounded">
                ← Back to Home
              </button>
            </Link>
            {/* <button 
          onClick={handleLogout}
          className="bg-[#ff575a] text-white p-3 rounded hover:bg-[#e04e50] transition">Log out</button> */}
          </div>
        </div>
      </header>


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
                src={outlet.photo_url} // Ensure this matches your API response key
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