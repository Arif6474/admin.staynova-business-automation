import { apiClient } from '../api.client.js';
import { ApiResponse, LoginResponse, UserProfile } from '../../common/types/index.js';

export const authApiService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (payload: {
    organizationName: string;
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', payload);
    return response.data.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  },
};
