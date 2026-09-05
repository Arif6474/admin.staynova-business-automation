import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface PayrollRunData {
  _id: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  runDate?: string;
  totalGrossPay?: number;
  totalDeductions?: number;
  totalNetPay?: number;
  totalEmployees?: number;
  createdAt: string;
}

export const payrollApiService = {
  getRuns: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<PayrollRunData[]>>('/payroll/runs', { params });
    return response.data;
  },

  getRunById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ run: PayrollRunData; items: unknown[] }>>(`/payroll/runs/${id}`);
    return response.data.data;
  },

  createDraft: async (payload: { periodStart: string; periodEnd: string }): Promise<PayrollRunData> => {
    const response = await apiClient.post<ApiResponse<PayrollRunData>>('/payroll/runs', payload);
    return response.data.data;
  },

  finalize: async (id: string): Promise<PayrollRunData> => {
    const response = await apiClient.post<ApiResponse<PayrollRunData>>(`/payroll/runs/${id}/finalize`);
    return response.data.data;
  },
};
