"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        🛒 Your Shopping Cart
      </h1>

      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <Card
                key={item._id}
                className="flex items-center p-4 hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.videoId.thumbnailUrl}
                    alt={item.videoId.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 128px"
                  />
                </div>

                {/* Title + Info */}
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold text-lg line-clamp-1">{item.videoId.title}</h2>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.purchaseType}
                  </p>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end space-y-2">
                  <p className="font-semibold text-lg">₹{item.price.toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-lg py-6"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Your cart is empty 🛍️
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Looks like you haven’t added any premium videos yet.  
            Browse our collection and find your next favorite!
          </p>
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
