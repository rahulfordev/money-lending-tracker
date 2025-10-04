"use client";

import { useState } from "react";
import { Borrower } from "../../types";
import { apiClient } from "../../lib/api";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanAdded: () => void;
  borrowers: Borrower[];
}

export function AddLoanModal({
  isOpen,
  onClose,
  onLoanAdded,
  borrowers,
}: AddLoanModalProps) {
  const [formData, setFormData] = useState({
    borrower_id: "",
    amount: "",
    loan_date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient.createLoan({
        borrower_id: parseInt(formData.borrower_id),
        amount: parseFloat(formData.amount),
        loan_date: formData.loan_date,
        description: formData.description || undefined,
      });

      setFormData({
        borrower_id: "",
        amount: "",
        loan_date: new Date().toISOString().split("T")[0],
        description: "",
      });
      onLoanAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create loan");
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record New Loan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Borrower *
          </label>
          <select
            value={formData.borrower_id}
            onChange={(e) => handleChange("borrower_id", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a borrower</option>
            {borrowers.map((borrower) => (
              <option key={borrower.id} value={borrower.id}>
                {borrower.name}
              </option>
            ))}
          </select>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional description or purpose of the loan"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Record Loan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
