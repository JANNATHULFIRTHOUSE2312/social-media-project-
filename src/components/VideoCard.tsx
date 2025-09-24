"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRef } from "react";

export default function VideoCard({ video }: { video: any }) {
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      await api.post("/cart/add", { videoId: video._id, purchaseType: "buy" });
      toast.success(`"${video.title}" added to your cart!`);
      fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not add to cart.");
    }
  };

  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num;
  };

  return (
    <Link
      href={`/video/${video._id}`}
      className="group flex flex-col space-y-2"
    >
      {/* Thumbnail / Preview */}
      <div
        className="relative aspect-video rounded-lg overflow-hidden"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
      >
        {/* Thumbnail */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {/* Video preview */}
        {video.previewUrl && (
          <video
            ref={videoRef}
            src={video.previewUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {/* Premium Label */}
        <Badge className="absolute top-2 left-2 bg-neutral-800/80 text-white text-xs">
          Premium
        </Badge>
      </div>

      {/* Video info */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 group-hover:text-foreground">
            {video.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {formatViews(video.views)} views
          </p>
        </div>

        {/* Add to cart */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="hover:bg-muted rounded-full"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
