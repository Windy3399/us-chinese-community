import { create } from "zustand";

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

interface AuthState {
  user: UserPublic | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  
  setHydrated: (hydrated: boolean) => void;
  setUser: (user: UserPublic | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isHydrated: false,

  setHydrated: (hydrated) => set({ isHydrated: hydrated }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearAuth: () => set({ user: null, error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || "登录失败", isLoading: false });
        return false;
      }

      set({ user: data.data, isLoading: false, error: null });
      return true;
    } catch (err) {
      set({ error: "网络错误，请稍后重试", isLoading: false });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.error || "注册失败", isLoading: false });
        return false;
      }

      set({ user: data.data, isLoading: false, error: null });
      return true;
    } catch (err) {
      set({ error: "网络错误，请稍后重试", isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({ user: null, isLoading: false, error: null });
    }
  },

  fetchUser: async () => {
    if (!get().isHydrated) return;
    
    set({ isLoading: true });
    
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data.data, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isLoading: false });
    }
  },
}));
