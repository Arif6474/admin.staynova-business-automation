export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  permissions?: Array<{
    module: string;
    actions: string[];
  }>;
  organization?: {
    id: string;
    name: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface ExecutiveDashboardData {
  workforce: {
    totalEmployees: number;
    activeEmployees: number;
    activeAssignments: number;
    pendingManpowerRequests: number;
    pendingLeaveApprovals: number;
    todayAttendanceBreakdown: Array<{ _id: string; count: number; totalHours: number }>;
  };
  clients: {
    activeClients: number;
  };
  financials: {
    totalBilled: number;
    totalCollected: number;
    outstandingBalance: number;
    overdueInvoices: number;
  };
}
