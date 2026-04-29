/**
 * Authentication Service
 * Handles API calls to backend auth endpoints
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/api`;

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

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

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  }

  /**
   * Login with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(token: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  }

  /**
   * Update user profile
   */
  static async updateProfile(token: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  }

  /**
   * Logout (client-side token removal)
   */
  static async logout(): Promise<void> {
    // JWT tokens are stateless, so logout is mainly client-side
    // This endpoint exists for API consistency
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout endpoint error:", error);
    }
  }
}
