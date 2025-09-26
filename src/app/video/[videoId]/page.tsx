"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import VideoPageClient, { Video, Watchlist } from "@/components/VideoPageClient";

const VideoPage = () => {
  const { videoId } = useParams(); // dynamic route param
  const router = useRouter();

  const [video, setVideo] = useState<Video>();
  const [watchlist, setWatchlist] = useState<Watchlist>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    const fetchData = async () => {
      try {
        const api = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
          withCredentials: true, // send cookies automatically
        });

        const [videoRes, watchlistRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get("/watchlist").catch(() => ({ data: { videos: [] } })),
        ]);

        setVideo(videoRes.data);
        setWatchlist(watchlistRes.data.videos || []);
      } catch (error) {
        console.error("Error fetching video page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-semibold">Loading video...</h1>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Could Not Load Video</h1>
        <p className="text-muted-foreground">
          The video may not exist, or a server error occurred.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg shadow"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return <VideoPageClient video={video} watchlist={watchlist} />;
};

export default VideoPage;
