import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthTokens } from '../common/types/index.js';
import { STORAGE_KEYS } from '../config/constants.js';
import { authApiService } from '../services/endpoints/auth.service.js';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: UserProfile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const normalizeUser = (data: unknown): UserProfile | null => {
  if (!data || typeof data !== 'object') return null;
  const raw = data as Record<string, unknown>;
  const roleObj = raw.roleId as { name?: string; permissions?: unknown[] } | undefined;
  const orgObj = raw.organizationId as { _id?: string; name?: string } | undefined;

  return {
    id: (raw.id || raw._id || '') as string,
    fullName: (raw.fullName || '') as string,
    email: (raw.email || '') as string,
    role: (raw.role || roleObj?.name || 'Super Admin') as string,
    permissions: (raw.permissions || roleObj?.permissions || []) as Array<{ module: string; actions: string[] }>,
    organization: (raw.organization || {
      id: orgObj?._id || '',
      name: orgObj?.name || '',
    }) as { id: string; name: string },
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!saved) return null;
    try {
      return normalizeUser(JSON.parse(saved));
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          const profile = await authApiService.getProfile();
          const normalized = normalizeUser(profile);
          setUser(normalized);
          if (normalized) {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(normalized));
          }
        } catch {
          // Token invalid/expired
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (tokens: AuthTokens, userData: UserProfile) => {
    const normalized = normalizeUser(userData) || userData;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshProfile = async () => {
    const profile = await authApiService.getProfile();
    const normalized = normalizeUser(profile);
    setUser(normalized);
    if (normalized) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(normalized));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
