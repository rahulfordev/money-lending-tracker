"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Hand,
  Repeat,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Borrowers",
    href: "/borrowers",
    icon: Users,
  },
  {
    name: "Loans",
    href: "/loans",
    icon: Hand,
  },
  {
    name: "Repayments",
    href: "/repayments",
    icon: Repeat,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`
      bg-white border-r border-gray-200 transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}
      h-[calc(100vh-4rem)] sticky top-16 flex flex-col
    `}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          {!isCollapsed && (
            <span className="ml-2 text-sm transition-opacity duration-200">
              Collapse
            </span>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav
        className={`flex-1 transition-all duration-300 ${isCollapsed ? "p-2" : "p-4"} space-y-1`}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}

      <div
        className={`border-t border-gray-200 space-y-1 transition-all duration-300 ${isCollapsed ? "p-2" : "p-4"}`}
      >
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
               ${
                 isActive
                   ? "bg-primary-50 text-primary-700 border-r-2 border-primary shadow-sm"
                   : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
               }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Stats (Visible when expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-primary-50/30">
          <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Quick Stats
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs">
              <div className="flex items-center">
                <div className="p-1.5 bg-primary-100 rounded-md">
                  <Hand className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-600 ml-2">Active Loans</span>
              </div>
              <span className="text-sm font-semibold text-primary bg-primary-50 px-2 py-1 rounded">
                12
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs">
              <div className="flex items-center">
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <Repeat className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600 ml-2">Pending</span>
              </div>
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                ₹45,230
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs">
              <div className="flex items-center">
                <div className="p-1.5 bg-green-100 rounded-md">
                  <BarChart3 className="h-3.5 w-3.5 text-green-600" />
                </div>
                <span className="text-sm text-gray-600 ml-2">Recovered</span>
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                ₹78,450
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Stats (Visible when collapsed) */}
      {isCollapsed && (
        <div className="p-3 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-primary-50/30">
          <div className="space-y-3">
            <div
              className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs cursor-help"
              title="Active Loans"
            >
              <Hand className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary mt-1">
                12
              </span>
            </div>

            <div
              className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs cursor-help"
              title="Pending Amount"
            >
              <Repeat className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600 mt-1">
                45K
              </span>
            </div>

            <div
              className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 shadow-xs cursor-help"
              title="Recovered Amount"
            >
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-xs font-semibold text-green-600 mt-1">
                78K
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
