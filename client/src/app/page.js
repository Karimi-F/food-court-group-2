"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Facebook, Youtube, Instagram } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="shadow-md bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-0 sm:">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-bold bg-gradient-to-r from-[#c84346] to-[#ff8a8c] text-transparent bg-clip-text">
              <a href="/">BiteScape</a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/home" className="text-gray-800 hover:text-[#ff8a8c] transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-[#ff8a8c] transition-colors">
                About
              </Link>
              <Link href="/contact-us" className="text-gray-800 hover:text-[#ff8a8c] transition-colors">
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden space-y-4 px-4 pb-4 transition-all">
              <Link href="/home" className="block text-gray-800 hover:text-[#ff8a8c]" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="block text-gray-800 hover:text-[#ff8a8c]" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link
                href="/contact-us"
                className="block text-gray-800 hover:text-[#ff8a8c]"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[#fef2f2]">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent" />
        </div>

        {/* Gradient Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff575a]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ff8a8c]/20 rounded-full blur-3xl" />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left pt-20 md:pt-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 mb-8">
              Great Food,{" "}
              <span className="text-[#ff575a] inline-block">
                Great Vibes <span className="inline-block animate-bounce">🎉</span>
              </span>
              <br />
              <span className="text-gray-800/90">
                All in One Place! <span className="inline-block animate-bounce delay-150">🍔</span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl">
              Experience the perfect blend of flavors and atmosphere. Your next memorable meal awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/customer-signup")}
                className="px-8 py-4 bg-gradient-to-r from-[#c84346] to-[#ff575a] text-white rounded-full font-semibold text-lg hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Order Now
              </button>
              <button
                onClick={() => router.push("/outlets")}
                className="px-8 py-4 bg-white text-[#ff575a] rounded-full font-semibold text-lg border-2 border-[#ff575a] hover:bg-[#ff575a] hover:text-white transition-colors duration-300"
              >
                See Outlets
              </button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative hidden md:block">
            <div className="relative h-[600px]">
              <Image
                src="/images/regina-victorica.webp"
                alt="Delicious Food Spread"
                width={600}
                height={600}
                className="rounded-3xl"
                // className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              
              {/* Decorative Elements
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ff8a8c] rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#c84346] rounded-full opacity-20 animate-pulse delay-300" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fef2f2] to-white" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Welcome to BiteScape, the Food Court of Tomorrow 🍔🍣. At BiteScape, we believe that food is more than just
            a meal; it's an experience, a celebration of flavors, cultures, and creativity. Whether you're craving a
            quick bite, a leisurely lunch with friends, or a late-night snack, BiteScape has something for everyone.
          </p>
        </div>
      </section>


      {/* Decorative Border Between Story and Footer */}
      <div className="relative">
        {/* Wave Border */}
        <div className="absolute left-0 right-0 h-24 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full transform rotate-180"
            style={{ fill: "#111827" }} // matches footer bg-gray-900
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        {/* Food Icons Border */}
        <div className="relative z-10 flex justify-center items-center py-8">
          <div className="flex space-x-8 md:space-x-16 px-4 py-2 bg-white rounded-full shadow-lg transform -translate-y-1/2">
            {["🍕", "🍔", "🍣", "🍜", "🍰"].map((emoji, index) => (
              <div
                key={index}
                className="text-2xl md:text-3xl animate-bounce"
                style={{ animationDelay: `${index * 0.2}s`, animationDuration: "1s" }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">BiteScape</h3>
              <p className="text-gray-400">
                Discover the best food from over 1,000 restaurants and fast delivery to your doorstep
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </Link>
              </div>
            </div>
            {[
              {
                title: "About",
                links: ["Company", "Team", "Careers", "Blog"],
              },
              {
                title: "Legal",
                links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
              },
              {
                title: "Contact",
                links: ["Help Center", "Partner with us", "Ride with us"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-6">{column.title}</h3>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BiteScape. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
