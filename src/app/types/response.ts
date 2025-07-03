export interface ErrorResponse {
  success: false;
  message: string;
  error: any;
}

export interface ApiResponse<T = any> {
  success: true;
  message: string;
  data: T | null;
}

export interface QueryParams {
  filter?: string;
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
}
