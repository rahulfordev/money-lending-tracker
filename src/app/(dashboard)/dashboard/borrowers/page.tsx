"use client";

import { useState, useEffect } from "react";
import { Borrower } from "../../../../types";
import { apiClient } from "../../../../lib/api";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { AddBorrowerModal } from "../../../../components/borrowers/AddBorrowerModal";

export default function BorrowersPage() {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Borrowers</h1>
          <p className="text-gray-600 mt-2">
            Manage all your borrowers in one place
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Borrower</Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {borrowers.map((borrower) => (
          <Card
            key={borrower.id}
            className="hover:shadow-md transition-shadow"
            hover
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {borrower.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  borrower.balance > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {borrower.balance > 0 ? "Pending" : "Cleared"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Borrowed:</span>
                <span className="font-medium">
                  {formatCurrency(borrower.total_borrowed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Repaid:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(borrower.total_repaid)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Balance:</span>
                <span
                  className={`font-bold ${
                    borrower.balance > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(borrower.balance)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {borrowers.length === 0 && (
        <Card className="text-center py-16">
          <div className="text-gray-500 max-w-sm mx-auto">
            <span className="text-6xl mb-4 block">👥</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No borrowers yet
            </h3>
            <p className="mb-6">
              Add your first borrower to start tracking loans and repayments
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Add Your First Borrower
            </Button>
          </div>
        </Card>
      )}

      <AddBorrowerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBorrowerAdded={loadBorrowers}
      />
    </div>
  );
}
