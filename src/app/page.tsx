"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import VideoGrid from "@/components/VideoGrid";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");

  return (
    <div>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="container mx-auto px-4 py-10">
        {/* Pass filters directly */}
        <VideoGrid
          searchTerm={searchTerm}
          category={category}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
