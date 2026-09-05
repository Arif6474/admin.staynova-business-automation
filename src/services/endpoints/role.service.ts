import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface RoleData {
  _id: string;
  name: string;
  permissions: Array<{
    module: string;
    actions: string[];
  }>;
  isSystemRole: boolean;
  createdAt: string;
}

export const roleApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<RoleData[]>>('/roles', { params });
    return response.data;
  },
};
