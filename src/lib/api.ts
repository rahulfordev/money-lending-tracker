import {
  User,
  Borrower,
  Loan,
  Repayment,
  AuthResponse,
} from "../types";
import { AxiosFetcher } from "@/apis/configs";
import { ApiRequestConfig } from "@/types/configs";
import Cookies from "js-cookie";
import { COOKIES_KEYS } from "@/configs/constants";

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    Cookies.set(COOKIES_KEYS.AUTH_TOKEN, token);
  }

  removeToken() {
    this.token = null;
    Cookies.remove(COOKIES_KEYS.AUTH_TOKEN);
  }

  private async request<T>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "url">
  ): Promise<T> {
    try {
      const response = await AxiosFetcher({
        url: endpoint,
        ...config,
      });
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || "Something went wrong");
      }
      throw new Error("Network error occurred");
    }
  }

  // Auth methods
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      data: { name, email, password },
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      data: { email, password },
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/change-password", {
      method: "POST",
      data: passwordData,
    });
  }

  async logout(): Promise<void> {
    this.removeToken();
    // Optionally call backend logout endpoint if you have one
    // return this.request<void>('/auth/logout', { method: 'POST' });
  }

  // Borrower methods
  async getBorrowers(): Promise<Borrower[]> {
    return this.request<Borrower[]>("/borrowers");
  }

  async getBorrower(
    id: number
  ): Promise<{ borrower: Borrower; loans: Loan[] }> {
    return this.request<{ borrower: Borrower; loans: Loan[] }>(
      `/borrowers/${id}`
    );
  }

  async createBorrower(name: string): Promise<Borrower> {
    return this.request<Borrower>("/borrowers", {
      method: "POST",
      data: { name },
    });
  }

  async updateBorrower(id: number, name: string): Promise<Borrower> {
    return this.request<Borrower>(`/borrowers/${id}`, {
      method: "PUT",
      data: { name },
    });
  }

  async deleteBorrower(id: number): Promise<void> {
    return this.request<void>(`/borrowers/${id}`, {
      method: "DELETE",
    });
  }

  // Loan methods
  async createLoan(
    loanData: Omit<Loan, "id" | "created_at" | "borrower_name">
  ): Promise<Loan> {
    return this.request<Loan>("/loans", {
      method: "POST",
      data: loanData,
    });
  }

  async getLoan(id: number): Promise<{ loan: Loan; repayments: Repayment[] }> {
    return this.request<{ loan: Loan; repayments: Repayment[] }>(
      `/loans/${id}`
    );
  }

  async updateLoan(id: number, updates: Partial<Loan>): Promise<Loan> {
    return this.request<Loan>(`/loans/${id}`, {
      method: "PUT",
      data: updates,
    });
  }

  async deleteLoan(id: number): Promise<void> {
    return this.request<void>(`/loans/${id}`, {
      method: "DELETE",
    });
  }

  // Repayment methods
  async createRepayment(
    repaymentData: Omit<Repayment, "id" | "created_at">
  ): Promise<Repayment> {
    return this.request<Repayment>("/repayments", {
      method: "POST",
      data: repaymentData,
    });
  }

  async updateRepayment(
    id: number,
    updates: Partial<Repayment>
  ): Promise<Repayment> {
    return this.request<Repayment>(`/repayments/${id}`, {
      method: "PUT",
      data: updates,
    });
  }

  async deleteRepayment(id: number): Promise<void> {
    return this.request<void>(`/repayments/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
