"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useLoginMutation } from "@/apis/mutations/auth_mutations";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { COOKIES_KEYS } from "@/configs/constants";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("next") || "/dashboard";

  const { data, setData, submit, isLoading } = useLoginMutation({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error("Email and password are required");
      return;
    }

    const response = await submit();
    console.log(response);
    if (response?.success) {
      toast.dismiss();
      toast.success("Login Successful!");
      Cookies.set(COOKIES_KEYS.AUTH_TOKEN, response.token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      router.push(callbackUrl);
    } else {
      toast.dismiss();
      toast.error(response?.error || "Login failed");
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
            Money Tracker
          </h1>
          <p className="text-gray-600">Sign in to manage your loans</p>
        </div>

        <Card className="w-full" hover>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              autoComplete="current-password"
              showPasswordToggle={true}
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
