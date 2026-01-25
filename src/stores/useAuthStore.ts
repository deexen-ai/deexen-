import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type User } from '@/services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => void;
    clearError: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            initialize: () => {
                // Persist handles rehydration
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });

                try {
                    const { user, token } = await authService.login(email, password);

                    // LocalStorage handled by persist middleware
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: unknown) {
                    const message = error && typeof error === 'object' && 'message' in error
                        ? (error as { message: string }).message
                        : 'Login failed';
                    set({ error: message, isLoading: false });
                    throw error;
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true, error: null });

                try {
                    const { user, token } = await authService.register({ name, email, password });

                    // LocalStorage handled by persist middleware
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: unknown) {
                    const message = error && typeof error === 'object' && 'message' in error
                        ? (error as { message: string }).message
                        : 'Registration failed';
                    set({ error: message, isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                authService.logout();
                set({ user: null, token: null, isAuthenticated: false, error: null });
            },

            updateUser: (updates) => {
                set((state) => {
                    if (!state.user) return state;
                    const updatedUser = { ...state.user, ...updates };
                    return { user: updatedUser };
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'deexen-auth-storage', // unique name
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }), // only persist these fields
        }
    )
);
