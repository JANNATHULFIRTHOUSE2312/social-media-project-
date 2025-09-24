"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1920&q=80&auto=format&fit=crop",
];

export default function Hero({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
      {/* Backgrounds */}
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="bg"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Discover & Watch{" "}
          <span className="text-pink-500">Premium Videos</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {/* Search */}
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 bg-white/90 text-black"
          />

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/90 text-black">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Movie Trailer">Movie Trailers</SelectItem>
              <SelectItem value="Webseries Clips">Webseries</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Hindi Music">Hindi Music</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/90 text-black">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest First</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
