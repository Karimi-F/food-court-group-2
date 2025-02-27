"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchOwnerOutlets, addOutlet } from "../lib/utils"; // ✅ Ensure correct path

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [isAddingOutlet, setIsAddingOutlet] = useState(false); // State for modal visibility
  const [newOutlet, setNewOutlet] = useState({ name: "", photo_url: "" }); // State for new outlet form

  const handleLogout = async() => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // signout without redirect 
      await signOut({redirect: false});
      alert("You have been logged out successfully");
      router.push("/home");
    }
  };  

  // Fetch outlets owned by the logged-in user
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/home"); // Redirect if not logged in
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchOwnerOutlets(session.user.id).then(setOutlets);
    }
  }, [status, session, router]);

  // Handle adding a new outlet
  const handleAddOutletSubmit = async (e) => {
    e.preventDefault();
    if (!newOutlet.name || !newOutlet.photo_url) return;

    const outletData = {
      ...newOutlet,
      owner_id: session.user.id, // Auto-fill the owner ID
    };

    try {
      const addedOutlet = await addOutlet(outletData);
      if (addedOutlet?.id) {
        setOutlets((prevOutlets) => [...prevOutlets, addedOutlet]);
        setNewOutlet({ name: "", photo_url: "" });
        setIsAddingOutlet(false);
        alert("Outlet added successfully!");
      }
    } catch (error) {
      console.error("Error adding outlet:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Updated Header with Owner's Name */}
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
      <h1 className="text-2xl font-bold">      
          {session?.user?.name ? `${session.user.name}'s Dashboard` : "Owner Dashboard"}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
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

      {/* Add Outlet Button */}
      <button
        onClick={() => setIsAddingOutlet(true)}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        + Add Outlet
      </button>

      {/* Add Outlet Modal */}
      {isAddingOutlet && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Outlet</h2>
            <form onSubmit={handleAddOutletSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Outlet Name"
                value={newOutlet.name}
                onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={newOutlet.photo_url}
                onChange={(e) => setNewOutlet({ ...newOutlet, photo_url: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOutlet(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



// OWNER DASHBOARD 

// import { useSession, signOut } from "next-auth/react";

//   // Handle logout with confirmation
//   const handleLogout = async () => {
//     const confirmLogout = window.confirm("Are you sure you want to log out?");
//     if (confirmLogout) {
//       // signOut without automatic redirect so we can control the flow
//       await signOut({ redirect: false });
//       alert("You have been logged out successfully");
//       router.push("/"); // Redirect to home page
//     }
//   };

//   if (status === "loading") return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header with Owner's Name and Logout Button */}
//       <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">
//           {session?.user?.name ? `${session.user.name}'s Dashboard` : "Owner Dashboard"}
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </header>

// CUSTOMER DASHBOARD
// import { useRouter } from "next/navigation"; 
// // Import useRouter for redirection
//  // Handle logout functionality
//   const handleLogout = () => {
//     // Show confirmation dialog
//     if (window.confirm("Are you sure you want to log out?")) {
//       // Optionally, clear authentication tokens or any other state here
//       window.alert("You have been logged out successfully!");
//       router.push("/"); // Redirect to home page
//     }
//   };

//   return (
//     <div className="bg-blue-100 min-h-screen p-6">
//       <Head>
//         <title>Customer Dashboard</title>
//       </Head>

//       {/* Header */}
//       <header className="mb-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl text-blue-700 font-bold">
//             Customer Name, Welcome to BiteScape Outlets
//           </h1>
//           <button 
//             className="bg-blue-700 text-white p-3 rounded" 
//             onClick={handleLogout}
//           >
//             Log out
//           </button>
//         </div>
//       </header>