"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";

export function DashboardNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                MoneyTracker
              </span>
            </div>

            <div className="hidden md:flex space-x-6">
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/borrowers"
                className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                Borrowers
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 hidden sm:block">
              Welcome, <span className="font-medium">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
