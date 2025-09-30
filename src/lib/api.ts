import { User, Borrower, Loan, Repayment, AuthResponse, ApiError } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ApiError).error || 'Something went wrong');
    }

    return data;
  }

  // Auth methods
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Borrower methods
  async getBorrowers(): Promise<Borrower[]> {
    return this.request<Borrower[]>('/borrowers');
  }

  async getBorrower(id: number): Promise<{ borrower: Borrower; loans: Loan[] }> {
    return this.request<{ borrower: Borrower; loans: Loan[] }>(`/borrowers/${id}`);
  }

  async createBorrower(name: string): Promise<Borrower> {
    return this.request<Borrower>('/borrowers', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Loan methods
  async createLoan(loanData: Omit<Loan, 'id' | 'created_at' | 'borrower_name'>): Promise<Loan> {
    return this.request<Loan>('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  async getLoan(id: number): Promise<{ loan: Loan; repayments: Repayment[] }> {
    return this.request<{ loan: Loan; repayments: Repayment[] }>(`/loans/${id}`);
  }

  async updateLoan(id: number, updates: Partial<Loan>): Promise<Loan> {
    return this.request<Loan>(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLoan(id: number): Promise<void> {
    return this.request<void>(`/loans/${id}`, {
      method: 'DELETE',
    });
  }

  // Repayment methods
  async createRepayment(repaymentData: Omit<Repayment, 'id' | 'created_at'>): Promise<Repayment> {
    return this.request<Repayment>('/repayments', {
      method: 'POST',
      body: JSON.stringify(repaymentData),
    });
  }

  async updateRepayment(id: number, updates: Partial<Repayment>): Promise<Repayment> {
    return this.request<Repayment>(`/repayments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRepayment(id: number): Promise<void> {
    return this.request<void>(`/repayments/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();