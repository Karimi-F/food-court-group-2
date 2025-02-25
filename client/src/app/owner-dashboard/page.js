"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchOwnerOutlets } from "../lib/utils"; // ✅ Ensure correct path

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if not logged in
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchOwnerOutlets(session.user.id).then(setOutlets);
    }
  }, [status, session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Owner Dashboard
      </header>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {outlets.length > 0 ? (
          outlets.map((outlet) => (
            <div key={outlet.id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{outlet.name}</h2>
              <p className="text-gray-500">{outlet.owner?.name}</p>

              {/* View Menu Button */}
              <button
                onClick={() => router.push(`/menu/${outlet.id}`)} 
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Menu
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No outlets found.</p>
        )}
      </div>
    </div>
  );
}
