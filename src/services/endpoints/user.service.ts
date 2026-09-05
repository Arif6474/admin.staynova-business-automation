import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface UserAccountData {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  roleId: {
    _id: string;
    name: string;
  };
  status: string;
  lastLoginAt?: string;
  createdAt: string;
}

export const userApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<UserAccountData[]>>('/users', { params });
    return response.data;
  },
};
