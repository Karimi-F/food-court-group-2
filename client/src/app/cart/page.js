"use client"

import { useState } from "react";

export default function Cart({cart, closeCart}) {
    const [showForm, setShowForm] = useState(false);
      const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        wait_time: "",
      });
      
    return (
             <div className="h-screen bg-blue-100">
             <h2 className="text-2xl text-blue-700 font-bold flex justify-center items center mb-4">Customer Cart</h2>
    
    <div className="space-y-4">
      {cart?.map((item) => (
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

    <div className="mt-6 flex justify-center">
      <p className="text-blue-700 flex justify-center font-semibold">Total: Ksh {cart?.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
    </div>
    <button
      onClick={closeCart}
      className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
    >
      Order
    </button>
  {/* </div> */}
{/* )} */}
             </div>       
    )
}
