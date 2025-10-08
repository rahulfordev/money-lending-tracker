import { useState, useEffect } from "react";
import { Borrower } from "../../types";
import { apiClient } from "../../lib/api";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { AddBorrowerModal } from "./AddBorrowerModal";

export function BorrowerList() {
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
        <h2 className="text-2xl font-bold text-gray-900">Borrowers</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Borrower</Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {borrowers.map((borrower) => (
          <Card key={borrower.id} className="hover:shadow-md transition-shadow">
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
        <Card className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">No borrowers yet</p>
            <p className="mb-4">
              Add your first borrower to start tracking loans
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Add First Borrower
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
