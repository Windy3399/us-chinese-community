"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { fetchUser, setHydrated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    fetchUser();
    setHydrated(true);
  }, [fetchUser, setHydrated]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

// 导出 useAuth hook
export const useAuth = () => {
  const store = useAuthStore();
  // 向后兼容：同时提供 loading 和 isLoading
  return {
    ...store,
    loading: store.isLoading,
  };
};
