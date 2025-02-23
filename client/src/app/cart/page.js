"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cart() {
  const searchParams = useSearchParams();
  const cartParam = searchParams.get("data");
  const [cart, setCart] = useState([]);

  // Sample tables data with statuses
  const [tables, setTables] = useState([
    { id: 1, name: "Table 1", status: "available" },
    { id: 2, name: "Table 2", status: "pending" },
    { id: 3, name: "Table 3", status: "booked" },
    { id: 4, name: "Table 4", status: "available" },
  ]);
  const [selectedTable, setSelectedTable] = useState(null);

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

  // Update the quantity of an item
  const updateItemQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Increase item quantity by 1
  const handleIncrement = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  // Decrease item quantity by 1 (if above 1)
  const handleDecrement = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    }
  };

  // Remove the item from the cart
  const handleDelete = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const closeCart = () => {
    // Ensure a table is selected before placing an order.
    if (!selectedTable) {
      alert("Please select a table before placing your order.");
      return;
    }
    // Update the selected table's status to pending to simulate booking.
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable) {
        return { ...table, status: "pending" };
      }
      return table;
    });
    setTables(updatedTables);
    // Implement order placement or navigation after ordering as needed.
    console.log("Order placed for table:", selectedTable);
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
                    <p className="text-blue-700 font-semibold text-lg">
                      {item.name}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="text-gray-600">
                        Quantity: {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Price: Ksh {item.price}
                    </p>
                    <p className="text-gray-600">
                      Total: Ksh {item.quantity * item.price}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dropdown for booking a table */}
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Book a Table:
              </label>
              <select
                value={selectedTable || ""}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a table</option>
                {tables.map((table) => (
                  <option
                    key={table.id}
                    value={table.id}
                    disabled={table.status !== "available"}
                    style={{
                      color: table.status === "available" ? "green" : "red",
                    }}
                  >
                    {table.name} -{" "}
                    {table.status.charAt(0).toUpperCase() +
                      table.status.slice(1)}
                  </option>
                ))}
              </select>
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
                disabled={!selectedTable}
                className={`bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-md ${
                  !selectedTable && "opacity-50 cursor-not-allowed"
                }`}
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
