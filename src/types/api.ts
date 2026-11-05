export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiError {
  error?: string;
  error_description?: string;
  message?: string;
}

export interface Drug {
  id: string;
  name: string;
  registration_number?: string;
  active_ingredient?: string; // nếu API có trả
  // có thể bổ sung thêm field sau khi xem response thực tế
}

export interface PaginatedResponse<T> {
  page: number;
  total: number;
  data: T[];
}

export interface Manufacturer {
  id?: string;
  name?: string;
  country?: string;
}

export interface StockInItem {
  drug_id: string;
  unit_id: string;
  quantity: number;
  batch_no: string;
  expiry_date: string; // YYYY-MM-DD
  manufacturer?: Manufacturer;
  gtin?: string;
  price: number;
}

export interface StockInPayload {
  transaction_date: string; // ISO datetime
  reason: string;
  reference_number: string;
  note?: string;
  items: StockInItem[];
}

export interface StockInResponse {
  transaction_id: string;
  status: string;
}

export interface TransactionStatus {
  transaction_id: string;
  status: string;
  messages?: string[];
  submitted_at?: string;
}
