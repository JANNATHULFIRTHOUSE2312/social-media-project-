"use client";
import { useState, useEffect, useRef } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
 
interface VideoGridProps {
  searchTerm: string;
  category: string;
  sortBy: string;
}
 
export type Video = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  previewUrl?: string;
  views: number;
};
 
export default function VideoGrid({ searchTerm, category, sortBy }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  // A ref to prevent fetching the same page multiple times
  const initialFetchDone = useRef(false);
 
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
 
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
 
  // Effect 1: Handles resetting and fetching the FIRST page
  useEffect(() => {
    // Reset state whenever search, category, or sort changes
    setVideos([]);
    setPage(1);
    setHasNextPage(true);
    initialFetchDone.current = false; // Reset the fetch guard
  }, [debouncedSearchTerm, category, sortBy]);
 
 
  // Effect 2: Handles ALL data fetching (initial and subsequent pages)
  useEffect(() => {
    const isInitialLoad = page === 1 && !initialFetchDone.current;
    const canLoadMore = inView && hasNextPage;
 
    // Exit if we're already loading, or if it's not time to fetch
    if (loading || (!isInitialLoad && !canLoadMore)) {
      return;
    }
 
    const fetchVideos = async () => {
      setLoading(true);
      if (page === 1) {
        initialFetchDone.current = true;
      }
 
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder: "desc",
      });
 
      if (debouncedSearchTerm) params.append("query", debouncedSearchTerm);
      if (category !== "All") params.append("category", category);
 
      try {
        const res = await api.get(`/videos?${params.toString()}`);
        const data = res.data;
 
        // Use functional updates to correctly append data
        setVideos((prev) => {
            const existingIds = new Set(prev.map((v) => v._id));
            const newVideos = (data.videos || []).filter(
                (video: Video) => !existingIds.has(video._id)
            );
            return [...prev, ...newVideos];
        });
        setPage((prevPage) => prevPage + 1);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        // Optional: handle error state, e.g., set an error message
      } finally {
        setLoading(false);
      }
    };
 
    fetchVideos();
  }, [page, debouncedSearchTerm, category, sortBy, inView, hasNextPage, loading]);
 
 
  return (
<div>
      {/* Video Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video: Video) => (
<VideoCard key={video._id} video={video} />
        ))}
</div>
 
      {/* Infinite Scroll Trigger & Status Messages */}
<div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <p className="text-center">Loading more videos...</p>}
        {!loading && !hasNextPage && videos.length > 0 && (
<p className="text-center text-muted-foreground">
            You have reached the end!
</p>
        )}
        {!loading && videos.length === 0 && (
<p className="text-center text-muted-foreground">
             No videos found. Try adjusting your search or filters.
</p>
        )}
</div>
</div>
  );
}