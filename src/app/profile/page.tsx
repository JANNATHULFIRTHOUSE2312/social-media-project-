"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import VideoCard from "@/components/VideoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner color with persistence
  const [bannerColor, setBannerColor] = useState("#4f46e5");

  useEffect(() => {
    const savedColor = localStorage.getItem("bannerColor");
    if (savedColor) setBannerColor(savedColor);
  }, []);

  const handleColorChange = (color: string) => {
    setBannerColor(color);
    localStorage.setItem("bannerColor", color);
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("You must be logged in to view this page.");
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);

          const [watchlistRes, ordersRes] = await Promise.all([
            api.get("/watchlist"),
            api.get("/orders").catch(() => ({ data: [] })),
          ]);

          setWatchlist(watchlistRes.data.videos || []);
          setOrders(ordersRes.data.orders || ordersRes.data || []);
        } catch (error) {
          toast.error("Could not load your profile data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (isAuthLoading || !user) {
    return <div className="container text-center py-10">Loading profile...</div>;
  }

  // --- Collect unique purchased videos with their order date ---
  const allPurchased = orders.flatMap((order: any) =>
    order.items
      ? order.items.map((item: any) => ({
          ...item.videoId,
          purchasedAt: order.createdAt,
        }))
      : (order.videos || []).map((video: any) => ({
          ...video,
          purchasedAt: order.createdAt,
        }))
  );

  const uniquePurchasedVideos = Array.from(
    new Map(allPurchased.map((video: any) => [video._id, video])).values()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- Profile Banner with Color Picker --- */}
      <Card className="overflow-hidden mb-8 border-2 border-primary/20 shadow-md">
        <div
          className="h-40 md:h-56 w-full transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${bannerColor}, transparent)`,
          }}
        />
        <div className="flex flex-col items-center -mt-16 space-y-4 px-4 pb-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background ring-2 ring-primary shadow-xl">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user.username}`}
            />
            <AvatarFallback>
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          {/* Color Picker */}
          <label className="h-10 w-10 rounded-full border cursor-pointer overflow-hidden relative">
            <input
              type="color"
              value={bannerColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: bannerColor }}
            />
          </label>
        </div>
      </Card>

      {/* --- Stats Section --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:border-primary transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Videos in Watchlist
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : watchlist.length}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Purchased Videos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : uniquePurchasedVideos.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Content Tabs --- */}
      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList className="justify-center">
          <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        {/* Watchlist */}
        <TabsContent value="watchlist" className="mt-6">
          {loading ? (
            <p className="text-center">Loading watchlist...</p>
          ) : watchlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {watchlist.map((video: any) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Your watchlist is empty.
            </p>
          )}
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="mt-6">
          {loading ? (
            <p className="text-center">Loading purchases...</p>
          ) : uniquePurchasedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uniquePurchasedVideos.map((video: any) => (
                <div key={video._id} className="relative group">
                  {/* Wrap VideoCard */}
                  <VideoCard video={video} />
                  {/* Date badge */}
                  {video.purchasedAt && (
                    <Badge className="absolute top-2 left-2 bg-pink-600 text-white text-xs shadow-sm">
                      {new Date(video.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  )}
                  {/* Hide cart button only in orders */}
                  <style jsx>{`
                    .group :global(button[aria-label="Add to cart"]) {
                      display: none !important;
                    }
                  `}</style>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              You haven’t purchased any videos yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
