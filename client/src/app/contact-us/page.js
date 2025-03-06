"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter,Youtube, Phone, Mail, MapPin, Clock, Menu, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ContactUs() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFB3B5] text-gray-800">
      {/* Navigation */}
      <nav className="p-4 bg-white shadow-sm fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500">BiteScape</h1>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6">
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/home">Home</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer text-red-500 font-medium">
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-red-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md z-50">
            <ul className="flex flex-col py-2">
              <li className="cursor-pointer hover:bg-gray-100">
                <Link
                  href="/home"
                  className="block px-6 py-3 hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="cursor-pointer hover:bg-gray-100">
                <Link
                  href="/about"
                  className="block px-6 py-3 hover:text-red-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className="cursor-pointer bg-gray-50">
                <Link
                  href="/contact-us"
                  className="block px-6 py-3 text-red-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="pt-20 sm:pt-24 pb-6 sm:pb-8 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-500">Contact Us</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          We'd love to hear from you! Here's how you can reach us.
        </p>
      </header>

      {/* Contact Details Section */}
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Operating Hours */}
        <Card className="shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Operating Hours</h2>
                <p className="text-sm sm:text-base">Our team is available during:</p>
                <p className="font-medium text-red-500 mt-2 text-sm sm:text-base">
                  Monday - Friday: 9:00 AM - 5:00 PM (EAT)
                </p>
                <p className="mt-2 text-sm sm:text-base">For inquiries outside these hours, leave us a message!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="shadow-md">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500 mb-3 sm:mb-4">Contact Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">+254 711-046-100</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">bitescape@gmail.com</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">
                  BiteScape foodcourt, NextGen Mall, 13 Memory Lane, Konza City, Kenya
                </p>
              </div>
            </div>

            <Separator className="my-4 sm:my-6" />

            {/* Social Media */}
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500 mb-3 sm:mb-4">Social Media</h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">Bite_Scape</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">Bite_Scape</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="font-medium text-sm sm:text-base">Bite_Scape</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="w-full h-[300px] sm:h-[400px] relative mt-8 sm:mt-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7458141252726!2d36.82196851475808!3d-1.2986508990516603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d8eeeaee53%3A0xd8304420c5df7207!2sKonza%20Technopolis%20Development%20Authority!5e0!3m2!1sen!2ske!4v1646825567345!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="BiteScape Location"
          className="absolute inset-0"
        ></iframe>

        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 sm:p-4 text-center">
          <p className="font-medium text-red-500 text-xs sm:text-sm md:text-base">
            Visit us at BiteScape foodcourt, NextGen Mall, Konza City, Kenya
          </p>
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

