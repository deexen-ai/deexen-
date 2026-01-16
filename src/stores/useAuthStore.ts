import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    initialize: () => {
        const token = localStorage.getItem('deexen_token');
        const userStr = localStorage.getItem('deexen_user');
        if (token && userStr) {
            set({
                token,
                user: JSON.parse(userStr),
                isAuthenticated: true
            });
        }
    },

    login: async (email, password) => {
        // Mock API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (password.length < 6) {
                    reject(new Error('Password too short (mock backend check)'));
                    return;
                }

                // Mock successful response
                const mockUser = {
                    id: '1',
                    name: 'Demo User',
                    email: email,
                    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=7c3aed&color=fff'
                };
                const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);

                // Persist
                localStorage.setItem('deexen_token', mockToken);
                localStorage.setItem('deexen_user', JSON.stringify(mockUser));

                set({
                    user: mockUser,
                    token: mockToken,
                    isAuthenticated: true,
                });
                resolve();
            }, 1000);
        });
    },

    logout: () => {
        localStorage.removeItem('deexen_token');
        localStorage.removeItem('deexen_user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

