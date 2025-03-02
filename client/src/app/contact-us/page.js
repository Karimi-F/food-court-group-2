"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-blue-100 text-gray-800">
      {/* Navigation */}
      <nav className="p-4 bg-white shadow-sm fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">BiteScape</h1>
          <ul className="hidden md:flex space-x-6">
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/home">Home</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/outlets">Outlets</Link>
            </li>
            <li className="cursor-pointer text-red-500 font-medium">
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 text-center">
        <h1 className="text-4xl font-bold text-red-500">Contact Us</h1>
        <p className="text-gray-600 mt-2">We'd love to hear from you! Here's how you can reach us.</p>
      </header>

      {/* Contact Details Section */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* Operating Hours */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Operating Hours</h2>
                <p>Our team is available during:</p>
                <p className="font-medium text-red-500 mt-2">
                  Monday - Friday: 9:00 AM - 5:00 PM (EAT)
                </p>
                <p className="mt-2">For inquiries outside these hours, leave us a message!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-500" />
                <p className="font-medium">+254 711-046-100</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-500" />
                <p className="font-medium">bitescape@gmail.com</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <p className="font-medium">
                  BiteScape foodcourt, NextGen Mall, 13 Memory Lane, Konza City, Kenya
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Social Media */}
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Social Media</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-red-500" />
                <p className="font-medium">Bite_Scape</p>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-red-500" />
                <p className="font-medium">Bite_Scape</p>
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-red-500" />
                <p className="font-medium">Bite_Scape</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="w-full h-[400px] relative mt-12">
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

        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 text-center">
          <p className="font-medium text-red-500">
            Visit us at BiteScape foodcourt, NextGen Mall, Konza City, Kenya
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} BiteScape. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
