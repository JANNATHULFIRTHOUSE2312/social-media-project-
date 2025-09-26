"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.post("/users/login", values);
      toast.success("Logged in successfully!");
      login(response.data);
      router.push("/");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Login failed.");
      } else {
        toast.error("Login failed.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Login Card */}
      <div className="w-full max-w-3xl rounded-xl border bg-card text-card-foreground flex overflow-hidden shadow-xl">
        {/* Left Branding Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-pink-600 to-purple-600 text-white p-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">SPOYLYTE</h1>
            <p className="text-sm opacity-90">Discover. Watch. Experience.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 bg-background">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">Log In</h3>
            <p className="text-sm text-muted-foreground">
              Welcome back to{" "}
              <span className="font-semibold text-pink-600">SPOYLYTE</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-lg pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full rounded-lg bg-pink-600 hover:bg-pink-700 text-white py-3"
              >
                Log In
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-pink-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
