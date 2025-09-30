export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Borrower {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  total_borrowed: number;
  total_repaid: number;
  balance: number;
}

export interface Loan {
  id: number;
  borrower_id: number;
  amount: number;
  loan_date: string;
  description?: string;
  created_at: string;
  borrower_name?: string;
}

export interface Repayment {
  id: number;
  loan_id: number;
  amount: number;
  repayment_date: string;
  note?: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}