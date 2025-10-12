"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegistrationMutation } from "@/apis/mutations/auth_mutations";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { COOKIES_KEYS } from "@/configs/constants";

export default function RegisterForm() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data, setData, submit, isLoading } = useRegistrationMutation({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (data.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const response = await submit();

    if (response?.success) {
      toast.dismiss();
      toast.success("Account created successfully!");
      Cookies.set(COOKIES_KEYS.AUTH_TOKEN, response.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      router.push("/dashboard");
    } else {
      toast.dismiss();
      toast.error(response?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Start tracking your loans today</p>
        </div>

        <Card className="w-full" hover>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              required
              placeholder="Enter your full name"
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="new-password"
              helper="Must be at least 6 characters"
            />

            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
