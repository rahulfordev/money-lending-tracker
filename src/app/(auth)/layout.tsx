import { Metadata } from "next";
import { Timer, CheckSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication - TimeTracker Pro",
  description: "Login or sign up to access your time tracking dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {children}
    </div>
  );
}
