"use client";

import Link from "next/link";

export default function ContactUs() {
  return (
    <div className="bg-blue-100 min-h-screen text-black">
      <nav className="p-4 fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">BiteScape</h1>
          <ul className="hidden md:flex text-black space-x-6">
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/home">Home</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/outlets">Outlets</Link>
            </li>
            <li className="cursor-pointer hover:text-red-500">
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav>
      <header className="text-3xl text-black text-blue-700 flex justify-center font-semibold ">
        Contact Us
      </header>
      <br />
      <div>
        <h2 className="text-2xl text-black-700 flex justify-center">
          Operating Hours
        </h2>
        <p className="text-justify p-2">
          Our team is available to assist you during the following hours:
          <strong className="text-blue-700">
            Monday - Friday: 9:00 AM - 5:00 PM (EAT)
          </strong>
          .For inquiries outside of these hours, please feel free to leave a
          message, and we'll get back to you as soon as possible.
          <strong>Thank you for reaching out!</strong>
        </p>
        <br />
        {/* <div className="fixed bottom-0"> */}
          <div className="flex justify-around">
            <div>
              <h2 className="text-2xl text-black-700">Contact Details</h2>
              <p>
                Phone Number:
                <span className="text-blue-700">+254 711-046-100</span>
              </p>
              <p>
                Email:
                <span className="text-blue-700">bitescape@gmail.com</span>
              </p>
              <p>
                Find us at:
                <span className="text-blue-700">
                  BiteScape foodcourt, NextGen Mall
                </span>
              </p>
                <p>
                  Location:
                  <span className="text-blue-700">
                    13 Memory Lane, Konza City, Kenya
                  </span>
                </p>
            </div>
            <div>
              <h2 className="text-2xl text-black-700">Social Media:</h2>
              <span className="strong">
                FaceBook:
                <span className="text-blue-700"> Bite_Scape</span>
              </span>
              <br />
              <span className="strong">
                Instagram:
                <span className="text-blue-700"> Bite_Scape</span>
              </span>
              <br />
              <span className="strong">
                Twitter:
                <span className="text-blue-700"> Bite_Scape</span>
              </span>
            </div>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}

