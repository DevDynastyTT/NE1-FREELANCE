import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["mongoose", "bcrypt", "nodemailer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ne1-freelance.s3.wasabisys.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-1.wasabisys.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "fiverr-res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
