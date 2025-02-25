"use client";
import { useSession } from "next-auth/react";

import Link from "next/link";

export default function About() {
  return (
    <div className="bg-blue-100 min-h-screen">
      {/* <div className="bg-[url('/images/bg.jpg')] bg-cover bg-center h-screen"> */}
      {/* Navbar */}
      <nav className=" p-4 fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">Bite Scape</h1>
          <ul className="hidden md:flex text-black space-x-6">
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/home">Home</Link>{" "}
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">Outlets</li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <button className="bg-red-500 p-1 rounded-md text-white">
                Get Started
              </button>{" "}
            </li>
          </ul>

          <button className="bg-red-500 text-white px-4 py-2 rounded-md md:hidden">
            Menu
          </button>
        </div>
      </nav>
      <br />
      <br />
      <br />
      <div className="text-2xl min-h-screen bg-gray-100 py-10 px-6 md:px-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About BiteScape
        </h1>
        <p className="text-gray-700">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">BiteScape</span>, where
          every bite tells a story and every flavor takes you on a journey. At
          BiteScape, we have reimagined the food court experience, transforming
          it into a vibrant, immersive culinary destination that celebrates
          innovation, diversity, and community.
        </p>
        <h1 className="text-3xl font-semibold text-gray-800 mt-8">
          Our Vision
        </h1>
        <p className="text-2xl text-gray-700">
          BiteScape is more than just a place to eat—it is a food landscape
          designed for the next generation of food lovers. We believe that
          dining should be an adventure, a chance to explore new tastes,
          cultures, and experiences. Our mission is to create a space where food
          is not just consumed but celebrated, where every visit feels like a
          discovery.
        </p>
        <h1>What makes us unique</h1>
        <h3 className="text-2xl font-semibold text-blue-600">
          Global Flavors, One Roof:{" "}
        </h3>
        <p className="text-gray-700">
          From sizzling street food to gourmet delights, BiteScape brings
          together the best of local and international cuisines. Whether you are
          craving sushi, tacos, artisanal pizza, or vegan bowls, our diverse
          vendors have something for every palate.
        </p>
        <h3 className="text-2xl font-semibold text-blue-600">
          Innovative Dining:{" "}
        </h3>
        <p className="text-gray-700">
          We are not just about food—we are about the experience. With
          cutting-edge technology, interactive kiosks, and a sleek, modern
          design, BiteScape is where tradition meets innovation.
        </p>
        <h3 className="text-2xl font-semibold text-blue-600">
          Community Hub:{" "}
        </h3>
        <p className="text-gray-700">
          BiteScape is a place to connect, share, and enjoy. Whether you are
          grabbing a quick bite, meeting friends, or hosting an event, our space
          is designed to bring people together.
        </p>
        <h3 className="text-2xl font-semibold text-blue-600">
          Sustainability at Heart:{" "}
        </h3>
        <p className="text-gray-700">
          We are committed to a greener future. From eco-friendly packaging to
          locally sourced ingredients, we are doing our part to make dining
          sustainable and responsible.
        </p>

        <h1>Our Story</h1>
        <p className="text-gray-700">
          BiteScape was born out of a simple idea: food should be fun, exciting,
          and accessible to everyone. We wanted to create a space that breaks
          the mold of traditional food courts, offering a dynamic, ever-evolving
          experience that reflects the tastes and trends of today’s food scene.
        </p>
        <h1>Join the Journey</h1>
        <p className="text-gray-700">
          At BiteScape, every visit is a new adventure. Whether you are a
          foodie, a casual diner, or just looking for a great place to hang out,
          we invite you to explore, indulge, and savor the flavors of tomorrow.
        </p>
        <h2 className="text-center text-2xl font-bold text-blue-600 mt-8">
          Welcome to BiteScape—your passport to the future of food.
        </h2>
      </div>
    </div>
  );
}
