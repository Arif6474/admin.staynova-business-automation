import { apiClient } from '../api.client.js';
import { ApiResponse, ExecutiveDashboardData } from '../../common/types/index.js';

export const dashboardApiService = {
  getExecutiveMetrics: async (): Promise<ExecutiveDashboardData> => {
    const response = await apiClient.get<ApiResponse<ExecutiveDashboardData>>('/dashboard/metrics');
    return response.data.data;
  },
};
