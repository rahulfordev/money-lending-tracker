"use client";

import { useState, useEffect } from "react";
import { Borrower } from "../../types";
import { apiClient } from "../../lib/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AddBorrowerModal } from "../../components/borrowers/AddBorrowerModal";
import Link from "next/link";

export default function DashboardPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadBorrowers = async () => {
    try {
      const data = await apiClient.getBorrowers();
      setBorrowers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load borrowers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate dashboard stats
  const totalBorrowed = borrowers.reduce(
    (sum, borrower) => sum + borrower.total_borrowed,
    0
  );
  const totalRepaid = borrowers.reduce(
    (sum, borrower) => sum + borrower.total_repaid,
    0
  );
  const totalBalance = borrowers.reduce(
    (sum, borrower) => sum + borrower.balance,
    0
  );
  const activeBorrowers = borrowers.filter(
    (borrower) => borrower.balance > 0
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your lending overview.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Borrower</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBorrowed)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recovered
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRepaid)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Borrowers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeBorrowers}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Borrowers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Borrowers */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Borrowers
            </h2>
            <Link href="/dashboard/borrowers">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {borrowers.slice(0, 5).map((borrower) => (
              <div
                key={borrower.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {borrower.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {borrower.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {borrower.balance > 0 ? "Pending" : "Cleared"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      borrower.balance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(borrower.balance)}
                  </p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            ))}
          </div>

          {borrowers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">👥</span>
              <p>No borrowers yet</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4"
                size="sm"
              >
                Add Your First Borrower
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/loans">
              <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-300">
                <span className="text-3xl mb-2 block">💰</span>
                <p className="font-medium text-gray-900">New Loan</p>
                <p className="text-xs text-gray-500 mt-1">Record a new loan</p>
              </Card>
            </Link>

            <Link href="/dashboard/repayments">
              <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-green-300">
                <span className="text-3xl mb-2 block">🔄</span>
                <p className="font-medium text-gray-900">Record Payment</p>
                <p className="text-xs text-gray-500 mt-1">Add repayment</p>
              </Card>
            </Link>

            <Link href="/dashboard/borrowers">
              <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-300">
                <span className="text-3xl mb-2 block">👥</span>
                <p className="font-medium text-gray-900">Manage Borrowers</p>
                <p className="text-xs text-gray-500 mt-1">View all borrowers</p>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-orange-300">
                <span className="text-3xl mb-2 block">📈</span>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500 mt-1">View reports</p>
              </Card>
            </Link>
          </div>
        </Card>
      </div>

      <AddBorrowerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBorrowerAdded={loadBorrowers}
      />
    </div>
  );
}
