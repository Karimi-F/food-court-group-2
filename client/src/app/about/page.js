"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Youtube, Instagram } from "lucide-react"
import { Globe, Coffee, Users, Leaf, ChevronRight, Menu, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-[#FFB3B5] text-[#5A3E36]">
      {/* Header */}
      <header className="bg-[#FFB3B5] shadow-md p-4 fixed top-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[#D83F45]">
            BiteScape
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#D83F45] hover:text-[#B32E33] transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#B32E33] transition-colors">
              About
            </Link>
            <Link href="/contact-us" className="hover:text-[#B32E33] transition-colors">
              Contact us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#D83F45]" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFC7C9] absolute top-full left-0 w-full shadow-md">
            <div className="flex flex-col py-4">
              <Link
                href="/home"
                className="px-6 py-3 text-[#D83F45] hover:bg-[#FFD8D9] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 text-[#D83F45] hover:bg-[#FFD8D9] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className="px-6 py-3 text-[#D83F45] hover:bg-[#FFD8D9] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-[#D83F45]">About BiteScape</h1>
          <div className="w-16 sm:w-20 h-1 bg-[#D83F45] mx-auto mb-4 md:mb-6"></div>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto px-2">
            Welcome to <span className="font-semibold text-[#D83F45]">BiteScape</span>, where every bite tells a story
            and every flavor takes you on a journey.
          </p>
        </div>

        {/* What Makes Us Unique */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4 text-[#D83F45]">What Makes Us Unique</h2>
          <Separator className="mb-4 md:mb-6" />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                icon: <Globe />,
                title: "Global Flavors, One Roof",
                text: "From sizzling street food to gourmet delights, we bring the world's cuisines together in one vibrant space.",
              },
              {
                icon: <Coffee />,
                title: "Innovative Dining",
                text: "We are not just about food—we are about the experience, creating memorable moments with every dish we serve.",
              },
              {
                icon: <Users />,
                title: "Community Hub",
                text: "BiteScape is a place to connect, share, and enjoy culinary adventures with friends and family.",
              },
              {
                icon: <Leaf />,
                title: "Sustainability at Heart",
                text: "We are committed to a greener future, sourcing locally and minimizing our environmental footprint.",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 mt-1 text-[#D83F45] flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-[#D83F45]">{item.title}</h3>
                      <p className="text-sm sm:text-base">{item.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 md:mt-10 bg-[#FFC7C9] p-5 sm:p-8 rounded-lg text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-[#D83F45]">
            Welcome to BiteScape—your passport to the future of food.
          </h2>
          <Link href="/get-started">
            <button className="mt-3 md:mt-4 bg-[#D83F45] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md flex items-center mx-auto hover:bg-[#B32E33] transition-colors text-sm sm:text-base">
              Start Your Culinary Journey <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </Link>
        </div>
      </div>

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
    </div>
  )
}

