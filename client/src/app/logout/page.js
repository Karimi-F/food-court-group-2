"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirection after logout
// import { logoutUser } from "../../lib/utils"; // Import the utility function

const API_URL = "https://food-court-group-2-1.onrender.com"; // Adjust this based on your backend URL

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const isLoggedOut = await logoutUser(API_URL); // Use the utility function

      if (isLoggedOut) {
        // Redirect to home page after successful logout
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    };

    handleLogout();
  }, [router]);

  return <div>Logging out...</div>;
}
