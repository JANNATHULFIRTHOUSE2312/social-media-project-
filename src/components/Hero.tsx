"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryDefs = [
  { key: "all", label: "All Categories", api: "all" },
  { key: "tech", label: "Tech", api: "Tech" },
  { key: "movie-trailers", label: "Movie Trailers", api: "Movie Trailer" },
  { key: "webseries", label: "Webseries", api: "Webseries Clips" },
  { key: "sports", label: "Sports", api: "Sports" },
  { key: "hindi-music", label: "Hindi Music", api: "Hindi Music" },
];

const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1920&q=80&auto=format&fit=crop",
];

interface HeroProps {
  searchTerm?: string;
  setSearchTerm?: (q: string) => void;
  category?: string;
  setCategory?: (c: string) => void;
  sortBy?: string;
  setSortBy?: (s: string) => void;

  onSearch?: (q: string) => void;
  onCategoryChange?: (c: string) => void;
  onSortChange?: (s: string) => void;
}

export default function Hero(props: HeroProps) {
  const [search, setSearch] = useState(props.searchTerm ?? "");
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const incoming = props.category ?? "";
    if (!incoming) return "all";
    const low = incoming.toString().toLowerCase();
    const found = categoryDefs.find(
      (c) =>
        c.key.toLowerCase() === low ||
        c.api.toLowerCase() === low ||
        c.label.toLowerCase() === low
    );
    return found ? found.key : "all";
  });

  const sortMap: Record<string, string> = {
    newest: "createdAt",
    "most-viewed": "views",
  };

  const reverseSortMap: Record<string, string> = {
    createdAt: "newest",
    views: "most-viewed",
  };

  const [selectedSortKey, setSelectedSortKey] = useState<string>(() => {
    const incoming = props.sortBy ?? "";
    if (!incoming) return "newest";
    if (incoming === "newest" || incoming === "most-viewed") return incoming;
    return (reverseSortMap[incoming] as string) ?? "newest";
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (typeof props.searchTerm !== "undefined" && props.searchTerm !== search) {
      setSearch(props.searchTerm);
    }
  }, [props.searchTerm]);

  useEffect(() => {
    if (!props.category) return;
    const incoming = props.category.toString().toLowerCase();
    const found = categoryDefs.find(
      (c) =>
        c.key.toLowerCase() === incoming ||
        c.api.toLowerCase() === incoming ||
        c.label.toLowerCase() === incoming
    );
    if (found) setSelectedKey(found.key);
  }, [props.category]);

  useEffect(() => {
    if (!props.sortBy) return;
    const incoming = props.sortBy.toString();
    if (incoming === "newest" || incoming === "most-viewed") {
      setSelectedSortKey(incoming);
      return;
    }
    if (reverseSortMap[incoming]) setSelectedSortKey(reverseSortMap[incoming]);
  }, [props.sortBy]);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const notifySearch = (q: string) => {
    if (props.setSearchTerm) props.setSearchTerm(q);
    if (props.onSearch) props.onSearch(q);
  };

  const notifyCategory = (apiValue: string) => {
    if (props.setCategory) props.setCategory(apiValue);
    if (props.onCategoryChange) props.onCategoryChange(apiValue);
  };

  const notifySort = (apiSort: string) => {
    if (props.setSortBy) props.setSortBy(apiSort);
    if (props.onSortChange) props.onSortChange(apiSort);
  };

  const handleSearchClick = () => {
    notifySearch(search);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      notifySearch(search);
    }
  };

  const handleCategoryClick = (key: string) => {
    setSelectedKey(key);

    if (key === "all") {
      // Reset category filter
      notifyCategory("");
    } else {
      const apiValue = categoryDefs.find((c) => c.key === key)?.api ?? key;
      notifyCategory(apiValue);
    }
  };

  const handleSortClick = (uiKey: string) => {
    setSelectedSortKey(uiKey);
    const apiSort = sortMap[uiKey] ?? uiKey;
    notifySort(apiSort);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
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

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4">
        <div className="w-full md:w-2/3 mx-auto flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchEnter}
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder-gray-300"
          />
          <button
            onClick={handleSearchClick}
            className="ml-2 p-2 rounded-full hover:bg-white/20 transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mt-16 gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categoryDefs.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md shadow-md",
                  selectedKey === cat.key
                    ? "bg-pink-500 text-white"
                    : "bg-white/20 text-gray-200 hover:bg-white/30"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center md:justify-end gap-2">
            <button
              onClick={() => handleSortClick("newest")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md shadow-md",
                selectedSortKey === "newest"
                  ? "bg-pink-500 text-white"
                  : "bg-white/20 text-gray-200 hover:bg-white/30"
              )}
            >
              Newest First
            </button>

            <button
              onClick={() => handleSortClick("most-viewed")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md shadow-md",
                selectedSortKey === "most-viewed"
                  ? "bg-pink-500 text-white"
                  : "bg-white/20 text-gray-200 hover:bg-white/30"
              )}
            >
              Most Viewed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
