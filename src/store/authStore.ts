import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  setAuth: (accessToken: string, email: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      email: null,
      setAuth: (accessToken: string, email: string) => {
        set({ accessToken, email });
      },
      clearAuth: () => {
        set({ accessToken: null, email: null });
      },
      isAuthenticated: () => {
        return !!get().accessToken;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

