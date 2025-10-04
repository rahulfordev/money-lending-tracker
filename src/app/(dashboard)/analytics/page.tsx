"use client";

import { useState, useEffect } from "react";
import { Borrower, Loan, Repayment } from "../../../types";
import { apiClient } from "../../../lib/api";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface AnalyticsData {
  borrowers: Borrower[];
  loans: Loan[];
  repayments: Repayment[];
  stats: {
    totalBorrowers: number;
    totalLoans: number;
    totalLoanAmount: number;
    totalRepaid: number;
    totalBalance: number;
    recoveryRate: number;
    avgLoanAmount: number;
    activeLoans: number;
  };
  monthlyData: {
    month: string;
    loans: number;
    repayments: number;
  }[];
  borrowerPerformance: {
    name: string;
    totalBorrowed: number;
    totalRepaid: number;
    balance: number;
    recoveryRate: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "90days" | "1year"
  >("30days");

  const loadData = async () => {
    try {
      setLoading(true);

      const borrowers = await apiClient.getBorrowers();
      const allLoans: Loan[] = [];
      const allRepayments: Repayment[] = [];

      // Load all loans and repayments
      for (const borrower of borrowers) {
        const borrowerData = await apiClient.getBorrower(borrower.id);
        const loansWithBorrower = borrowerData.loans.map((loan) => ({
          ...loan,
          borrower_name: borrower.name,
        }));
        allLoans.push(...loansWithBorrower);

        // Load repayments for each loan
        for (const loan of borrowerData.loans) {
          try {
            const loanDetails = await apiClient.getLoan(loan.id);
            allRepayments.push(...loanDetails.repayments);
          } catch (err) {
            console.error(
              `Failed to load repayments for loan ${loan.id}:`,
              err
            );
          }
        }
      }

      // Calculate statistics
      const totalLoanAmount = allLoans.reduce(
        (sum, loan) => sum + loan.amount,
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
      const recoveryRate =
        totalLoanAmount > 0 ? (totalRepaid / totalLoanAmount) * 100 : 0;
      const avgLoanAmount =
        allLoans.length > 0 ? totalLoanAmount / allLoans.length : 0;
      const activeLoans = allLoans.filter((loan) => {
        const loanDate = new Date(loan.loan_date);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return loanDate > ninetyDaysAgo;
      }).length;

      // Generate monthly data (last 6 months)
      const monthlyData = generateMonthlyData(allLoans, allRepayments);

      // Borrower performance
      const borrowerPerformance = borrowers
        .map((borrower) => ({
          name: borrower.name,
          totalBorrowed: borrower.total_borrowed,
          totalRepaid: borrower.total_repaid,
          balance: borrower.balance,
          recoveryRate:
            borrower.total_borrowed > 0
              ? (borrower.total_repaid / borrower.total_borrowed) * 100
              : 0,
        }))
        .sort((a, b) => b.totalBorrowed - a.totalBorrowed);

      const analyticsData: AnalyticsData = {
        borrowers,
        loans: allLoans,
        repayments: allRepayments,
        stats: {
          totalBorrowers: borrowers.length,
          totalLoans: allLoans.length,
          totalLoanAmount,
          totalRepaid,
          totalBalance,
          recoveryRate,
          avgLoanAmount,
          activeLoans,
        },
        monthlyData,
        borrowerPerformance,
      };

      setData(analyticsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (loans: Loan[], repayments: Repayment[]) => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      const monthLoans = loans.filter((loan) => {
        const loanDate = new Date(loan.loan_date);
        return (
          loanDate.getMonth() === date.getMonth() &&
          loanDate.getFullYear() === date.getFullYear()
        );
      });

      const monthRepayments = repayments.filter((repayment) => {
        const repaymentDate = new Date(repayment.repayment_date);
        return (
          repaymentDate.getMonth() === date.getMonth() &&
          repaymentDate.getFullYear() === date.getFullYear()
        );
      });

      months.push({
        month: monthKey,
        loans: monthLoans.reduce((sum, loan) => sum + loan.amount, 0),
        repayments: monthRepayments.reduce((sum, rep) => sum + rep.amount, 0),
      });
    }

    return months;
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your lending business
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last 1 Year</option>
          </select>
          <Button variant="secondary">Export Report</Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.stats.totalLoanAmount)}
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
              <p className="text-sm font-medium text-gray-600">Recovered</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.stats.totalRepaid)}
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
                {formatCurrency(data.stats.totalBalance)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(data.stats.recoveryRate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Active Loans</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.stats.activeLoans}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Borrowers</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.stats.totalBorrowers}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Avg. Loan Size</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(data.stats.avgLoanAmount)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Performance
          </h3>
          <div className="space-y-4">
            {data.monthlyData.map((month, index) => (
              <div
                key={month.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700 w-20">
                  {month.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="flex space-x-1">
                    {/* Loans Bar */}
                    <div
                      className="h-6 bg-blue-500 rounded-l flex items-center justify-center"
                      style={{
                        width: `${(month.loans / Math.max(...data.monthlyData.map((m) => m.loans))) * 100}%`,
                      }}
                    >
                      {month.loans > 0 && (
                        <span className="text-xs text-white font-medium px-1">
                          {formatCurrency(month.loans)}
                        </span>
                      )}
                    </div>
                    {/* Repayments Bar */}
                    <div
                      className="h-6 bg-green-500 rounded-r flex items-center justify-center"
                      style={{
                        width: `${(month.repayments / Math.max(...data.monthlyData.map((m) => m.repayments || 1))) * 100}%`,
                      }}
                    >
                      {month.repayments > 0 && (
                        <span className="text-xs text-white font-medium px-1">
                          {formatCurrency(month.repayments)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right w-24">
                  <div className="text-sm text-blue-600 font-medium">
                    {formatCurrency(month.loans)}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {formatCurrency(month.repayments)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              Loans Given
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              Amount Recovered
            </div>
          </div>
        </Card>

        {/* Borrower Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Borrowers
          </h3>
          <div className="space-y-4">
            {data.borrowerPerformance.slice(0, 5).map((borrower, index) => (
              <div
                key={borrower.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {borrower.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {borrower.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPercentage(borrower.recoveryRate)} recovered
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(borrower.totalBorrowed)}
                  </p>
                  <p
                    className={`text-xs ${borrower.balance > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {formatCurrency(borrower.balance)} balance
                  </p>
                </div>
              </div>
            ))}
          </div>
          {data.borrowerPerformance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">👥</span>
              <p>No borrower data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Loan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Status Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fully Repaid</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(data.borrowers.filter((b) => b.balance <= 0).length / data.stats.totalBorrowers) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12">
                  {data.borrowers.filter((b) => b.balance <= 0).length}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Partially Paid</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${(data.borrowers.filter((b) => b.balance > 0 && b.total_repaid > 0).length / data.stats.totalBorrowers) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12">
                  {
                    data.borrowers.filter(
                      (b) => b.balance > 0 && b.total_repaid > 0
                    ).length
                  }
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Not Started</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(data.borrowers.filter((b) => b.balance > 0 && b.total_repaid === 0).length / data.stats.totalBorrowers) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12">
                  {
                    data.borrowers.filter(
                      (b) => b.balance > 0 && b.total_repaid === 0
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-lg">💡</span>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Recovery Performance
                </p>
                <p className="text-xs text-blue-700">
                  Your overall recovery rate is{" "}
                  {formatPercentage(data.stats.recoveryRate)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 text-lg">🎯</span>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Active Portfolio
                </p>
                <p className="text-xs text-green-700">
                  {data.stats.activeLoans} active loans with{" "}
                  {formatCurrency(data.stats.totalBalance)} pending
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-600 text-lg">📊</span>
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Average Loan Size
                </p>
                <p className="text-xs text-purple-700">
                  Average loan amount is{" "}
                  {formatCurrency(data.stats.avgLoanAmount)}
                </p>
              </div>
            </div>

            {data.stats.totalBalance > data.stats.totalLoanAmount * 0.3 && (
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-600 text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Attention Needed
                  </p>
                  <p className="text-xs text-orange-700">
                    High pending amount. Consider following up with borrowers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {data.loans.slice(0, 5).map((loan) => (
            <div
              key={loan.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New loan to {loan.borrower_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(loan.loan_date).toLocaleDateString("en-IN")} •{" "}
                    {formatCurrency(loan.amount)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {loan.description || "No description"}
              </span>
            </div>
          ))}

          {data.repayments.slice(0, 3).map((repayment) => (
            <div
              key={repayment.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">🔄</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Payment received
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(repayment.repayment_date).toLocaleDateString(
                      "en-IN"
                    )}{" "}
                    • {formatCurrency(repayment.amount)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {repayment.note || "Payment recorded"}
              </span>
            </div>
          ))}
        </div>

        {data.loans.length === 0 && data.repayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">📊</span>
            <p>No recent activity</p>
          </div>
        )}
      </Card>
    </div>
  );
}
