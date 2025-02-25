"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ Import useParams
import { fetchMenu, addToCart, removeFromCart, closeCart } from "../../lib/utils";

export default function MenuPage() {
  const { id } = useParams(); // ✅ Get restaurant ID from URL
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [searchFood, setSearchFood] = useState("");


  
  useEffect(() => {
    if (id) {
      fetchMenu(id)
        .then((data) => {
          setMenu(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]); // ✅ Re-fetch when restaurant ID changes

  return (
    <div className="flex">
      {/* Menu Section */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h2 className="text-2xl text-blue-700 flex justify-center items-center font-bold mb-4">
          Menu for Restaurant {id} 
        </h2>
        <div className="flex justify-between gap-60 ">
  {/* Search Bar */}
  <div className="flex-1 p-4">
    <input
      type="text"
      placeholder="Search food..."
      className="w-full h-12 px-4 rounded-lg 
                 text-gray-600 text-lg
                 placeholder:text-gray-400
                 border border-gray-300
                 outline-none"
                 value={searchFood}
                 onChange={(e) => setSearchFood(e.target.value)}
    />
  </div>

  {/* Category Dropdown */}
  <div className="flex-1 p-4">
    <select
      className="w-full h-12 px-4 border rounded-lg text-blue-700"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">Pick a category</option>
      <option value="Breakfast">Breakfast</option>
      <option value="Lunch">Lunch</option>
      <option value="Snacks">Snacks</option>
      <option value="Beverages">Beverages</option>
      <option value="Desserts">Desserts</option>
    </select>
  </div>
</div>

        
        {loading && <p className="text-gray-600">Loading menu...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="space-y-4">
          {!loading &&
            !error &&
            menu
            .filter((item) => item.name.toLowerCase().includes(searchFood.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-md bg-white shadow-md"
              >
                <div>
                  <p className="text-blue-700 font-semibold">{item.name}</p>
                  <p className="text-gray-600">Price: Ksh {item.price}</p>
                  <p className="text-gray-600">Category: {item.category}</p>
                  <p className="text-gray-600">Wait Time: {item.waiting_time}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => addToCart(cart, item, setCart)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(cart, item, setCart)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div
          className="w-1/4 bg-white shadow-md fixed top-0 right-0 h-full overflow-auto p-6"
          style={{ zIndex: 999 }}
        >
          <button
            onClick={() => closeCart(setCart)}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Close Cart
          </button>
          <h2 className="text-2xl text-blue-700 font-bold mb-4">Cart</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-md bg-gray-50"
              >
                <div>
                  <p className=" text-blue-700 font-semibold">{item.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: Ksh {item.price}</p>
                  <p className="text-gray-600">
                    Total: Ksh {item.quantity * item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-blue-700 font-semibold">
              Total: Ksh{" "}
              {cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
              ).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => closeCart(setCart)}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Order
          </button>
        </div>
      )}
    </div>
  );
}
