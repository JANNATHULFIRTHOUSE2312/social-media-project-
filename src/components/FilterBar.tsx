"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const categoryDefs = [
  { key: "all", label: "All Categories", api: "" }, // FIXED: api is empty
  { key: "tech", label: "Tech", api: "Tech" },
  { key: "movie-trailers", label: "Movie Trailers", api: "Movie Trailer" },
  { key: "webseries", label: "Webseries", api: "Webseries Clips" },
  { key: "sports", label: "Sports", api: "Sports" },
  { key: "hindi-music", label: "Hindi Music", api: "Hindi Music" },
];

interface FilterBarProps {
  category?: string;
  setCategory?: (c: string) => void;
  onCategoryChange?: (c: string) => void;

  sortBy?: string;
  setSortBy?: (s: string) => void;
  onSortChange?: (s: string) => void;
}

export default function FilterBar(props: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Normalize incoming parent category -> select proper UI pill
  useEffect(() => {
    if (!props.category) return;
    const incoming = props.category.toString().toLowerCase();
    const found = categoryDefs.find(
      (c) =>
        c.key.toLowerCase() === incoming ||
        c.api.toLowerCase() === incoming ||
        c.label.toLowerCase() === incoming
    );
    if (found) setSelectedCategory(found.key);
  }, [props.category]);

  // If parent passed a UI/key value like "all" (or label),
  // convert it to the backend/API value (e.g. "" for 'all')
  // and push it back up so initial load uses the correct API filter.
  useEffect(() => {
    if (!props.setCategory || typeof props.category === "undefined") return;

    const incoming = props.category.toString();
    const found = categoryDefs.find(
      (c) =>
        c.key.toLowerCase() === incoming.toLowerCase() ||
        c.api.toLowerCase() === incoming.toLowerCase() ||
        c.label.toLowerCase() === incoming.toLowerCase()
    );

    if (found) {
      const apiValue = found.api ?? "";
      // Only update parent if the parent's value is different from the API value.
      if (incoming.toLowerCase() !== apiValue.toLowerCase()) {
        props.setCategory(apiValue);
        props.onCategoryChange?.(apiValue);
      }
    } else {
      // if the incoming value doesn't match any known category,
      // don't touch parent (safe fallback).
    }
    // Only run when props.category changes or setter exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category, props.setCategory]);

  useEffect(() => {
    if (props.sortBy) {
      if (props.sortBy === "createdAt") setSelectedSort("newest");
      else if (props.sortBy === "views") setSelectedSort("most-viewed");
    }
  }, [props.sortBy]);

  const handleCategoryClick = (key: string) => {
    setSelectedCategory(key);

    const apiValue = categoryDefs.find((c) => c.key === key)?.api ?? "";
    props.setCategory?.(apiValue);
    props.onCategoryChange?.(apiValue);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSort(val);

    const apiSort = val === "newest" ? "createdAt" : "views";
    props.setSortBy?.(apiSort);
    props.onSortChange?.(apiSort);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Categories as buttons */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2">
        {categoryDefs.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md shadow-md",
              selectedCategory === cat.key
                ? "bg-pink-500 text-white"
                : "bg-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/30"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div>
        <select
          value={selectedSort}
          onChange={handleSortChange}
          className="px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800 
                     text-sm shadow border border-gray-300 dark:border-gray-700 
                     focus:ring-2 focus:ring-pink-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="most-viewed">Most Viewed</option>
        </select>
      </div>
    </div>
  );
}
