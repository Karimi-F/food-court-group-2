"use client"

import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { validateCustomerCredentials } from "../lib/utils";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")

    if (validateForm()) {
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })
      if (signInResult.error) {
        setErrors(signInResult.error)
      } else {
        router.push("/customer-dashboard")
      }
    }
  }

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
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/90 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-[#FC555B] mb-6">Customer Login</h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[#FC555B] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:border-[#FC555B] focus:outline-none"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-[#FC555B] text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#FC555B] font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:border-[#FC555B] focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[#FC555B] text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-[#FC555B] text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FC555B] text-white py-3 rounded-lg hover:bg-[#e04046] transition duration-300 font-medium"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/customer-signup" className="text-[#FC555B] font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

