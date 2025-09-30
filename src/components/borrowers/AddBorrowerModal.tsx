import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiClient } from '../../lib/api';

interface AddBorrowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBorrowerAdded: () => void;
}

export function AddBorrowerModal({ isOpen, onClose, onBorrowerAdded }: AddBorrowerModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.createBorrower(name);
      setName('');
      onBorrowerAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add borrower');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Borrower">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <Input
          label="Borrower Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter borrower's name"
          autoFocus
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Borrower
          </Button>
        </div>
      </form>
    </Modal>
  );
}