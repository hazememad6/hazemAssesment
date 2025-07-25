import { useAuthStore } from "../authStore";

export const useAuth = () => {
  const isAuthenticated = useAuthStore((s) => !!s.creds);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  return { isAuthenticated, loading, login, logout };
};
