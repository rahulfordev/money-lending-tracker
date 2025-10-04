"use client";

import { useState, useEffect } from "react";
import { Repayment, Loan, Borrower } from "../../../types";
import { apiClient } from "../../../lib/api";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { EditRepaymentModal } from "@/components/repayments/EditRepaymentModal";
import { AddRepaymentModal } from "@/components/repayments/AddRepaymentModal";

interface RepaymentWithDetails extends Repayment {
  loan_amount?: number;
  borrower_name?: string;
  loan_description?: string;
  remaining_balance?: number;
}

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<RepaymentWithDetails[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRepayment, setSelectedRepayment] =
    useState<RepaymentWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBorrower, setFilterBorrower] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowersData, loansData] = await Promise.all([
        apiClient.getBorrowers(),
        getAllLoans(),
      ]);

      setBorrowers(borrowersData);
      setLoans(loansData);

      // Load repayments for all loans
      const allRepayments: RepaymentWithDetails[] = [];
      for (const loan of loansData) {
        try {
          const loanDetails = await apiClient.getLoan(loan.id);
          const repaymentsWithDetails = loanDetails.repayments.map(
            (repayment) => ({
              ...repayment,
              loan_amount: loan.amount,
              borrower_name: loan.borrower_name,
              loan_description: loan.description,
              remaining_balance: calculateRemainingBalance(
                loan,
                loanDetails.repayments,
                repayment
              ),
            })
          );
          allRepayments.push(...repaymentsWithDetails);
        } catch (err) {
          console.error(`Failed to load repayments for loan ${loan.id}:`, err);
        }
      }

      // Sort by latest repayment date first
      allRepayments.sort(
        (a, b) =>
          new Date(b.repayment_date).getTime() -
          new Date(a.repayment_date).getTime()
      );
      setRepayments(allRepayments);
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

  const calculateRemainingBalance = (
    loan: Loan,
    repayments: Repayment[],
    currentRepayment: Repayment
  ): number => {
    const totalRepaidBeforeThis = repayments
      .filter(
        (rep) =>
          new Date(rep.repayment_date) <=
          new Date(currentRepayment.repayment_date)
      )
      .reduce((sum, rep) => sum + rep.amount, 0);

    return loan.amount - totalRepaidBeforeThis;
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

  const handleEditRepayment = (repayment: RepaymentWithDetails) => {
    setSelectedRepayment(repayment);
    setIsEditModalOpen(true);
  };

  const handleDeleteRepayment = async (repaymentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this repayment record? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiClient.deleteRepayment(repaymentId);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete repayment"
      );
    }
  };

  // Filter repayments based on search term and borrower filter
  const filteredRepayments = repayments.filter(
    (repayment) =>
      (repayment.borrower_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        repayment.note?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterBorrower === "" || repayment.borrower_name === filterBorrower)
  );

  // Calculate repayment statistics
  const totalRepayments = repayments.length;
  const totalRepaymentAmount = repayments.reduce(
    (sum, repayment) => sum + repayment.amount,
    0
  );
  const recentRepayments = repayments.filter((repayment) => {
    const repaymentDate = new Date(repayment.repayment_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return repaymentDate > thirtyDaysAgo;
  }).length;

  // Get unique borrowers for filter
  const uniqueBorrowers = [
    ...new Set(
      repayments.map((repayment) => repayment.borrower_name).filter(Boolean)
    ),
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Repayments</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all loan repayments
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Record Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Repayments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRepayments}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recovered
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRepaymentAmount)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Recent (30 days)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {recentRepayments}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search by borrower or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              value={filterBorrower}
              onChange={(e) => setFilterBorrower(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Borrowers</option>
              {uniqueBorrowers.map((borrower) => (
                <option key={borrower} value={borrower}>
                  {borrower}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">
              This Month
            </Button>
            <Button variant="secondary" size="sm" className="flex-1">
              Export
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Repayments List */}
      <div className="space-y-4">
        {filteredRepayments.map((repayment) => (
          <Card
            key={repayment.id}
            className="p-6 hover:shadow-md transition-shadow"
            hover
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {repayment.borrower_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Loan: {formatCurrency(repayment.loan_amount || 0)}
                      {repayment.loan_description &&
                        ` - ${repayment.loan_description}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {formatCurrency(repayment.amount)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Amount Paid</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-400"
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
                    <div>
                      <div className="font-medium">Payment Date</div>
                      <div>{formatDate(repayment.repayment_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Remaining Balance</div>
                      <div
                        className={
                          repayment.remaining_balance &&
                          repayment.remaining_balance > 0
                            ? "text-orange-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {formatCurrency(repayment.remaining_balance || 0)}
                      </div>
                    </div>
                  </div>

                  {repayment.note && (
                    <div className="flex items-start">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">Note</div>
                        <div className="text-gray-700">{repayment.note}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 lg:flex-col">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditRepayment(repayment)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteRepayment(repayment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRepayments.length === 0 && (
        <Card className="text-center py-16">
          <div className="text-gray-500 max-w-sm mx-auto">
            <span className="text-6xl mb-4 block">🔄</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterBorrower
                ? "No repayments found"
                : "No repayments yet"}
            </h3>
            <p className="mb-6">
              {searchTerm || filterBorrower
                ? "Try adjusting your search terms or filters"
                : "Start by recording your first repayment"}
            </p>
            {!searchTerm && !filterBorrower && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                Record Your First Payment
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Modals */}
      <AddRepaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRepaymentAdded={loadData}
        loans={loans}
      />

      <EditRepaymentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRepayment(null);
        }}
        onRepaymentUpdated={loadData}
        repayment={selectedRepayment}
        loans={loans}
      />
    </div>
  );
}
