"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BorrowerList } from "@/components/borrowers/BorrowerList";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <BorrowerList />
    </div>
  );
}
