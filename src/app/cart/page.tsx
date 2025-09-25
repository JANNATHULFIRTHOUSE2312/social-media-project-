"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoCard from "@/components/VideoCard";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const res = await api.post("/payment/create-checkout-session");
      if (res.data.url) {
        clearCart();
        router.push(res.data.url); // Redirect to Stripe
      }
    } catch (error) {
      toast.error(`Checkout failed. Please try again. ${error}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent drop-shadow-sm">
        🛒Your Shopping Cart
      </h1>

      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-8">
            {cart.map((item) => (
              <Card
                key={item._id}
                className="p-4 rounded-2xl shadow-md border border-gray-100 bg-white/70 dark:bg-black/40 backdrop-blur-sm transition-all hover:shadow-xl hover:border-pink-200"
              >
                {/* Smaller VideoCard */}
                <div className="max-w-xs cart-video">
                  <VideoCard video={item.videoId} />
                </div>

                {/* Purchase Info + Remove */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {item.purchaseType}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="font-extrabold text-xl text-pink-600">
                      ₹{item.price.toFixed(2)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-100/60 hover:text-red-700 rounded-full px-4 py-2 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20 rounded-3xl shadow-xl border border-gray-100 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex justify-between text-base text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xl border-t pt-5 text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-lg py-6 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-24">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">
            Your cart is empty 🛍️
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven’t added any premium videos yet. Browse our
            collection and discover your next favorite!
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}

      {/* Hide cart button inside VideoCard ONLY in CartPage */}
      <style jsx>{`
        .cart-video :global(.cart-btn) {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
