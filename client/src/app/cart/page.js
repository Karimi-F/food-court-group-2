"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Cart() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cartParam = searchParams.get("data");
  const [cart, setCart] = useState([]);
  
  // States for client presence, date/time, table selection, and order lifecycle
  const [isClientPresent, setIsClientPresent] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);

  // Dummy booking data and tables list
  const [confirmedBookings] = useState([
    { tableId: 3, datetime: "2025-02-23T10:30" },
  ]);
  const [tables] = useState([
    { id: 1, name: "Table 1" },
    { id: 2, name: "Table 2" },
    { id: 3, name: "Table 3" },
    { id: 4, name: "Table 4" },
  ]);

  // Order status and countdown timer states
  const [orderStatus, setOrderStatus] = useState("");
  const [countdown, setCountdown] = useState(null);

  // Parse and normalize the cart data
  useEffect(() => {
    if (cartParam) {
      try {
        const decoded = decodeURIComponent(cartParam);
        const parsed = JSON.parse(decoded);
        console.log("Parsed cart data:", parsed);
        // Ensure parsed data is an array
        if (!Array.isArray(parsed)) {
          console.error("Cart data is not an array:", parsed);
          setCart([]);
          return;
        }
        // Normalize each item
        const normalized = parsed.map((item) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || (item.outlet && item.outlet.name) || "Unnamed Food",
          price: Number(item.price) || 0,
          waiting_time: item.waiting_time || "",
          quantity: item.quantity ? Number(item.quantity) : 1,
          outlet: item.outlet || null,
          category: item.category || "",
        }));
        console.log("Normalized cart data:", normalized);
        setCart(normalized);
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        setCart([]);
      }
    }
  }, [cartParam]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setOrderStatus("Served!");
      setTimeout(() => {
        setOrderStatus("Completed!");
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Helpers for quantity adjustments
  const updateItemQuantity = (id, newQuantity) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updated);
  };

  const handleIncrement = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrement = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    }
  };

  const handleDelete = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
  };

  // Determine table status based on selected date/time
  const getTableStatus = (table) => {
    if (!selectedDateTime) return "N/A";
    const isBooked = confirmedBookings.some(
      (booking) =>
        booking.tableId === table.id && booking.datetime === selectedDateTime
    );
    return isBooked ? "booked" : "available";
  };

  // Place order and simulate lifecycle
  const placeOrder = async () => {
    if (!session?.user?.id) {
      alert("Please log in to place an order.");
      router.push("/customer-login");
      return;
    }

    if (!selectedDateTime) {
      alert("Please select a date and time before placing your order.");
      return;
    }
    if (!selectedTable) {
      alert("Please select a table before placing your order.");
      return;
    }

    setOrderStatus("Pending...");

    const orderItems = cart.map((item) => ({
      food_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      customer_id: session.user.id,
      tableId: selectedTable,
      datetime: selectedDateTime,
      total: cart.reduce((total, item) => total + item.quantity * item.price, 0),
      order_items: orderItems,
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "recentOrder",
          JSON.stringify({
            id: result.id, // assuming backend returns order id
            order_items: cart.map((item) => ({
              food: {
                id: item.id,
                name: item.name,
                price: item.price,
                waiting_time: item.waiting_time,
                category: item.category,
                outlet: item.outlet,
              },
              quantity: item.quantity,
            })),
            orderTime: selectedDateTime,
            status: "Pending...",
          })
        );

        setTimeout(() => {
          setOrderStatus("Confirmed!");
          setCountdown(300);
        }, 2000);

        setTimeout(() => {
          router.push("/customer-dashboard");
        }, 4000);
      } else {
        console.error("Server error:", result);
        setOrderStatus(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus("Error placing order. Please try again.");
    }
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-4">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl sm:text-4xl text-blue-700 font-bold mb-6 text-center">
          {session?.user?.name ? `${session.user.name}'s Cart` : "Customer Cart"}
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
                    {item.waiting_time && (
                      <p className="text-gray-600">
                        Waiting Time: {item.waiting_time} mins
                      </p>
                    )}
                    {item.outlet && (
                      <div className="mt-1">
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

            {/* Order Summary */}
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
                      setSelectedDateTime("");
                    }}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Date & Time Picker */}
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
                    setSelectedTable(null);
                  }}
                  className="w-full p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800"
                />
              </div>
            )}

            {isClientPresent === true && (
              <div className="mt-6">
                <p className="text-gray-700 font-semibold">
                  Booking for immediate seating at: {selectedDateTime}
                </p>
              </div>
            )}

            {/* Table Booking Dropdown */}
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
                  {selectedDateTime ? "Select a table" : "Select date & time first"}
                </option>
                {tables.map((table) => {
                  const status = getTableStatus(table);
                  return (
                    <option
                      key={table.id}
                      value={table.id}
                      disabled={status !== "available"}
                      style={{ color: status === "available" ? "green" : "red" }}
                    >
                      {table.name} - {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Order Status & Countdown */}
            {orderStatus && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
                <p>{orderStatus}</p>
                {orderStatus === "Confirmed!" && countdown !== null && (
                  <p>Estimated time until served: {formatCountdown(countdown)}</p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
              <p className="text-blue-700 font-semibold text-xl mb-4 sm:mb-0">
                Total: Ksh{" "}
                {cart
                  .reduce((total, item) => total + item.quantity * item.price, 0)
                  .toFixed(2)}
              </p>
              <button
                onClick={placeOrder}
                disabled={!selectedDateTime || !selectedTable}
                className={`bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-md ${
                  (!selectedDateTime || !selectedTable) && "opacity-50 cursor-not-allowed"
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
