"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Get restaurant ID from URL
import { fetchMenu } from "../../lib/utils";

export default function MenuPage() {
  const { id } = useParams(); // Get restaurant ID from URL
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [searchFood, setSearchFood] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const foodData = await fetchMenu(id);
        setMenu(foodData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleAddToCart = (item) => {
    // Check if the food already exists in the cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Include the entire food object (including nested outlet details) in the cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.id !== item.id));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  return (
    <div className="flex">
      {/* Menu Section */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h2 className="text-2xl text-blue-700 flex justify-center items-center font-bold mb-4">
          Menu for Restaurant {id}
        </h2>

        {/* Back to Outlets Button */}
        <button
          onClick={() => router.push("/customer-dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded-md mb-4"
        >
          Back to Outlets
        </button>

        {/* Search and Filters */}
        <div className="flex justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search food..."
            className="w-full h-12 px-4 rounded-lg text-blue-700 text-lg placeholder:text-gray-400 border border-gray-300 outline-none"
            value={searchFood}
            onChange={(e) => setSearchFood(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="w-full h-12 px-4 rounded-lg text-blue-700 text-lg placeholder:text-gray-400 border border-gray-300 outline-none"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="w-full h-12 px-4 rounded-lg text-blue-700 text-lg placeholder:text-gray-400 border border-gray-300 outline-none"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
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
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {loading && <p className="text-gray-600">Loading menu...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="space-y-4">
          {menu
            .filter((item) =>
              item.name.toLowerCase().includes(searchFood.toLowerCase())
            )
            .filter((item) => (category ? item.category === category : true))
            .filter((item) => (minPrice ? item.price >= Number(minPrice) : true))
            .filter((item) => (maxPrice ? item.price <= Number(maxPrice) : true))
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border rounded-md bg-white shadow-md"
              >
                <div>
                  <p className="text-blue-700 font-semibold">{item.name}</p>
                  <p className="text-gray-600">Price: Ksh {item.price}</p>
                  <p className="text-gray-600">Category: {item.category}</p>
                  <p className="text-gray-600">
                    Wait Time: {item.waiting_time} mins
                  </p>
                  {/* Display nested outlet details if available */}
                  {item.outlet && (
                    <div className="mt-2">
                      <p className="text-gray-700 font-medium">
                        Outlet: {item.outlet.name}
                      </p>
                      {item.outlet.photo_url && (
                        <img
                          src={item.outlet.photo_url}
                          alt={item.outlet.name}
                          className="w-16 h-16 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item)}
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
            onClick={() => setCart([])}
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
                  <p className="text-blue-700 font-semibold">{item.name}</p>
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
              {cart
                .reduce((total, item) => total + item.quantity * item.price, 0)
                .toFixed(2)}
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/cart?data=${encodeURIComponent(JSON.stringify(cart))}`)
            }
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Go To Cart
          </button>
        </div>
      )}
    </div>
  );
}
