import { AxiosRequestConfig } from "axios";

export interface ApiRequestConfig extends AxiosRequestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: object | FormData;
}

export type TResponse<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type TPaginatedResponse<T> = {
  current_page: number;
  data: T[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};
