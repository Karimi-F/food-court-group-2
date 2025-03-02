"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Facebook, Youtube, Instagram, Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState("")
  const [searchOutlet, setSearchOutlet] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sample data
  const popularDelicacies = [
    {
      name: "Spicy Chicken Burger",
      Outlet: "Burger Haven",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop",
    },
    {
      name: "Margherita Pizza",
      Outlet: "Pizza Palace",
      price: "$14.99",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop",
    },
    {
      name: "Chocolate Brownie",
      Outlet: "Sweet Treats",
      price: "$6.99",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop",
    },
    {
      name: "Veggie Bowl",
      Outlet: "Green Eats",
      price: "$10.99",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop",
    },
  ]

  const outlets = [
    {
      id: 1,
      name: "Burger Haven",
      description: "Best burgers in town with a variety of options including vegetarian and vegan choices.",
      photo_url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=500&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Pizza Palace",
      description: "Authentic Italian pizzas made with fresh ingredients and traditional recipes.",
      photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Sweet Treats",
      description: "Delicious desserts and pastries that will satisfy your sweet tooth.",
      photo_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop",
    },
  ]

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleSearch = () => {
    if (searchOutlet.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchOutlet)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffeeee] to-[#ffe0e0]">
      {/* Modern Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-[#ff575a] flex items-center gap-2"
              >
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-[#ff575a] rounded-lg rotate-3 opacity-20"></div>
                  <div className="absolute inset-0 bg-[#ff575a] rounded-lg -rotate-3 opacity-20"></div>
                  <span className="relative z-10 flex items-center justify-center h-full text-[#ff575a]">B</span>
                </div>
                BiteScape
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {["Home", "Menu", "About us", "Contact us"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className={`relative text-lg font-medium transition-colors
                      ${isScrolled ? "text-gray-800" : "text-white"}
                      hover:text-[#ff575a] group`}
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff575a] transition-all group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex px-6 py-2.5 rounded-full bg-[#ff575a] text-white font-medium shadow-lg shadow-[#ff575a]/20 hover:shadow-xl hover:shadow-[#ff575a]/30 transition-all"
                onClick={openModal}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>

              <button
                className="md:hidden p-2 text-[#ff575a] hover:bg-[#ff575a]/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          className={`md:hidden absolute w-full bg-white/90 backdrop-blur-lg shadow-lg ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {["Home", "Menu", "About us", "Contact us"].map((item) => (
              <motion.div key={item} whileHover={{ x: 10 }} className="border-b border-gray-100 last:border-0">
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center justify-between py-3 text-gray-800 hover:text-[#ff575a] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 rounded-full bg-[#ff575a] text-white font-medium shadow-lg shadow-[#ff575a]/20"
              onClick={() => {
                openModal()
                setIsMobileMenuOpen(false)
              }}
            >
              Get Started
            </motion.button>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1920&q=80"
            alt="Delicious Food"
            layout="fill"
            objectFit="cover"
            priority
            className="transform scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
          <div className="absolute inset-0 bg-[#ff575a]/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                Discover
                <span className="block text-[#ff575a] mt-2">Amazing Food</span>
                <span className="block">Experience</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Find your favorite meals from the best restaurants near you. Experience the taste of excellence.
              </p>

              {/* Search Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative max-w-2xl mx-auto mt-12"
              >
                <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                  <input
                    type="text"
                    placeholder="Search for restaurants or dishes..."
                    className="w-full h-14 px-6 rounded-xl bg-transparent text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none"
                    value={searchOutlet}
                    onChange={(e) => setSearchOutlet(e.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#ff575a] p-3 rounded-xl text-white hover:bg-[#ff575a]/90 transition-colors shadow-lg shadow-[#ff575a]/20"
                    onClick={handleSearch}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
              >
                {[
                  { number: "500+", label: "Restaurants" },
                  { number: "1M+", label: "Happy Customers" },
                  { number: "4.8", label: "Average Rating" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                    <p className="text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">Popular Categories</h2>
            <p className="text-gray-600 mt-4">Explore our most loved food categories</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Pizza", icon: "🍕", count: "86 places" },
              { name: "Burger", icon: "🍔", count: "54 places" },
              { name: "Sushi", icon: "🍱", count: "32 places" },
              { name: "Dessert", icon: "🍰", count: "48 places" },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-50 rounded-2xl p-6 text-center transition-all group-hover:bg-[#ff575a]/5">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-gray-500 mt-2">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="relative py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Restaurants</h2>
              <p className="text-gray-600 mt-4">Discover the best food in your area</p>
            </div>
            <button className="text-[#ff575a] font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outlets.map((outlet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={outlet.photo_url || "/placeholder.svg"}
                      alt={outlet.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white">{outlet.name}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm mt-2">
                        <span>⭐ 4.8</span>
                        <span>20-30 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 line-clamp-2">{outlet.description}</p>
                    <Link href={`/foodmenu/${outlet.id}`}>
                      <button className="mt-6 w-full bg-[#ff575a] text-white py-3 rounded-xl font-medium hover:bg-[#ff575a]/90 transition-colors">
                        View Menu
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="relative py-20 bg-[#ff575a]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold leading-tight">Get the BiteScape App</h2>
              <p className="text-white/80 mt-6 text-lg">
                Download our mobile app and never miss the best food deals. Order food and track your delivery in
                real-time.
              </p>
              <div className="flex gap-4 mt-8">
                <button className="bg-black px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-black/80 transition-colors">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-medium">App Store</div>
                  </div>
                </button>
                <button className="bg-black px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-black/80 transition-colors">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-medium">Google Play</div>
                  </div>
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[600px]">
                <Image
                  src="/placeholder.svg?height=600&width=300"
                  alt="BiteScape App"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-3xl"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute top-1/4 -left-8 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                  <div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                  <div>
                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
            <p>&copy; 2025 BiteScape. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-[#ff575a] p-6 rounded-lg shadow-md max-w-md w-full animate-scaleIn">
            <h2 className="text-xl text-white font-bold mb-4 text-center">Sign Up As:</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                role ? router.push(`/${role}-signup`) : alert("Select an option!")
                closeModal()
              }}
              className="space-y-4 text-white"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  onChange={(e) => setRole(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">Owner</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  onChange={(e) => setRole(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-lg">Customer</span>
              </label>

              <button
                type="submit"
                className="bg-white text-[#ff575a] w-full p-2 rounded-md mt-4 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Continue
              </button>
            </form>

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-white hover:text-gray-200 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}