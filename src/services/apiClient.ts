// Central API Client for Deexen
// This handles all HTTP requests with authentication, error handling, and retry logic

interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

class ApiClient {
    private baseUrl: string;
    private useMock: boolean;

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        // Default to mock mode unless explicitly set to 'false'
        const mockEnv = import.meta.env.VITE_USE_MOCK;
        this.useMock = mockEnv !== 'false';
    }

    private getToken(): string | null {
        return localStorage.getItem('deexen_token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error: ApiError = {
                message: 'Request failed',
                status: response.status,
            };

            try {
                const errorData = await response.json();
                error.message = errorData.message || errorData.error || 'Unknown error';
                error.code = errorData.code;
            } catch {
                // Could not parse error response
            }

            // Handle specific status codes
            if (response.status === 401) {
                // Token expired or invalid - clear auth
                localStorage.removeItem('deexen_token');
                localStorage.removeItem('deexen_user');
                window.location.href = '/login';
            }

            throw error;
        }

        return response.json();
    }

    isMockMode(): boolean {
        return this.useMock;
    }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
