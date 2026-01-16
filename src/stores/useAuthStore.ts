import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email, password) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                set({
                    user: {
                        id: '1',
                        name: 'Demo User',
                        email: email,
                        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=7c3aed&color=fff'
                    },
                    isAuthenticated: true,
                });
                resolve();
            }, 1000);
        });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
}));
