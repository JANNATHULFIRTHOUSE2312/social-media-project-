"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post("/users/register", values);
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Registration failed.");
      } else {
        toast.error("Registration failed.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Signup Card */}
      <div className="w-full max-w-3xl rounded-xl border bg-card text-card-foreground flex overflow-hidden shadow-xl">
        {/* Left Branding Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-pink-600 to-purple-600 text-white p-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">SPOYLYTE</h1>
            <p className="text-sm opacity-90">
              Join us & unlock premium experiences
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 bg-background">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">Sign Up</h3>
            <p className="text-sm text-muted-foreground">
              Create your{" "}
              <span className="font-semibold text-pink-600">SPOYLYTE</span>{" "}
              account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="yourname"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password with Eye Toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-lg pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full rounded-lg bg-pink-600 hover:bg-pink-700 text-white py-3"
              >
                Create Account
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-pink-600 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
