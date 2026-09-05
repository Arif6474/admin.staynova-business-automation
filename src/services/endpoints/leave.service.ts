import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface LeaveRequestData {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
  };
  leaveTypeId: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: string;
  createdAt: string;
}

export const leaveApiService = {
  getRequests: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<LeaveRequestData[]>>('/leaves/requests', { params });
    return response.data;
  },

  approveOrReject: async (id: string, payload: { status: 'approved' | 'rejected'; rejectionReason?: string }) => {
    const response = await apiClient.patch<ApiResponse<LeaveRequestData>>(`/leaves/requests/${id}/approval`, payload);
    return response.data.data;
  },
};
