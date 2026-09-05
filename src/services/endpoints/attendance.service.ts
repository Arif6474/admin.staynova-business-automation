import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface AttendanceData {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
  };
  scheduleId: string;
  checkIn: {
    time: string;
    lat?: number;
    lng?: number;
    address?: string;
  };
  checkOut?: {
    time: string;
    lat?: number;
    lng?: number;
    address?: string;
  };
  hoursWorked: number;
  status: string;
  createdAt: string;
}

export const attendanceApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<AttendanceData[]>>('/attendance', { params });
    return response.data;
  },

  verify: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<AttendanceData>>(`/attendance/${id}/verify`);
    return response.data.data;
  },
};
