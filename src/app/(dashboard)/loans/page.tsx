"use client";

import { useState, useEffect } from "react";
import { Loan, Borrower } from "../../../types";
import { apiClient } from "../../../lib/api";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input"; 
import { AddLoanModal } from "@/components/loans/AddLoanModal";
import { EditLoanModal } from "@/components/loans/EditLoanModal";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowersData, loansData] = await Promise.all([
        apiClient.getBorrowers(),
        getAllLoans(),
      ]);
      setBorrowers(borrowersData);
      setLoans(loansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getAllLoans = async (): Promise<Loan[]> => {
    const allLoans: Loan[] = [];
    for (const borrower of await apiClient.getBorrowers()) {
      const borrowerData = await apiClient.getBorrower(borrower.id);
      allLoans.push(
        ...borrowerData.loans.map((loan) => ({
          ...loan,
          borrower_name: borrower.name,
        }))
      );
    }
    return allLoans;
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsEditModalOpen(true);
  };

  const handleDeleteLoan = async (loanId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this loan? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiClient.deleteLoan(loanId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete loan");
    }
  };

  // Filter loans based on search term
  const filteredLoans = loans.filter(
    (loan) =>
      loan.borrower_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate loan statistics
  const totalLoans = loans.length;
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoans = loans.filter((loan) => {
    // A loan is considered active if it's recent (within last 30 days) or has no repayments tracked
    const loanDate = new Date(loan.loan_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return loanDate > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600 mt-2">Manage and track all your loans</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>+ New Loan</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalLoanAmount)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <Input
              placeholder="Search by borrower name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Filter
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Sort
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.map((loan) => (
          <Card
            key={loan.id}
            className="p-6 hover:shadow-md transition-shadow"
            hover
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {loan.borrower_name}
                    </h3>
                    {loan.description && (
                      <p className="text-gray-600 mt-1">{loan.description}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {formatCurrency(loan.amount)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(loan.loan_date)}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatDate(loan.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditLoan(loan)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteLoan(loan.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <Card className="text-center py-16">
          <div className="text-gray-500 max-w-sm mx-auto">
            <span className="text-6xl mb-4 block">💰</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No loans found" : "No loans yet"}
            </h3>
            <p className="mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by recording your first loan"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                Record Your First Loan
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Modals */}
      <AddLoanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLoanAdded={loadData}
        borrowers={borrowers}
      />

      <EditLoanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLoan(null);
        }}
        onLoanUpdated={loadData}
        loan={selectedLoan}
        borrowers={borrowers}
      />
    </div>
  );
}
