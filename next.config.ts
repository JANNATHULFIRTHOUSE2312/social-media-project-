const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development", // 👈 only in dev
  },
};

module.exports = nextConfig;
