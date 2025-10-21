// frontend/src/hooks/useAuth.ts
import { useState, useMemo, useCallback } from 'react';

const JWT_KEY = 'mini_ai_studio_jwt';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(JWT_KEY));

  // Function to save the token and update state
  const login = useCallback((newToken: string) => {
    localStorage.setItem(JWT_KEY, newToken);
    setToken(newToken);
  }, []);

  // Function to remove the token and update state
  const logout = useCallback(() => {
    localStorage.removeItem(JWT_KEY);
    setToken(null);
  }, []);

  // Memoized value for the hook, includes login/logout functions and the current token
  const auth = useMemo(() => ({
    token,
    isLoggedIn: !!token,
    login,
    logout,
  }), [token, login, logout]);

  return auth;
};