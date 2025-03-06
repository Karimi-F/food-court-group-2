"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Calendar, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cartParam = searchParams.get("data");
  const [cart, setCart] = useState([]);
  const [isClientPresent, setIsClientPresent] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [reservations, setReservations] = useState([]); // Tables available for booking
  const [confirmedBookings, setConfirmedBookings] = useState([]); // Bookings already made
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  // Automatically set the current date and time when isClientPresent is true
  useEffect(() => {
    if (isClientPresent) {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
      setSelectedDateTime(formattedDateTime);
    }
  }, [isClientPresent]);

  // Fetch reservations (tables) from the backend
  useEffect(() => {
    fetch("https://food-court-group-2-1.onrender.com/reservations")
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, []);

  // Fetch confirmed bookings from the backend
  useEffect(() => {
    fetch("https://food-court-group-2-1.onrender.com/orders")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched confirmed bookings:", data); // Debugging
        setConfirmedBookings(data);
      })
      .catch((error) => {
        console.error("Error fetching confirmed bookings:", error);
      });
  }, []);

  // Parse cart data from URL
  useEffect(() => {
    if (cartParam) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartParam));
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart data", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [cartParam]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Determine the table's status based on the selected date/time
  const getTableStatus = (table) => {
    if (!selectedDateTime) return "N/A"; // No date selected, return "N/A"

    // Extract the date part (YYYY-MM-DD) from the selectedDateTime
    const selectedDate = new Date(selectedDateTime).toISOString().split("T")[0];

    // Check if the table is booked on the selected date
    const isBooked = confirmedBookings.some((booking) => {
      if (!booking.datetime) return false; // Handle cases where datetime is missing

      // Extract the date part (YYYY-MM-DD) from the booking datetime
      const bookingDate = new Date(booking.datetime).toISOString().split("T")[0];

      // Check if the table is booked on the same date
      return booking.tablereservation_id === table.id && bookingDate === selectedDate;
    });

    return isBooked ? "booked" : "available";
  };

  // Submit the order
  const handleSubmit = async () => {
    if (!selectedDateTime) {
      alert("Please select a date and time before placing your order.");
      return;
    }
    if (!selectedTable) {
      alert("Please select a table before placing your order.");
      return;
    }

    const customer_id = session?.user?.id;
    if (!customer_id) {
      alert("Please log in to place an order.");
      router.push("/customer-login");
      return;
    }

    setOrderStatus("Please wait as your order is being confirmed...");

    const groupedOrders = cart.reduce((acc, item) => {
      if (!item.outlet_id) return acc;

      let outletOrder = acc.find((order) => order.outlet_id === item.outlet_id);
      if (!outletOrder) {
        outletOrder = {
          outlet_id: item.outlet_id,
          items: [],
        };
        acc.push(outletOrder);
      }

      outletOrder.items.push({
        food_id: item.id,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      });

      return acc;
    }, []);

    const orderData = {
      customer_id: customer_id,
      tablereservation_id: selectedTable,
      order_datetime: selectedDateTime.length === 16 ? selectedDateTime + ":00" : selectedDateTime,
      orders: groupedOrders,
    };

    try {
      const res = await fetch("https://food-court-group-2-1.onrender.com/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (res.ok) {
        setOrderStatus("Your order has been confirmed!");

        localStorage.setItem(
          "recentOrder",
          JSON.stringify({
            foodItems: cart.flatMap((outlet) => {
              if (!outlet || !outlet.items) return [];
              return outlet.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
              }));
            }),
            orderTime: selectedDateTime,
          })
        );

        setTimeout(() => {
          router.push("/customer-dashboard");
        }, 2000);
      } else {
        setOrderStatus(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus("Error placing order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#ff575a] flex flex-col items-center p-4">
      <div className="w-full max-w-screen-lg bg-white rounded-2xl shadow-xl p-6 border border-[#ff575a]/10">
        <div className="flex items-center justify-center mb-6">
          <ToastContainer position="bottom-right" autoClose={5000} />
          <ShoppingCart className="text-[#ff575a] mr-3 h-8 w-8" />
          <h2 className="text-3xl sm:text-4xl text-[#ff575a] font-bold text-center">
            {session?.user?.name ? `${session.user.name}'s Cart` : "Your Cart"}
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-[#ff575a]/30 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {Array.isArray(cart) &&
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border rounded-xl bg-white shadow-sm transition transform hover:bg-[#ffeeee] hover:border-[#ff575a]/20"
                  >
                    <div className="w-full">
                      <p className="text-[#ff575a] font-semibold text-lg">{item.name}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-gray-700 font-medium px-3 py-1 bg-[#ffeeee] rounded-md">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-gray-700">
                        <p>Price: Ksh {item.price}</p>
                        <span className="hidden sm:block">•</span>
                        <p className="font-medium">Total: Ksh {item.quantity * item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8">
              <div className="bg-[#ffeeee] border border-[#ff575a]/20 p-5 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-[#ff575a] mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Order Summary
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {Array.isArray(cart) &&
                    cart.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.name} {item.quantity > 1 ? ` x${item.quantity}` : ""}
                        </span>
                        <span className="font-medium">Ksh {item.quantity * item.price}</span>
                      </li>
                    ))}
                  <li className="border-t border-[#ff575a]/20 pt-2 mt-2 font-bold text-[#ff575a] flex justify-between">
                    <span>Total</span>
                    <span>Ksh {cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</span>
                  </li>
                </ul>
                {selectedDateTime && (
                  <p className="mt-3 text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[#ff575a]" />
                    Time to be served: {selectedDateTime}
                  </p>
                )}
              </div>
            </div>

            {/* Client Presence Selection */}
            <div className="mt-8 p-5 border border-[#ff575a]/20 rounded-xl bg-white">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#ff575a]" />
                Are you at the restaurant now?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
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
                    className="mr-2 accent-[#ff575a]"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clientPresent"
                    value="no"
                    checked={isClientPresent === false}
                    onChange={() => {
                      setIsClientPresent(false);
                      setSelectedDateTime("");
                    }}
                    className="mr-2 accent-[#ff575a]"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Date and Time Picker */}
            {isClientPresent === false && (
              <div className="mt-6 p-5 border border-[#ff575a]/20 rounded-xl bg-white">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#ff575a]" />
                  Select Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={selectedDateTime}
                  onChange={(e) => {
                    setSelectedDateTime(e.target.value);
                    setSelectedTable(null);
                  }}
                  className="w-full p-3 border border-[#ff575a]/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff575a] bg-[#ffeeee] text-gray-800"
                />
              </div>
            )}

            {/* Immediate Booking Message */}
            {isClientPresent === true && (
              <div className="mt-6 p-4 bg-[#ffeeee] rounded-lg border border-[#ff575a]/20">
                <p className="text-gray-700 font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#ff575a]" />
                  Booking for immediate seating at: {selectedDateTime}
                </p>
              </div>
            )}

            {/* Table Booking Dropdown */}
            <div className="mt-6 p-5 border border-[#ff575a]/20 rounded-xl bg-white">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#ff575a]" />
                Book a Table:
              </label>
              <select
                value={selectedTable || ""}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                disabled={!selectedDateTime} // Disable if no date selected
                className="w-full p-3 border border-[#ff575a]/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff575a] bg-[#ffeeee] text-gray-800 disabled:opacity-60"
              >
                {/* Default Option */}
                <option value="">
                  {selectedDateTime ? "Select a table" : "Select date first"}
                </option>

                {/* Loop through tables */}
                {reservations.map((table) => {
                  const status = getTableStatus(table);
                  const isDisabled = status !== "available"; // Disable booked tables

                  return (
                    <option
                      key={table.id}
                      value={table.id}
                      disabled={isDisabled}
                      className={isDisabled ? "text-red-500" : "text-green-600"}
                    >
                      {table.table_name} - {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Notification Message */}
            {orderStatus && (
              <div className="mt-6 p-4 bg-[#ffeeee] border border-[#ff575a]/30 text-gray-700 rounded-lg">
                {orderStatus}
              </div>
            )}

            {/* Place Order Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
              <p className="text-[#ff575a] font-bold text-xl mb-4 sm:mb-0">
                Total: Ksh {cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
              </p>
              <button
                onClick={handleSubmit}
                disabled={!selectedDateTime || !selectedTable}
                className={`bg-[#ff575a] hover:bg-[#ff575a]/90 transition text-white px-8 py-3 rounded-xl font-medium shadow-md ${
                  (!selectedDateTime || !selectedTable) && "opacity-50 cursor-not-allowed"
                }`}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}