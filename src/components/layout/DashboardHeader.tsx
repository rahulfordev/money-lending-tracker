"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Bell, LogOut, User, Settings } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useLogoutQuery } from "@/apis/queries/user_queries";
import { useRouter } from "next/navigation";
import { COOKIES_KEYS } from "@/configs/constants";
import { useState, useRef, useEffect } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, mutate: logout } = useLogoutQuery();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    const res = await logout();
    if (res?.success) {
      Cookies.remove(COOKIES_KEYS.AUTH_TOKEN);
      toast.success(res?.data || "Logged out successfully");
      setIsDropdownOpen(false);
      router.push("/login");
    } else {
      toast.error(res?.data || "Logout failed");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (callback: () => void) => {
    callback();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-pastelLavender sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                MoneyTracker
              </span>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile with Dropdown */}
            <div className="flex items-center space-x-3" ref={dropdownRef}>
              {/* User info - hidden on mobile */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* User Avatar with Dropdown */}
              <div className="relative">
                {/* User Avatar Button */}
                <button
                  onClick={toggleDropdown}
                  className="h-8 w-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-small py-1 z-50 animate-in fade-in-0 zoom-in-95"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {/* User Info in Dropdown - Only show on mobile */}
                    <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Profile Option */}
                    <button
                      onClick={() =>
                        handleDropdownItemClick(() => router.push("/profile"))
                      }
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </button>

                    {/* Settings Option */}
                    <button
                      onClick={() =>
                        handleDropdownItemClick(() => router.push("/settings"))
                      }
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>

                    {/* Divider */}
                    <div className="my-1 border-t border-gray-100" />

                    {/* Logout Option */}
                    <button
                      onClick={() => handleDropdownItemClick(handleLogout)}
                      disabled={isLoading}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
