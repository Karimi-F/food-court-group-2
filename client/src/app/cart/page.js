"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cart() {
  const searchParams = useSearchParams();
  const router = useRouter(); // For redirection
  const cartParam = searchParams.get("data");
  const [cart, setCart] = useState([]);

  // New state for checking if the client is present at the restaurant
  const [isClientPresent, setIsClientPresent] = useState(null);

  // State for the date and time selected by the customer
  const [selectedDateTime, setSelectedDateTime] = useState("");

  // Dummy confirmed bookings (simulate tables already booked)
  const [confirmedBookings, setConfirmedBookings] = useState([
    { tableId: 3, datetime: "2025-02-23T10:30" },
  ]);

  // Sample tables data
  const [tables, setTables] = useState([
    { id: 1, name: "Table 1" },
    { id: 2, name: "Table 2" },
    { id: 3, name: "Table 3" },
    { id: 4, name: "Table 4" },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

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
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
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

  // Determine the table's status based on the selected date/time
  const getTableStatus = (table) => {
    if (!selectedDateTime) return "N/A";
    const isBooked = confirmedBookings.some(
      (booking) =>
        booking.tableId === table.id && booking.datetime === selectedDateTime
    );
    return isBooked ? "booked" : "available";
  };

  // Send the order data to the Flask API endpoint and redirect customer
  const placeOrder = async () => {
    if (!selectedDateTime) {
      alert("Please select a date and time before placing your order.");
      return;
    }
    if (!selectedTable) {
      alert("Please select a table before placing your order.");
      return;
    }
    setOrderStatus("Please wait as your order is being confirmed...");

    const orderData = {
      cart,
      tableId: selectedTable,
      datetime: selectedDateTime,
      total: cart.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (res.ok) {
        setOrderStatus("Your order has been confirmed!");

        // Save the order summary in localStorage to display on the dashboard
        localStorage.setItem(
          "recentOrder",
          JSON.stringify({
            foodItems: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
            })),
            orderTime: selectedDateTime,
          })
        );

        // Redirect the customer to their dashboard after order confirmation
        setTimeout(() => {
          router.push("/customer-dashboard");
        }, 2000);
      } else {
        console.error("Server error:", result);
        setOrderStatus(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus("Error placing order. Please try again.");
    }
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
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-gray-600 font-medium">
                        Quantity: {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-600 mt-2">Price: Ksh {item.price}</p>
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

            {/* Order Summary Card */}
            <div className="mt-6">
              <div className="bg-green-50 border border-green-300 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  Order Summary
                </h3>
                <ul className="list-disc list-inside text-green-800">
                  {cart.map((item) => (
                    <li key={item.id}>
                      {item.name}
                      {item.quantity > 1 ? ` x${item.quantity}` : ""}
                    </li>
                  ))}
                </ul>
                {selectedDateTime && (
                  <p className="mt-2 text-green-800">
                    Time to be served: {selectedDateTime}
                  </p>
                )}
              </div>
            </div>

            {/* Client Presence Selection */}
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Are you at the restaurant now?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientPresent"
                    value="yes"
                    checked={isClientPresent === true}
                    onChange={() => {
                      setIsClientPresent(true);
                      // Auto set current date & time for immediate booking
                      const now = new Date().toISOString().slice(0, 16);
                      setSelectedDateTime(now);
                    }}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientPresent"
                    value="no"
                    checked={isClientPresent === false}
                    onChange={() => {
                      setIsClientPresent(false);
                      setSelectedDateTime(""); // Allow selection for future booking
                    }}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Date and Time Picker (only shown if client is not yet there) */}
            {isClientPresent === false && (
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={selectedDateTime}
                  onChange={(e) => {
                    setSelectedDateTime(e.target.value);
                    // Reset table selection when datetime changes
                    setSelectedTable(null);
                  }}
                  className="w-full p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800"
                />
              </div>
            )}

            {/* If client is present, display the auto-set date and time */}
            {isClientPresent === true && (
              <div className="mt-6">
                <p className="text-gray-700 font-semibold">
                  Booking for immediate seating at: {selectedDateTime}
                </p>
              </div>
            )}

            {/* Dropdown for booking a table */}
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Book a Table:
              </label>
              <select
                value={selectedTable || ""}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                disabled={!selectedDateTime}
                className="w-full p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800"
              >
                <option value="">
                  {selectedDateTime
                    ? "Select a table"
                    : "Select date & time first"}
                </option>
                {tables.map((table) => {
                  const status = getTableStatus(table);
                  return (
                    <option
                      key={table.id}
                      value={table.id}
                      disabled={status !== "available"}
                      style={{
                        color: status === "available" ? "green" : "red",
                      }}
                    >
                      {table.name} -{" "}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Notification Message */}
            {orderStatus && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
                {orderStatus}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
              <p className="text-blue-700 font-semibold text-xl mb-4 sm:mb-0">
                Total: Ksh{" "}
                {cart
                  .reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                  )
                  .toFixed(2)}
              </p>
              <button
                onClick={placeOrder}
                disabled={!selectedDateTime || !selectedTable}
                className={`bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-md ${
                  (!selectedDateTime || !selectedTable) &&
                  "opacity-50 cursor-not-allowed"
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
