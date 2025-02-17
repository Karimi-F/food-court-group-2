"use client"; // Ensures it's a client component

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Bite Scape!
      </h1>
      
    </div>
  );
}
