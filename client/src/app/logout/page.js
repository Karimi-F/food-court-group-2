"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirection after logout
import { logoutUser } from "../utils"; // Import the utility function

const API_URL = "http://127.0.0.1:5000"; // Adjust this based on your backend URL

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
