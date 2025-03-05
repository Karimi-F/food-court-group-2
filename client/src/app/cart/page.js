"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Minus, Plus, Trash2, ShoppingCart, Calendar, MapPin } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Cart() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter() // For redirection
  const cartParam = searchParams.get("data")
  const [cart, setCart] = useState([])
  const [orderItems, setOrderItems] = useState([]);


  // New state for checking if the client is present at the restaurant
  const [isClientPresent, setIsClientPresent] = useState(true);

  // State for the date and time selected by the customer
  const [selectedDateTime, setSelectedDateTime] = useState("")

  // Dummy confirmed bookings (simulate tables already booked)
  const [confirmedBookings, setConfirmedBookings] = useState([{ tableId: 3, datetime: "2025-02-23T10:30" }])

  // Sample tables data
  const [tables, setTables] = useState([
    { id: 1, name: "Table 1" },
    { id: 2, name: "Table 2" },
    { id: 3, name: "Table 3" },
    { id: 4, name: "Table 4" },
    { id: 5, name: "Table 5" },
    { id: 6, name: "Table 6" },
    { id: 7, name: "Table 7" },
    { id: 8, name: "Table 8" },
    { id: 9, name: "Table 9" },
    { id: 10, name: "Table 10" },
    { id: 11, name: "Table 11" },
    { id: 12, name: "Table 12" },
    { id: 13, name: "Table 13" },
    { id: 14, name: "Table 14" },
    { id: 15, name: "Table 15" },
  ])

  const [selectedTable, setSelectedTable] = useState(null)
  const [orderStatus, setOrderStatus] = useState("")

  useEffect(() => {
    if (cartParam) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartParam));
        if (Array.isArray(parsedCart)){
          setCart(parsedCart);
        } else{
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart data", error)
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [cartParam]);

  // Add food item to the cart and trigger toast notification
  const handleAddToCart = (item) => {
    // Add item to cart state
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);

    // Show toast notification
    toast.success(
      <>
        <div>Added to cart!</div>
        <button 
          onClick={() => router.push('/cart')} 
          style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', border: 'none' }}
        >
          Go to Cart
        </button>
      </>,
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,  // Close after 3 seconds
      }
    );
  };

  // Update the quantity of an item
  const updateItemQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) => 
      (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCart(updatedCart);

    const updatedOrderItems = updatedCart.map((item) =>({
      item_id: item.id,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
    }));
  
    setOrderItems(updatedOrderItems);
  }

  // Increase item quantity by 1
  const handleIncrement = (id) => {
    const item = cart.find((item) => item.id === id)
    if (item) {
      updateItemQuantity(id, item.quantity + 1)
    }
  }

  // Decrease item quantity by 1 (if above 1)
  const handleDecrement = (id) => {
    const item = cart.find((item) => item.id === id)
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1)
    }
  };

  // Remove the item from the cart
  const handleDelete = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)

    const updatedOrderItems = updatedCart.map((item) =>({
      item_id: item.id,
      quantity: quantity,
      total_price: item.price * item.quantity,
    }))

    setOrderItems(updatedOrderItems);
  }

  // Determine the table's status based on the selected date/time
  const getTableStatus = (table) => {
    if (!selectedDateTime) return "N/A"
    const isBooked = confirmedBookings.some(
      (booking) => booking.tableId === table.id && booking.datetime === selectedDateTime,
    )
    return isBooked ? "booked" : "available"
  }

  // Send the order data to the Flask API endpoint and redirect customer
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
      return; // Ensure function stops here
    }
  
    console.log("Customer ID: ", customer_id);
  
    setOrderStatus("Please wait as your order is being confirmed...");
    console.log(cart)
    // ✅ Convert cart to match the backend's expected format
    const orders = cart.reduce((acc, item) => {
      let outlet = acc.find((o) => o.outlet_id === item.outlet_id);
      if (!outlet) {
        outlet = { outlet_id: item.outlet_id, items: [] };
        acc.push(outlet);
      }
      outlet.items.push({
        food_id: item.id,
        quantity: item.quantity,
        total_price: item.quantity * item.price,
      });
      return acc;
    }, []);
  
    const orderData = {
      customer_id: customer_id,
      tablereservation_id: selectedTable,
      order_datetime: selectedDateTime.length === 16 ? selectedDateTime + ":00" : selectedDateTime,
      orders: orders, // ✅ Backend expects "orders" not "cart"
    };
  
    console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Debugging log
  
    try {
      const res = await fetch("http://localhost:5000/place-order", {
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
        setOrderStatus(`Failed to place order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus("Error placing order. Please try again.");
    }
  };
  

  // const handleSubmit = async () => {
  //   try {
  //     if (!cart.length) {
  //       setOrderStatus("Your cart is empty!");
  //       return;
  //     }
      
  //     const formattedDateTime = selectedDateTime ? new Date(selectedDateTime).toISOString() : null; // Format date-time as a string

  //     const outletId = cart.length > 0 ? cart[0].outlet_id: null;
  //     if (!outletId){
  //       setOrderStatus("Outlet ID is missing. Please try again.");
  //       return;
  //     }

  //     console.log("Cart contents:", cart);
  //     console.log("Extracted outlet ID:", outletId);

  //     const formattedOrderItems = cart.map((item) => ({
  //         item_id: item.id,
  //         quantity: item.quantity,
  //         total_price: item.price * item.quantity,
  //       }));  
        
  //     if (formattedOrderItems.length === 0){
  //       setOrderStatus("Your cart is empty. Add items before placing an order.");
  //       return;
  //     }  
        
  //       const requestBody = {
  //         customer_id: session?.user?.id,
  //         tablereservation_id: selectedTable,
  //         outlet_id: outletId, // Ensure outlet_id is included
  //         orders: formattedOrderItems,
  //         order_datetime: formattedDateTime,
  //       };  

  //     const response = await fetch("http://127.0.0.1:5000/place-order",{
  //       method: "POST",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify(requestBody),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to place order.");
  //     }

  //     const responseData = await response.json();
  //     console.log("Order placed successfully:", responseData);

  //     setOrderStatus("Your order has been placed!");

  //     localStorage.setItem(
  //       "recentOrder",
  //       JSON.stringify({
  //         foodItems: formattedOrderItems,
  //         orderTime: formattedDateTime,
  //       })
  //     );
  //         setTimeout(() => {
  //           router.push("/customer-dashboard");
  //         }, 2000);
  //       }catch(error){
  //         console.error("Error placing order:", error.message);
  //         setOrderStatus("Error placing order. Please try again.");
  //       }
  //     };

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
              {Array.isArray(cart) && cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border rounded-xl bg-white shadow-sm transition transform hover:shadow-md hover:border-[#ff575a]/30"
                >
                  <div className="w-full">
                    <p className="text-[#ff575a] font-semibold text-lg">{item.name}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-[#ffeeee] text-[#ff575a] p-2 rounded-full hover:bg-[#ff575a]/10 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-gray-700 font-medium px-3 py-1 bg-[#ffeeee] rounded-md">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-[#ffeeee] text-[#ff575a] p-2 rounded-full hover:bg-[#ff575a]/10 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-gray-700">
                      <p>Price: Ksh {item.price}</p>
                      <span className="hidden sm:block">•</span>
                      <p className="font-medium">Total: Ksh {item.quantity * item.price}</p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-[#ff575a] hover:bg-[#ff575a]/90 transition text-white px-4 py-2 rounded flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="mt-8">
              <div className="bg-[#ffeeee] border border-[#ff575a]/20 p-5 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-[#ff575a] mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Order Summary
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {Array.isArray(cart) && cart.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.name} {item.quantity > 1 ? ` x${item.quantity}` : ""}
                      </span>
                      <span className="font-medium">Ksh {item.quantity * item.price}</span>
                    </li>
                  ))}
                  <li className="border-t border-[#ff575a]/20 pt-2 mt-2 font-bold text-[#ff575a] flex justify-between">
                    <span>Total</span>
                    <span>Ksh {""}
                      {cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</span>
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
                      setIsClientPresent(true)
                      // Auto set current date & time for immediate booking
                      const now = new Date().toISOString().slice(0, 16)
                      setSelectedDateTime(now)
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
                      setIsClientPresent(false)
                      setSelectedDateTime("") // Allow selection for future booking
                    }}
                    className="mr-2 accent-[#ff575a]"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Date and Time Picker (only shown if client is not yet there) */}
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
                    setSelectedDateTime(e.target.value)
                    // Reset table selection when datetime changes
                    setSelectedTable(null)
                  }}
                  className="w-full p-3 border border-[#ff575a]/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff575a] bg-[#ffeeee] text-gray-800"
                />
              </div>
            )}

            {/* If client is present, display the auto-set date and time */}
            {isClientPresent === true && (
              <div className="mt-6 p-4 bg-[#ffeeee] rounded-lg border border-[#ff575a]/20">
                <p className="text-gray-700 font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#ff575a]" />
                  Booking for immediate seating at: {selectedDateTime}
                </p>
              </div>
            )}

            {/* Dropdown for booking a table */}
            <div className="mt-6 p-5 border border-[#ff575a]/20 rounded-xl bg-white">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#ff575a]" />
                Book a Table:
              </label>
              <select
                value={selectedTable || ""}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                disabled={!selectedDateTime}
                className="w-full p-3 border border-[#ff575a]/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff575a] bg-[#ffeeee] text-gray-800 disabled:opacity-60"
              >
                <option value="">{selectedDateTime ? "Select a table" : "Select date & time first"}</option>
                {tables.map((table) => {
                  const status = getTableStatus(table)
                  return (
                    <option
                      key={table.id}
                      value={table.id}
                      disabled={status !== "available"}
                      className={status === "available" ? "text-green-600" : "text-red-500"}
                    >
                      {table.name} - {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Notification Message */}
            {orderStatus && (
              <div className="mt-6 p-4 bg-[#ffeeee] border border-[#ff575a]/30 text-gray-700 rounded-lg">
                {orderStatus}
              </div>
            )}

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
  )
}

