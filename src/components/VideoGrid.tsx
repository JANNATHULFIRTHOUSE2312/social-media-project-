"use client";

import { useState, useEffect, useCallback } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";

interface VideoGridProps {
  searchTerm: string;
  category: string;
  sortBy: string;
}

export default function VideoGrid({ searchTerm, category, sortBy }: VideoGridProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const fetchVideos = useCallback(
    async (isNewSearch = false) => {
      const pageToFetch = isNewSearch ? 1 : page;

      if (loading) return;
      setLoading(true);

      const params = new URLSearchParams({
        page: pageToFetch.toString(),
        limit: "12",
        sortBy,
        sortOrder: "desc",
      });

      if (debouncedSearchTerm) params.append("query", debouncedSearchTerm);
      if (category !== "All") params.append("category", category);

      try {
        const res = await api.get(`/videos?${params.toString()}`);
        const data = res.data;

        if (isNewSearch) {
          setVideos(data.videos || []);
        } else {
          setVideos((prev) => {
            const existingIds = new Set(prev.map((v) => v._id));
            const newVideos = (data.videos || []).filter(
              (video: any) => !existingIds.has(video._id)
            );
            return [...prev, ...newVideos];
          });
        }

        setHasNextPage(data.hasNextPage);
        if (data.hasNextPage) {
          setPage(pageToFetch + 1);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearchTerm, category, sortBy, loading]
  );

  useEffect(() => {
    fetchVideos(true);
  }, [debouncedSearchTerm, category, sortBy]);

  useEffect(() => {
    if (inView && !loading && hasNextPage) {
      fetchVideos(false);
    }
  }, [inView, loading, hasNextPage, fetchVideos]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <p className="text-center">Loading more videos...</p>}
        {!loading && !hasNextPage && videos.length > 0 && (
          <p className="text-center text-muted-foreground">
            You've reached the end!
          </p>
        )}
        {!loading && videos.length === 0 && (
          <p>No videos found. Try adjusting your search or filters.</p>
        )}
      </div>
    </div>
  );
}
