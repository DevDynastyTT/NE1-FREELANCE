/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
      serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      domains: ['lh3.googleusercontent.com', "fiverr-res.cloudinary.com", "localhost"],
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      return config
    },
    extraModules: [
      "./node_modules/@fortawesome/free-regular-svg-icons", 
      "./node_modules/@fortawesome/free-solid-svg-icons", 
      "./node_modules/@fortawesome/free-brands-svg-icons",
      "./node_modules/@fortawesome/free-regular-svg-icons",
      "./node_modules/@fortawesome/free-solid-svg-icons",
      "@fortawesome/react-fontawesome",
    ],

  }
  
  module.exports = nextConfig
  