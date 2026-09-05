import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface ClientData {
  _id: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  billingTerms: string;
  status: string;
  contracts?: Array<{
    _id: string;
    contractNumber?: string;
    startDate: string;
    endDate?: string;
    terms?: string;
    status: string;
  }>;
  rateCards?: Array<{
    _id: string;
    position: string;
    hourlyRate: number;
    overtimeRate?: number;
    currency: string;
    effectiveFrom: string;
    effectiveTo?: string | null;
  }>;
  createdAt: string;
}

export const clientApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<ClientData[]>>('/clients', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ClientData> => {
    const response = await apiClient.get<ApiResponse<ClientData>>(`/clients/${id}`);
    return response.data.data;
  },

  create: async (payload: Partial<ClientData>): Promise<ClientData> => {
    const response = await apiClient.post<ApiResponse<ClientData>>('/clients', payload);
    return response.data.data;
  },
};
