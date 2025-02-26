"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false); // ✅ Removed extra closing brace here

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E65C00] via-[#FF8534] to-[#FFB088]">
      {/* Navigation */}
      <nav className="shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-black">BiteScape</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/home" className="text-black hover:text-[#FFB088]">
                Home
              </Link>
              <Link href="/about" className="text-black hover:text-[#FFB088]">
                About Us
              </Link>
              <Link href="/contact-us" className="text-black hover:text-[#FFB088]">
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-black focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* for mobile users */}
          {isOpen && (
            <div className="md:hidden space-y-4 px-4 pb-4 transition-all">
              <Link href="/home" className="block text-black hover:text-[#FFB088]" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="block text-black hover:text-[#FFB088]" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
              <Link href="/contact-us" className="block text-black hover:text-[#FFB088]" onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center bg-[#E65C00] overflow-hidden">
              {/* Grid Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#E65C00]/90 via-[#FF8534]/80 to-[#FFB088]/70" />
      </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#E65C00]/90 via-[#FF8534]/80 to-[#FFB088]/70" />

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-8">
              Great Food, <span className="text-[#FFB088] inline-block animate-pulse">Great Vibes 🎉</span>
              <br />
              <span className="text-white/90">All in One Place!</span>
              <span className="inline-block animate-bounce">🍔</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Experience the perfect blend of flavors and atmosphere. Your next memorable meal awaits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-[#E65C00] rounded-full font-semibold text-lg hover:bg-[#FFB088] hover:text-white transition-colors duration-300">
                Order Now
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors duration-300">
                View Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to BiteScape, the Food Court of Tomorrow 🍔🍣. At BiteScape, we believe that food is more than just a meal;
            it's an experience, a celebration of flavors, cultures, and creativity. Whether you’re craving a quick bite, a
            leisurely lunch with friends, or a late-night snack, BiteScape has something for everyone.
          </p>
        </div>
      </section>

      <footer className=" text-white text-center py-6">
        <p>&copy; 2025 BiteScape. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
