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
      const response = await fetch(`http://127.0.0.1:5000/outlets/${outletId}/foods`);
  
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

export async function getFood() {
    try {
        const response = await fetch("http://127.0.0.1:5000/foods");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const foods = await response.json();

        const formattedFoods = foods.map(food => ({
            category: food.category,
            name: food.name,
            price: food.price,
            waiting_time: food.waiting_time
        }));

        return formattedFoods;
    } catch (error) {
        console.error("Error fetching food data:", error);
        return [];
    }
}



export async function fetchOwnerOutlets(ownerId) {
  if (!ownerId) {
    console.error("fetchOwnerOutlets: ownerId is undefined");
    return [];
  }

  console.log(`Fetching outlets for owner_id: ${ownerId}`);

  try {
    const response = await fetch(`http://127.0.0.1:5000/owner/${ownerId}/outlets`);
    const data = await response.json();
    console.log("Fetched outlets:", data);
    return data;
  } catch (error) {
    console.error("Error fetching outlets:", error);
    return [];
  }
}
export async function fetchFoodByOutlet(outletId) {
  if (!outletId) {
    console.error("fetchFoodByOutlet: outletId is undefined");
    return [];
  }

  console.log(`Fetching food for outlet_id: ${outletId}`);

  try {
    const response = await fetch(`http://127.0.0.1:5000/outlets/${outletId}/foods`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched food items:", data);
    return data;
  } catch (error) {
    console.error("Error fetching food:", error);
    return [];
  }
}

export async function updateFoodItem(foodId, updatedData) {
  // Debugging: Log the foodId parameter
  console.log("foodId in updateFoodItem:", foodId);

  if (!foodId || typeof foodId !== "number") {
    console.error("updateFoodItem: foodId must be a valid number");
    return null;
  }

  try {
    // Use the correct endpoint with foodId in the URL
    const response = await fetch(`http://127.0.0.1:5000/api/food/id/${foodId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      console.error(`Failed to update food item with ID "${foodId}"`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating food item:", error);
    return null;
  }
}

export async function deleteFoodItem(foodId) {  // Change to use 'foodId'
  if (!foodId) {
    console.error("deleteFoodItem: foodId is missing");
    return null;
  }

  console.log(`Deleting food item with ID: ${foodId}`);

  try {
    // Use the correct 'foodId' in the API endpoint
    const response = await fetch(`http://127.0.0.1:5000/api/food/id/${foodId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete food: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Deleted food item:", data);
    return data;
  } catch (error) {
    console.error("Error deleting food item:", error);
    return null;
  }
}


export async function addFoodItem(foodData) {
  if (!foodData.name || !foodData.price || !foodData.waiting_time || !foodData.outlet_id) {
    console.error("All fields are required to add food");
    return null;
  }

  console.log("Adding new food:", foodData);

  try {
    const response = await fetch("http://127.0.0.1:5000/foods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add food: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Food added successfully:", data);
    return data;
  } catch (error) {
    console.error("Error adding food:", error);
    return null;
  }
}
// utils.js

export const addOutlet = async (outletData) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/outlets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(outletData),
    });

    if (!response.ok) {
      throw new Error("Failed to add outlet");
    }

    return await response.json(); // Return the newly created outlet
  } catch (error) {
    console.error("Error adding outlet:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
export async function fetchOutletDetails(outletId) {
  const response = await fetch(`http://127.0.0.1:5000/outlets/${outletId}`); // Replace with your API endpoint
  if (!response.ok) {
    throw new Error("Failed to fetch outlet details");
  }
  return response.json();
}