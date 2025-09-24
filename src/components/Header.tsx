"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 pl-4">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
  SPOTLYTE
</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart */}
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-pink-500/10"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-xs text-white">
                        {itemCount}
                      </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Button>
                </Link>

                {/* Avatar */}
                <Link href="/profile" aria-label="Go to profile page">
                  <Avatar className="h-9 w-9 ring-2 ring-pink-500/60">
                    <AvatarImage
                      src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user.username}`}
                    />
                    <AvatarFallback>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Logout */}
                <Button
                  onClick={logout}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-pink-500/10">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-pink-500/10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
