"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();
  const [menu] = useState([
    { id: 1, name: "Burger", price: 5.99, waitTime: "10 mins" },
    { id: 2, name: "Pizza", price: 8.99, waitTime: "15 mins" },
    { id: 3, name: "Sushi", price: 12.99, waitTime: "20 mins" },
    { id: 4, name: "Pasta", price: 7.99, waitTime: "15 mins" },
    { id: 5, name: "Salad", price: 4.99, waitTime: "5 mins" },
    { id: 6, name: "Dessert", price: 3.99, waitTime: "10 mins" },
    { id: 7, name: "Beverage", price: 2.99, waitTime: "3 mins" },
  ]);

  const addToCart = (item) => {
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
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
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
          Menu
        </h2>

        <div className="space-y-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border rounded-md bg-white shadow-md"
            >
              <div>
                <p className="text-blue-700 font-semibold">{item.name}</p>
                <p className="text-gray-600">Price: Ksh {item.price}</p>
                <p className="text-gray-600">Wait Time: {item.waitTime}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item)}
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
                  <p className="text-gray-600">Total: Ksh {item.quantity * item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-blue-700 font-semibold">
              Total: Ksh {cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => router.push(`/cart?data=${encodeURIComponent(JSON.stringify(cart))}`)}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Go To Cart
          </button>
        </div>
      )}
    </div>
  );
}
