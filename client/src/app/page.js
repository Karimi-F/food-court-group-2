"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <span className="text-[#E65C00] text-2xl font-bold">BiteScape</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/home" className="text-gray-700 hover:text-[#E65C00]">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#E65C00]">
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="text-gray-700 hover:text-[#E65C00]"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-[#E65C00] min-h-[600px]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                The place where <span className="text-white">quality</span>
                <br />
                meets <span className="text-white">taste.</span>
              </h1>
              <p className="text-lg opacity-90">
                Foods that are made by our professional chefs in the town
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.webp?a=1&b=1&s=612x612&w=0&k=20&c=PDAOJZowRgcFpLORXCV5p9Yt4wuOlxpYkxOUk5M4koo="
                  alt="Delicious pasta dish with tomatoes and basil"
                  width={500}
                  height={500}
                  className="rounded-full"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 right-12 w-8 h-8 bg-red-500 rounded-full opacity-20 animate-float-delayed"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to BiteScape, the Food Court of Tomorrow 🍔🍣 At
            BiteScape, we believe that food is more than just a meal; it's an
            experience, a celebration of flavors, cultures, and creativity.
            Whether you’re craving a quick bite, a leisurely lunch with friends,
            or a late-night snack, BiteScape has something for everyone.
            Imagine a bustling food court where every dish tells a story. From
            sizzling street tacos to sushi rolls prepared with precision, our
            outlets bring the world’s best cuisines to your fingertips. With our
            easy-to-use mobile app, ordering is a breeze. Browse diverse menus,
            filter by cuisine or price, and have your meal delivered straight to
            your table or prepared for pickup. Want to dine with friends? Book a
            table, track your order, and enjoy the seamless dining experience
            that’s all about convenience, variety, and delicious food. It’s all
            here, waiting for you. Explore, order, enjoy. Your culinary
            adventure starts now at BiteScape.
          </p>
        </div>
      </section>
      <footer className="bg-blue-100 text-black text-center py-6">
        <p>&copy; 2025 Bite Scape. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
