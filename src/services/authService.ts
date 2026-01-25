// Authentication Service
// Handles login, logout, registration, and user data

import { apiClient } from './apiClient';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinDate?: string;
    lastActive?: string;
    projectCount?: number;
    role?: string;
    onboardingCompleted?: boolean;
}



interface LoginResponse {
    user: User;
    token: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

class AuthService {
    // ==========================================
    // REAL API ENDPOINTS (use when backend ready)
    // ==========================================

    async login(email: string, password: string): Promise<LoginResponse> {
        if (apiClient.isMockMode()) {
            return this.mockLogin(email, password);
        }

        return apiClient.post<LoginResponse>('/auth/login', { email, password });
    }

    async register(data: RegisterRequest): Promise<LoginResponse> {
        if (apiClient.isMockMode()) {
            return this.mockRegister(data);
        }

        return apiClient.post<LoginResponse>('/auth/register', data);
    }

    async logout(): Promise<void> {
        if (!apiClient.isMockMode()) {
            try {
                await apiClient.post('/auth/logout');
            } catch {
                // Ignore logout errors
            }
        }

        localStorage.removeItem('deexen_token');
        localStorage.removeItem('deexen_user');
    }

    async getProfile(): Promise<User> {
        if (apiClient.isMockMode()) {
            return this.mockGetProfile();
        }

        return apiClient.get<User>('/auth/profile');
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        if (apiClient.isMockMode()) {
            return this.mockUpdateProfile(data);
        }

        return apiClient.put<User>('/auth/profile', data);
    }

    // ==========================================
    // MOCK IMPLEMENTATIONS (for development)
    // ==========================================

    private async mockLogin(email: string, password: string): Promise<LoginResponse> {
        await this.simulateDelay();

        if (password.length < 6) {
            throw { message: 'Password must be at least 6 characters', code: 'INVALID_PASSWORD' };
        }

        const user: User = {
            id: '1',
            name: 'Demo User',
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=ea580c&color=fff`,
            joinDate: 'Jan 2026',
            lastActive: 'Just now',
            projectCount: 12,
            onboardingCompleted: true,
        };

        const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);

        return { user, token };
    }

    private async mockRegister(data: RegisterRequest): Promise<LoginResponse> {
        await this.simulateDelay();

        if (data.password.length < 6) {
            throw { message: 'Password must be at least 6 characters', code: 'INVALID_PASSWORD' };
        }

        const user: User = {
            id: Math.random().toString(36).substring(2),
            name: data.name,
            email: data.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ea580c&color=fff`,
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            lastActive: 'Just now',
            projectCount: 0,
            onboardingCompleted: true,
        };

        const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);

        return { user, token };
    }

    private async mockGetProfile(): Promise<User> {
        await this.simulateDelay(300);

        const userStr = localStorage.getItem('deexen_user');
        if (!userStr) {
            throw { message: 'Not authenticated', code: 'UNAUTHORIZED', status: 401 };
        }

        return JSON.parse(userStr);
    }

    private async mockUpdateProfile(data: Partial<User>): Promise<User> {
        await this.simulateDelay(500);

        const userStr = localStorage.getItem('deexen_user');
        if (!userStr) {
            throw { message: 'Not authenticated', code: 'UNAUTHORIZED', status: 401 };
        }

        const user = { ...JSON.parse(userStr), ...data };
        localStorage.setItem('deexen_user', JSON.stringify(user));

        return user;
    }

    private simulateDelay(ms: number = 1000): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const authService = new AuthService();
