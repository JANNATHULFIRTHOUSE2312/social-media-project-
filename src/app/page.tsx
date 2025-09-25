"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import VideoGrid from "@/components/VideoGrid";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Normalize for backend: "all" → ""
  const normalizedCategory =
    category.toLowerCase() === "all" ? "" : category;

  return (
    <div>
      {/* Hero: search + background */}
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={(q) => setSearchTerm(q)}
      />

      {/* Filters: categories + sort */}
      <FilterBar
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Video Grid */}
      <div className="container mx-auto px-4 py-10">
        <VideoGrid
          searchTerm={searchTerm}
          category={normalizedCategory} // ✅ always passes "" for "all"
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
