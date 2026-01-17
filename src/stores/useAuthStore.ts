import { create } from 'zustand';
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

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    initialize: () => {
        const token = localStorage.getItem('deexen_token');
        const userStr = localStorage.getItem('deexen_user');
        if (token && userStr) {
            set({
                token,
                user: JSON.parse(userStr),
                isAuthenticated: true,
            });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const { user, token } = await authService.login(email, password);

            // Persist to localStorage
            localStorage.setItem('deexen_token', token);
            localStorage.setItem('deexen_user', JSON.stringify(user));

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

            // Persist to localStorage
            localStorage.setItem('deexen_token', token);
            localStorage.setItem('deexen_user', JSON.stringify(user));

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
            localStorage.setItem('deexen_user', JSON.stringify(updatedUser));
            return { user: updatedUser };
        });
    },

    clearError: () => set({ error: null }),
}));
