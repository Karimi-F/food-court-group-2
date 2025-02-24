// export async function getCustomer(email){
//     const customer = await fetch(`http://127.0.0.1:5000/customers?email=${email}`)
//     .then(response => response.json())
//     .then(data => data)
//     .catch(error => console.error('Error:', error));
//     return customer
// }

export async function createCustomer(name, email, password){
    const response = await fetch("http://127.0.0.1:5000/customers",{
        method : "POST",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        }),
    });
    const data = await response.json();
    if (!response.ok){
        throw new Error(data.message || "Failed to create customer");
    }

    return data;
}

export async function validateCustomerCredentials(email, password){
    try{
        const response = await fetch(`http://127.0.0.1:5000/customers?email=${email}`)
     
        if (!response.ok){
            throw new Error (`HTTP error! Status: ${response.status}`);
        }
        const customers = await response.json();
        console.log("Customers fetched:", customers);

        const customer = customers.find(cust => cust.email === email && cust.password === password);

        return customer || null;
    } catch (error){
        console.error("Error validating credentials:", error);
        return null;
    }
}

// utils/fetchOutlets.js

export async function fetchOutlets({ outlet, food, category }) {
    try {
      // Log the input parameters
      console.log("Fetching outlets with parameters:", { outlet, food, category });
  
      // Construct query parameters
      const queryParams = new URLSearchParams({
        name: outlet || "",
        food: food || "",
        category: category || "",
      });
  
      // Log the constructed query parameters
      console.log("Query parameters:", queryParams.toString());
  
      // Replace with your actual backend API URL
      const url = `http://127.0.0.1:5000/outlets?${queryParams.toString()}`;
      console.log("Fetching from URL:", url); // Log the full URL
  
      const response = await fetch(url);
  
      // Log the response status
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        throw new Error("Failed to fetch outlets");
      }
  
      const data = await response.json();
  
      // Log the fetched data
      console.log("Fetched data:", data);
  
      return data;
    } catch (error) {
      console.error("Error fetching outlets:", error);
      return [];
    }
  }
  
export async function createOwner(name, email, password){
    const response = await fetch("http://127.0.0.1:5000/owners",{
        method : "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password  
        }),
    });
    const data = await response.json();
    if (!response.ok){
        throw new Error(data.message || "Failed to create owner");
    }

    return data;
    
}
export async function fetchMenu(outletId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/food/outlet_id/${outletId}`);
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        throw new Error("No food items found for this outlet.");
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching food data:", error);
      throw error;
    }
  }
  
  
  export const addToCart = (cart, item, setCart) => {
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
  
  export const removeFromCart = (cart, item, setCart) => {
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
  
  export const closeCart = (setCart) => {
    setCart([]);
  };
    
export async function validateOwnerCredentials(email, password){
    try{
        const response = await fetch (`http://127.0.0.1:5000/owners?email=${email}`);
        if (!response.ok){
            throw new Error("Failed to fetch owners");
        }

        const owners = await response.json();
        console.log("Owners fetched:", owners);

        const owner = owners.find(owner => owner.email === email && owner.password === password);
        return owner || null;
    } catch (error){
        console.error("Error fetching owners:", error);
        return null;
    }   
}
export async function searchOutletByName(outletName) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/outlets?name=${encodeURIComponent(outletName)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch outlets");
        }

        const outlets = await response.json();
        console.log("Outlets fetched:", outlets);

        return outlets.length > 0 ? outlets : null; // Return found outlets or null
    } catch (error) {
        console.error("Error fetching outlets:", error);
        return null;
    }
}

export async function login(email, password) {
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    

    
    // Handle response errors
    if (!response.ok) {
        console.error("Login failed:", response.status);
        return null; // This will trigger 401 in NextAuth
    }

    const data = await response.json(); // Parse response body
    return data; // Ensure it returns an object with { id, name, email }
}


// Logout

// utils.js
export const logoutUser = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent with the request
    });

    if (response.ok) {
      console.log("Successfully logged out");
      return true; // Return true if logout is successful
    } else {
      console.error("Logout failed");
      return false; // Return false if logout fails
    }
  } catch (error) {
    console.error("Logout error:", error);
    return false; // Return false in case of error
  }
};
