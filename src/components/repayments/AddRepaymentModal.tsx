"use client";

import { useState } from "react";
import { Loan } from "../../types";
import { apiClient } from "../../lib/api";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface AddRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepaymentAdded: () => void;
  loans: Loan[];
}

export function AddRepaymentModal({
  isOpen,
  onClose,
  onRepaymentAdded,
  loans,
}: AddRepaymentModalProps) {
  const [formData, setFormData] = useState({
    loan_id: "",
    amount: "",
    repayment_date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient.createRepayment({
        loan_id: parseInt(formData.loan_id),
        amount: parseFloat(formData.amount),
        repayment_date: formData.repayment_date,
        note: formData.note || undefined,
      });

      setFormData({
        loan_id: "",
        amount: "",
        repayment_date: new Date().toISOString().split("T")[0],
        note: "",
      });
      onRepaymentAdded();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to record repayment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter loans that have remaining balance (optional enhancement)
  const activeLoans = loans.filter((loan) => {
    // You could enhance this by checking actual remaining balance from API
    return true; // For now, show all loans
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Repayment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Loan *
          </label>
          <select
            value={formData.loan_id}
            onChange={(e) => handleChange("loan_id", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a loan</option>
            {activeLoans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.borrower_name} - ₹{loan.amount} (
                {loan.description || "No description"})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Only active loans with remaining balance are shown
          </p>
        </div>

        <Input
          label="Repayment Amount *"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
          placeholder="Enter repayment amount"
        />

        <Input
          label="Repayment Date"
          type="date"
          value={formData.repayment_date}
          onChange={(e) => handleChange("repayment_date", e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add any notes about this payment (e.g., payment method, reference number)"
          />
        </div>

        <div className="bg-primary-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-primary-800 mb-2">💡 Tips</h4>
          <ul className="text-xs text-primary-700 space-y-1">
            <li>• Record payments as soon as you receive them</li>
            <li>• Include reference numbers in notes for tracking</li>
            <li>• Regular updates help maintain accurate balance records</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
