// src/components/VideoPageClient.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Bookmark } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

export default function VideoPageClient({
  video: initialVideo,
  watchlist: initialWatchlist,
}: {
  video: any;
  watchlist: any;
}) {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialVideo.likes.length);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setIsLiked(initialVideo.likes.includes(user._id));
      setIsInWatchlist(
        initialWatchlist.videos.some((v: any) => v._id === initialVideo._id)
      );
    }
  }, [user, initialVideo, initialWatchlist]);

  // Fetch recommended videos
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get("/videos?limit=10&sortBy=views");
        setRecommended(res.data.videos || []);
      } catch (err) {
        console.error("Failed to load recommended videos");
      }
    };
    fetchRecommended();
  }, []);

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a video.");
      return;
    }

    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked((prev) => !prev);
    setLikeCount((prev: number) =>
      originalIsLiked ? prev - 1 : prev + 1
    );

    try {
      await api.post(`/videos/${initialVideo._id}/toggle-like`);
    } catch (error) {
      toast.error("Failed to update like status.");
      setIsLiked(originalIsLiked);
      setLikeCount(originalLikeCount);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!user) {
      toast.error("You must be logged in to use the watchlist.");
      return;
    }
    const originalIsInWatchlist = isInWatchlist;
    setIsInWatchlist((prev) => !prev);
    try {
      await api.post("/watchlist/toggle", { videoId: initialVideo._id });
      toast.success(
        originalIsInWatchlist
          ? "Removed from watchlist"
          : "Added to watchlist"
      );
    } catch (error) {
      toast.error("Failed to update watchlist.");
      setIsInWatchlist(originalIsInWatchlist);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="rounded-xl overflow-hidden shadow-md bg-black">
            <VideoPlayer youtubeVideoId={initialVideo.youtubeVideoId} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {initialVideo.title}
          </h1>

          {/* Views, Category, Date + Actions */}
          <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground border-b pb-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {initialVideo.views.toLocaleString()} views
              </span>
              <Badge variant="secondary">{initialVideo.category}</Badge>
              <span>{new Date(initialVideo.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleLike}
                className="flex items-center gap-2"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {likeCount.toLocaleString()}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleWatchlist}
                className="flex items-center gap-2"
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    isInWatchlist ? "fill-primary text-primary" : ""
                  }`}
                />
                {isInWatchlist ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {/* Description */}
          <Card className="mt-2 border rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">
                {initialVideo.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Recommended Videos */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold">Recommended</h2>
          <div className="space-y-3">
            {recommended.map((video) => (
              <Link
                key={video._id}
                href={`/video/${video._id}`}
                className="flex gap-3 group"
              >
                <div className="w-40 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {video.views.toLocaleString()} views
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
