"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { createCustomer } from "../lib/utils";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";

    if (!formData.password1.trim()) newErrors.password1 = "Password is required";
    else if (formData.password1.length < 6) newErrors.password1 = "Password must be at least 6 characters";

    if (!formData.password2.trim()) newErrors.password2 = "Please confirm your password.";
    else if (formData.password1 !== formData.password2) newErrors.password2 = "Oops! The confirmation password does not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createCustomer(formData.name, formData.email, formData.password1);
        setSuccessMessage("Customer Signup successful! 🎉");

        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password1,
        });

        if (!signInResult?.error) {
          router.push("/customer-dashboard");
        } else {
          setErrors({ general: "Login failed. Please try again." });
        }
      } catch (error) {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.webp?a=1&b=1&s=612x612&w=0&k=20&c=PDAOJZowRgcFpLORXCV5p9Yt4wuOlxpYkxOUk5M4koo="
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[#ff575a]/20"></div>
        
      </div>

      {/* Form Container */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#FC555B] mb-6">Sign Up As A Customer</h2>

        {successMessage && <p className="text-[#FC555B] text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[#FC555B] font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-[#FC555B] border-[#FC555B] px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.name && <p className="text-[#FC555B] text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#FC555B] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-[#FC555B] border-[#FC555B] px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.email && <p className="text-[#FC555B] text-sm">{errors.email}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[#FC555B] font-medium">Enter Password</label>
            <input
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              className="w-full text-[#FC555B] border-[#FC555B] px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.password1 && <p className="text-[#FC555B] text-sm">{errors.password1}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#FC555B] font-medium">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full text-[#FC555B] border-[#FC555B] px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.password2 && <p className="text-[#FC555B] text-sm">{errors.password2}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FC555B] text-white py-2 rounded-lg hover:bg-[#E04A51] transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-[#FC555B] mt-4">
          Already have an account? <a href="/customer-login" className="font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
