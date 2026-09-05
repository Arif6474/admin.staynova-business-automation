import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface AuditLogData {
  _id: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
}

export const auditLogApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<AuditLogData[]>>('/audit-logs', { params });
    return response.data;
  },
};
