/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["images.unsplash.com"],
      domains: ["media.istockphoto.com"], // Allow Unsplash images
      domains: ["plus.unsplash.com"], // Allow Unsplash images
      domains: ["images.unsplash.com"] // Allow Unsplash images
    },
  };
  
  export default nextConfig; // Use `export default` instead of `module.exports`
  