"use client";

import { useState, useEffect } from "react";
import { Loan, Borrower } from "../../types";
import { apiClient } from "../../lib/api";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface EditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanUpdated: () => void;
  loan: Loan | null;
  borrowers: Borrower[];
}

export function EditLoanModal({
  isOpen,
  onClose,
  onLoanUpdated,
  loan,
  borrowers,
}: EditLoanModalProps) {
  const [formData, setFormData] = useState({
    borrower_id: "",
    amount: "",
    loan_date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loan) {
      setFormData({
        borrower_id: loan.borrower_id.toString(),
        amount: loan.amount.toString(),
        loan_date: loan.loan_date.split("T")[0],
        description: loan.description || "",
      });
    }
  }, [loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan) return;

    setError("");
    setLoading(true);

    try {
      await apiClient.updateLoan(loan.id, {
        amount: parseFloat(formData.amount),
        loan_date: formData.loan_date,
        description: formData.description || undefined,
      });

      onLoanUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update loan");
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

  if (!loan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Loan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Borrower
          </label>
          <select
            value={formData.borrower_id}
            onChange={(e) => handleChange("borrower_id", e.target.value)}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-100"
          >
            <option value={formData.borrower_id}>
              {
                borrowers.find((b) => b.id === parseInt(formData.borrower_id))
                  ?.name
              }
            </option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Borrower cannot be changed after loan creation
          </p>
        </div>

        <Input
          label="Loan Amount *"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
          placeholder="Enter loan amount"
        />

        <Input
          label="Loan Date"
          type="date"
          value={formData.loan_date}
          onChange={(e) => handleChange("loan_date", e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Optional description or purpose of the loan"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Update Loan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
