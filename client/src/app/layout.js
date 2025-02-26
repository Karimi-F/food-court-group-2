import React from "react"
import "./globals.css"
import Providers from "./providers";

export const metadata = {
  title: "BiteScape - Quality Meets Taste",
  description: "Experience authentic Northern hospitality and cuisine at CraveSphere",
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body><Providers> 
          {children}
          </Providers></body>
    </html>
  );
}





