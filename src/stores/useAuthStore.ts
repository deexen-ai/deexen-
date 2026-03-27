import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type User } from '@/services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
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
            isInitializing: true, // Start as true — we need to check session first
            isLoading: false,
            error: null,

            initialize: () => {
                // Delay slightly to simulate init, then rely on persisted state
                setTimeout(() => {
                    set({ isInitializing: false });
                }, 100);
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });

                try {
                    // Mock login
                    const mockUser: User = {
                        id: 'mock-user-123',
                        name: email.split('@')[0] || 'User',
                        email: email,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email || 'U')}&background=ea580c&color=fff`,
                        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        lastActive: 'Just now',
                        onboardingCompleted: true,
                    };
                    
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    if (password === 'wrong') throw new Error('Invalid credentials');

                    set({
                        user: mockUser,
                        token: 'mock-jwt-token-123',
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
                    if (password.length < 6) throw new Error('Password must be at least 6 characters');
                    // Mock register
                    const mockUser: User = {
                        id: 'mock-user-456',
                        name: name,
                        email: email,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=ea580c&color=fff`,
                        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        lastActive: 'Just now',
                        onboardingCompleted: true,
                    };

                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 800));

                    set({
                        user: mockUser,
                        token: 'mock-jwt-token-456',
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
            name: 'deexen-auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
