"use client";

import { useState, useEffect } from "react";
import { Loan } from "../../types";
import { apiClient } from "../../lib/api";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface RepaymentWithDetails {
  id: number;
  loan_id: number;
  amount: number;
  repayment_date: string;
  note?: string;
  borrower_name?: string;
  loan_amount?: number;
}

interface EditRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepaymentUpdated: () => void;
  repayment: RepaymentWithDetails | null;
  loans: Loan[];
}

export function EditRepaymentModal({
  isOpen,
  onClose,
  onRepaymentUpdated,
  repayment,
  loans,
}: EditRepaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    repayment_date: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (repayment) {
      setFormData({
        amount: repayment.amount.toString(),
        repayment_date: repayment.repayment_date.split("T")[0],
        note: repayment.note || "",
      });
    }
  }, [repayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayment) return;

    setError("");
    setLoading(true);

    try {
      await apiClient.updateRepayment(repayment.id, {
        amount: parseFloat(formData.amount),
        repayment_date: formData.repayment_date,
        note: formData.note || undefined,
      });

      onRepaymentUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update repayment"
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

  if (!repayment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Repayment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Loan Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Borrower:</span>
              <p className="font-medium">{repayment.borrower_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Loan Amount:</span>
              <p className="font-medium">
                ₹{repayment.loan_amount?.toLocaleString()}
              </p>
            </div>
          </div>
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
            placeholder="Add any notes about this payment"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Update Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
