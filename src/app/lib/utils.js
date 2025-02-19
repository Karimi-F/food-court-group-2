export async function getCustomer(email){
    const customer = await fetch(`http://localhost:3001/customers?email=${email}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error:', error));
    return customer
}

export async function createCustomer(fullName, email, password){
    const response = await fetch("http://localhost:3001/customers",{
        method : "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
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
        const response = await fetch (`http://localhost:3001/customers?email=${email}`)
     
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

export async function getOwner(email){
    const owner = await fetch(`http://localhost:3001/owners?email=${email}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error:', error));
    return owner
}

export async function createOwner(fullName, email, password){
    const response = await fetch("http://localhost:3001/owners",{
        method : "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
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

export async function validateOwnerCredentials(email, password){
    try{
        const response = await fetch (`http://localhost:3001/owners?email=${email}`);
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