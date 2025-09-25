"use client";

import { useState, useEffect } from "react";

export default function SidebarWithCategories() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [videos, setVideos] = useState<any[]>([]);

  const categories = [
    "All Categories",
    "Tech",
    "Movie Trailers",
    "Webseries",
    "Sports",
    "Hindi Music",
  ];

  // Fetch videos from API based on selected category
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let url = "/api/videos"; // change to your backend API
        if (selectedCategory !== "All Categories") {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-52 h-screen bg-black text-white flex flex-col py-6 space-y-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-left px-4 py-2 hover:bg-gray-800 ${
              selectedCategory === cat ? "text-pink-500 font-semibold" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-3 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-900 text-white rounded-xl overflow-hidden"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-2">{video.title}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No videos in this category.</p>
        )}
      </main>
    </div>
  );
}
