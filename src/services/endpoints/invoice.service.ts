import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  clientId: {
    _id: string;
    companyName: string;
  };
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  amountPaid: number;
  status: string;
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  createdAt: string;
}

export const invoiceApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<InvoiceData[]>>('/invoices', { params });
    return response.data;
  },

  getById: async (id: string): Promise<InvoiceData> => {
    const response = await apiClient.get<ApiResponse<InvoiceData>>(`/invoices/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string): Promise<InvoiceData> => {
    const response = await apiClient.patch<ApiResponse<InvoiceData>>(`/invoices/${id}/status`, { status });
    return response.data.data;
  },
};
