/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Keep original image behavior
  },
  // Ensure GSAP works properly
  transpilePackages: ['gsap'],
}

module.exports = nextConfig

