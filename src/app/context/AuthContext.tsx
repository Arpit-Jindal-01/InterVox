/**
 * Authentication Context
 * Provides global auth state and methods to all components
 */
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { AuthService } from "../services/authService";

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  profile_picture_url?: string;
  target_role?: string;
  experience_level?: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  completeExternalLogin: (token: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("authToken");
        if (savedToken) {
          setToken(savedToken);
          try {
            const profile = await AuthService.getCurrentUser(savedToken);
            setUser(profile);
          } catch (profileErr) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Failed to fetch profile:", profileErr);
            }
            // Token is invalid, clear it
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
          }
        } else {
          // No saved token, just return
          setLoading(false);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Auth initialization error:", err);
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ email, password });
      const newToken = response.access_token;
      setToken(newToken);
      localStorage.setItem("authToken", newToken);

      // Fetch user profile
      const profile = await AuthService.getCurrentUser(newToken);
      setUser(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeExternalLogin = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);

    try {
      setToken(accessToken);
      localStorage.setItem("authToken", accessToken);

      const profile = await AuthService.getCurrentUser(accessToken);
      setUser(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register({
        email,
        password,
        full_name: fullName,
        phone,
      });
      const newToken = response.access_token;
      setToken(newToken);
      localStorage.setItem("authToken", newToken);

      // Fetch user profile
      const profile = await AuthService.getCurrentUser(newToken);
      setUser(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Logout error:", err);
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const updatedUser = await AuthService.updateProfile(token, updates);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Profile update failed";
      setError(errorMessage);
      throw err;
    }
  }, [token]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    error,
    login,
    completeExternalLogin,
    register,
    logout,
    clearError,
    updateProfile,
  }), [user, token, loading, error, login, completeExternalLogin, register, logout, clearError, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
