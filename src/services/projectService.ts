// Project Service
// Handles project CRUD operations

import { apiClient } from './apiClient';

export interface Project {
    id: string;
    name: string;
    description: string;
    fileCount: number;
    lastModified: string;
    createdAt: string;
    language?: string;
    isPublic?: boolean;
}

export interface ProjectFile {
    id: string;
    name: string;
    path: string;
    content: string;
    type: 'file' | 'folder';
    children?: ProjectFile[];
}

interface CreateProjectRequest {
    name: string;
    description?: string;
    template?: string;
}

class ProjectService {
    // ==========================================
    // REAL API ENDPOINTS
    // ==========================================

    async listProjects(): Promise<Project[]> {
        if (apiClient.isMockMode()) {
            return this.mockListProjects();
        }

        return apiClient.get<Project[]>('/projects');
    }

    async getProject(id: string): Promise<Project> {
        if (apiClient.isMockMode()) {
            return this.mockGetProject(id);
        }

        return apiClient.get<Project>(`/projects/${id}`);
    }

    async createProject(data: CreateProjectRequest): Promise<Project> {
        if (apiClient.isMockMode()) {
            return this.mockCreateProject(data);
        }

        return apiClient.post<Project>('/projects', data);
    }

    async deleteProject(id: string): Promise<void> {
        if (apiClient.isMockMode()) {
            return this.mockDeleteProject(id);
        }

        await apiClient.delete(`/projects/${id}`);
    }

    async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
        if (apiClient.isMockMode()) {
            return this.mockGetProjectFiles(projectId);
        }

        return apiClient.get<ProjectFile[]>(`/projects/${projectId}/files`);
    }

    async saveFile(projectId: string, fileId: string, content: string): Promise<void> {
        if (apiClient.isMockMode()) {
            return; // No-op in mock mode
        }

        await apiClient.put(`/projects/${projectId}/files/${fileId}`, { content });
    }

    // ==========================================
    // MOCK IMPLEMENTATIONS
    // ==========================================

    private async mockListProjects(): Promise<Project[]> {
        await this.simulateDelay(500);

        return [
            {
                id: 'proj-1',
                name: 'E-commerce API',
                description: 'REST API for online store with payment integration',
                fileCount: 42,
                lastModified: '2 hours ago',
                createdAt: '2026-01-10',
                language: 'TypeScript',
            },
            {
                id: 'proj-2',
                name: 'Chat Application',
                description: 'Real-time chat with WebSocket support',
                fileCount: 28,
                lastModified: 'Yesterday',
                createdAt: '2026-01-05',
                language: 'TypeScript',
            },
            {
                id: 'proj-3',
                name: 'ML Data Pipeline',
                description: 'Data processing pipeline for ML models',
                fileCount: 15,
                lastModified: '3 days ago',
                createdAt: '2025-12-28',
                language: 'Python',
            },
            {
                id: 'proj-4',
                name: 'Portfolio Website',
                description: 'Personal portfolio with blog integration',
                fileCount: 23,
                lastModified: '1 week ago',
                createdAt: '2025-12-15',
                language: 'React',
            },
        ];
    }

    private async mockGetProject(id: string): Promise<Project> {
        await this.simulateDelay(300);

        const projects = await this.mockListProjects();
        const project = projects.find(p => p.id === id);

        if (!project) {
            throw { message: 'Project not found', code: 'NOT_FOUND', status: 404 };
        }

        return project;
    }

    private async mockCreateProject(data: CreateProjectRequest): Promise<Project> {
        await this.simulateDelay(800);

        return {
            id: 'proj-' + Math.random().toString(36).substring(2, 8),
            name: data.name,
            description: data.description || '',
            fileCount: 0,
            lastModified: 'Just now',
            createdAt: new Date().toISOString().split('T')[0],
            language: 'TypeScript',
        };
    }

    private async mockDeleteProject(_id: string): Promise<void> {
        await this.simulateDelay(500);
        // Mock delete - no-op
    }

    private async mockGetProjectFiles(_projectId: string): Promise<ProjectFile[]> {
        await this.simulateDelay(400);

        return [
            {
                id: 'root',
                name: 'deexen-frontend',
                path: '/',
                content: '',
                type: 'folder',
                children: [
                    {
                        id: 'src',
                        name: 'src',
                        path: '/src',
                        content: '',
                        type: 'folder',
                        children: [
                            { id: 'main.tsx', name: 'main.tsx', path: '/src/main.tsx', content: '// Entry point\nimport React from "react";\n', type: 'file' },
                            { id: 'App.tsx', name: 'App.tsx', path: '/src/App.tsx', content: '// App component\nexport default function App() {\n  return <div>Hello</div>;\n}\n', type: 'file' },
                        ],
                    },
                    { id: 'package.json', name: 'package.json', path: '/package.json', content: '{\n  "name": "project"\n}', type: 'file' },
                    { id: 'README.md', name: 'README.md', path: '/README.md', content: '# Project\n\nDescription here.', type: 'file' },
                ],
            },
        ];
    }

    private simulateDelay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const projectService = new ProjectService();
