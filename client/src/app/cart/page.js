"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cart() {
  const searchParams = useSearchParams();
  const cartParam = searchParams.get("data");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartParam) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartParam));
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, [cartParam]);

  const closeCart = () => {
    // Implement order placement or navigation after ordering as needed.
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-4">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl sm:text-4xl text-blue-700 font-bold mb-6 text-center">
          Customer's Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md bg-gray-50 shadow-sm transition transform hover:scale-105"
                >
                  <div className="w-full">
                    <p className="text-blue-700 font-semibold text-lg">{item.name}</p>
                    <p className="text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: Ksh {item.price}</p>
                    <p className="text-gray-600">
                      Total: Ksh {item.quantity * item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
              <p className="text-blue-700 font-semibold text-xl mb-4 sm:mb-0">
                Total: Ksh{" "}
                {cart
                  .reduce((total, item) => total + item.quantity * item.price, 0)
                  .toFixed(2)}
              </p>
              <button
                onClick={closeCart}
                className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-md"
              >
                Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
