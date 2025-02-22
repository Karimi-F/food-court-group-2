"use client"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// export default function Dashboard(){
//     const {data: session, status}= useSession()
//     const router = useRouter();
    
//         useEffect(() => {
//             if (status === "unauthenticated") {
//                 router.push("/owner-login"); // Redirect to login page
//             }
//         }, [status, router]);
    
//         if (status === "loading") return <p>Loading...</p>;
    
//         return (
//             <>
//                 <h1>Hi {session?.user?.name}, <br />Welcome to your dashboard</h1>
//             </>
//     )   
// }


import { useEffect, useState } from "react";
// import RestaurantCard from "@/components/RestaurantCard";
// import CartSummary from "@/components/CartSummary";
// import OrderHistory from "@/components/OrderHistory";

// export default function Dashboard() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCuisine, setFilterCuisine] = useState("");
//   const [cart, setCart] = useState([]);
//   const [orderHistory, setOrderHistory] = useState([]);

//   useEffect(() => {
//     async function fetchRestaurants() {
//       const res = await fetch("/api/restaurants"); // Replace with Flask API later
//       const data = await res.json();
//       setRestaurants(data);
//     }
//     fetchRestaurants();
//   }, []);

//   const filteredRestaurants = restaurants.filter((restaurant) =>
//     restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//     (filterCuisine ? restaurant.cuisine === filterCuisine : true)
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">Food Court Restaurants</h1>
      
//       {/* Search & Filters */}
//       <div className="mb-4 flex gap-4">
//         <input 
//           type="text"
//           placeholder="Search restaurants..."
//           className="p-2 border rounded w-full"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select
//           className="p-2 border rounded"
//           onChange={(e) => setFilterCuisine(e.target.value)}
//         >
//           <option value="">All Cuisines</option>
//           <option value="Japanese">Japanese</option>
//           <option value="Italian">Italian</option>
//           <option value="Indian">Indian</option>
//         </select>
//       </div>

//       {/* Restaurant Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {filteredRestaurants.map((restaurant) => (
//           <RestaurantCard key={restaurant.id} restaurant={restaurant} setCart={setCart} />
//         ))}
//       </div>

//       {/* Cart Summary & Order History */}
//       <div className="mt-6 flex flex-col md:flex-row gap-6">
//         <CartSummary cart={cart} />
//         <OrderHistory orderHistory={orderHistory} />
//       </div>
//     </div>
//   );
// }



import Head from "next/head";

export default function CustomerDashboard() {
//     const {data: session, status}= useSession()
//     const router = useRouter();
    
//         useEffect(() => {
//             if (status === "unauthenticated") {
//                 router.push("/owner-login"); // Redirect to login page
//             }
//         }, [status, router]);
    
//         if (status === "loading") return <p>Loading...</p>;
    
//         return (
//             <>
//                 <h1>Hi {session?.user?.name}, <br />Welcome to your dashboard</h1>
//             </>
//     )   
// }
  return (
    <div className="bg-blue-100 min-h-screen p-6">
      <Head>
        <title>Customer Dashboard</title>
      </Head>

      {/* Header */}
      <header className="mb-6" >
        <div className="flex justify-between">
        <h1 className="text-3xl text-blue-700 font-bold">{name}Customer Name, Welcome to BiteScape Outlets</h1>
        
        <button className="mt-2 bg-blue-700 text-white p-3 rounded ">
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
        />
        <input
          type="text"
          placeholder="Search food..."
          className="p-2 text-blue-700 border rounded w-full md:w-2/3"
        />
        <select className="p-2 border rounded w-full md:w-1/3 text-blue-700">
          <option value="" >Pick a category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Beverages">Beverages</option>
          <option value="Dessert">Desserts</option>
        </select>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Sushi World", "Pasta Palace", "Spicy Delight", "NiChef Delicacies","Kenyan Food", "Congolese Food"].map((name, index) => (
          <div key={index} className="border p-4 rounded-lg shadow bg-white">
            <h2 className="text-xl text-blue-700 font-bold">{name}</h2>
            {/* <p className="text-gray-600">{name}</p> */}
            <p className="text-gray-800">Description(20 words){name}</p>
            {/* <p className="text-yellow-500">⭐ 4.5</p> */}
            <button className="mt-2 bg-blue-700 text-white p-2 rounded w-full">
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
