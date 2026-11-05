import axiosClient from "./axiosClient";
import type { Drug, PaginatedResponse } from "../types/api";

export interface GetDrugsParams {
  page?: number;
  page_size?: number;
}

export const getDrugsApi = async (
  params: GetDrugsParams = {},
): Promise<PaginatedResponse<Drug>> => {
  const response = await axiosClient.get<PaginatedResponse<Drug>>(
    "/master/drugs",
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
      },
    },
  );
  return response.data;
};
