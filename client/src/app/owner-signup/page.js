"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createOwner } from "../lib/utils"

// Utility function
// const createOwner = async (name, email, password) => {
//   // Replace with your actual owner creation logic
//   console.log("Creating owner:", name, email, password)
//   return Promise.resolve()
// }

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address"

    if (!formData.password1.trim()) newErrors.password1 = "Password is required"
    else if (formData.password1.length < 6) newErrors.password1 = "Password must be at least 6 characters"

    if (!formData.password2.trim()) newErrors.password2 = "Please confirm your password."
    else if (formData.password1 !== formData.password2)
      newErrors.password2 = "Oops! The confirmation password does not match."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await createOwner(formData.name, formData.email, formData.password1)
        setSuccessMessage("Outlet Owner Signup successful! 🎉")

        setTimeout(async() =>{
          const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password1,
        })

        if (signInResult?.ok) {
          router.push("/owner-dashboard");
        } else {
          setErrors({ general: signInResult?.error || "Login failed. Try again." });
        }
      },1000)
      } catch (error) {
        setErrors({ general: error.message })
      }
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.webp?a=1&b=1&s=612x612&w=0&k=20&c=PDAOJZowRgcFpLORXCV5p9Yt4wuOlxpYkxOUk5M4koo=')",
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full bg-opacity-95">
        <h2 className="text-2xl font-bold text-center text-[#FC555B] mb-6">Sign Up As An Outlet Owner</h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
        {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[#FC555B] font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-gray-800 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#FC555B] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-gray-800 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[#FC555B] font-medium">Enter Password</label>
            <input
              type="password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              className="w-full text-gray-800 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.password1 && <p className="text-red-500 text-sm">{errors.password1}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#FC555B] font-medium">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full text-gray-800 px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#FC555B] focus:outline-none"
            />
            {errors.password2 && <p className="text-red-500 text-sm">{errors.password2}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FC555B] text-white py-2 rounded-lg hover:bg-[#e04046] transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-[#FC555B] mt-4">
          Already have an account?{" "}
          <a href="/owner-login" className="font-bold underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

