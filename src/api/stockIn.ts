import axiosClient from "./axiosClient";
import type {
  StockInPayload,
  StockInResponse,
  TransactionStatus,
} from "../types/api";

export const createStockInApi = async (
  payload: StockInPayload,
): Promise<StockInResponse> => {
  const response = await axiosClient.post<StockInResponse>(
    "/transactions/stock-in",
    payload,
  );
  return response.data;
};

export const getStockInStatusApi = async (
  transactionId: string,
): Promise<TransactionStatus> => {
  const response = await axiosClient.get<TransactionStatus>(
    `/transactions/stock-in/${transactionId}/status`,
  );
  return response.data;
};

// Optional: lấy chi tiết phiếu
export const getStockInDetailApi = async (transactionId: string) => {
  const response = await axiosClient.get(
    `/transactions/stock-in/${transactionId}`,
  );
  return response.data;
};
