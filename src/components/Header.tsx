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
    <header
      className="
        sticky top-0 left-0 w-full z-50
        bg-white/10 dark:bg-black/20
        backdrop-blur-md border-b border-white/20
      "
    >
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent drop-shadow">
            SPOTLYTE
          </span>
        </Link>

        {/* Right Side */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/10 rounded-full transition"
                >
                  <ShoppingCart className="h-5 w-5 text-black dark:text-white drop-shadow" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-xs text-white shadow-md">
                      {itemCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              {/* Avatar */}
              <Link href="/profile" aria-label="Go to profile page">
                <Avatar className="h-9 w-9 ring-2 ring-pink-500/70 shadow-md">
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
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 shadow-md"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-white/10 text-black dark:text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-4 shadow-md">
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
            className="hover:bg-white/10 rounded-full transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400 drop-shadow" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800 drop-shadow" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
