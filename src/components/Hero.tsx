"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
  "/images/image7.jpg",
  "/images/image8.jpg"
];

interface HeroProps {
  searchTerm?: string;
  setSearchTerm?: (q: string) => void;
  onSearch?: (q: string) => void;
}

export default function Hero(props: HeroProps) {
  const [search, setSearch] = useState(props.searchTerm ?? "");
  const [current, setCurrent] = useState(0);

  // 🔥 Spotlyte typing animation
  const fullText = "SPOTLYTE";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = isDeleting ? 120 : 200;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < fullText.length) {
        setDisplayText(fullText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(fullText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, fullText]);

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const handleSearchClick = () => {
    props.setSearchTerm?.(search);
    props.onSearch?.(search);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background slideshow */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="background"
            fill
            priority={idx === current}
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-4 flex flex-col items-center gap-6">
        {/* 🔥 Animated Branding */}
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide animate-pulse">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-lg text-gray-200 max-w-2xl animate-fadeIn">
          Chill. Explore. Discover. – Your daily dose of trailers, tech, sports
          & more.
        </p>

        {/* Search Bar */}
        <div className="w-full flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder-gray-300"
          />
          <button
            onClick={handleSearchClick}
            className="ml-2 p-2 rounded-full hover:bg-white/20 transition"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
