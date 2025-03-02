"use client"

import Link from "next/link"
import { Globe, Coffee, Users, Leaf, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md p-4 fixed top-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#FF6B6B]">
            BiteScape
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#FF6B6B] hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/foodmenu" className="hover:text-red-500 transition-colors">Menu</Link>
            <Link href="/about" className="hover:text-red-500 transition-colors">About us</Link>
            <Link href="/contact-us" className="hover:text-red-500 transition-colors">Contact us</Link>
          </nav>
          <Link href="/get-started">
            <button className="px-6 py-2 rounded-full border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#FF6B6B]">
            About BiteScape
          </h1>
          <div className="w-20 h-1 bg-[#FF6B6B] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Welcome to <span className="font-semibold text-[#FF6B6B]">BiteScape</span>, where every bite tells a story and every flavor takes you on a journey.
          </p>
        </div>

        {/* What Makes Us Unique */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#FF6B6B]">What Makes Us Unique</h2>
          <Separator className="mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Globe />, title: "Global Flavors, One Roof", text: "From sizzling street food to gourmet delights..." },
              { icon: <Coffee />, title: "Innovative Dining", text: "We are not just about food—we are about the experience..." },
              { icon: <Users />, title: "Community Hub", text: "BiteScape is a place to connect, share, and enjoy..." },
              { icon: <Leaf />, title: "Sustainability at Heart", text: "We are committed to a greener future..." }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 mt-1 text-[#FF6B6B]">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-[#FF6B6B]">{item.title}</h3>
                      <p className="text-gray-700">{item.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#FF6B6B]">
            Welcome to BiteScape—your passport to the future of food.
          </h2>
          <Link href="/get-started">
            <button className="mt-4 bg-[#FF6B6B] text-white px-6 py-3 rounded-md flex items-center mx-auto hover:bg-[#e64c52] transition-colors">
              Start Your Culinary Journey <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} BiteScape. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
