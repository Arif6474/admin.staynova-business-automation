import { apiClient } from '../api.client.js';
import { ApiResponse } from '../../common/types/index.js';

export interface EmployeeData {
  _id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  employmentType: string;
  status: string;
  hourlyRate?: number;
  monthlySalary?: number;
  documents?: Array<{
    _id: string;
    documentType: string;
    documentNumber?: string;
    fileUrl: string;
    expiryDate?: string;
    status: string;
  }>;
  skills?: Array<{
    _id: string;
    skillName: string;
    proficiencyLevel: string;
  }>;
  createdAt: string;
}

export const employeeApiService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<ApiResponse<EmployeeData[]>>('/employees', { params });
    return response.data;
  },

  getById: async (id: string): Promise<EmployeeData> => {
    const response = await apiClient.get<ApiResponse<EmployeeData>>(`/employees/${id}`);
    return response.data.data;
  },

  create: async (payload: Partial<EmployeeData>): Promise<EmployeeData> => {
    const response = await apiClient.post<ApiResponse<EmployeeData>>('/employees', payload);
    return response.data.data;
  },

  update: async (id: string, payload: Partial<EmployeeData>): Promise<EmployeeData> => {
    const response = await apiClient.patch<ApiResponse<EmployeeData>>(`/employees/${id}`, payload);
    return response.data.data;
  },

  getExpiringDocuments: async (days = 30) => {
    const response = await apiClient.get<ApiResponse<unknown[]>>('/employees/compliance/expiring-documents', {
      params: { days },
    });
    return response.data.data;
  },
};
