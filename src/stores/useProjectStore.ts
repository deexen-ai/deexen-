import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Project } from '@/data/projects';

interface ProjectState {
    projects: Project[];
    addProject: (project: Omit<Project, 'id' | 'files' | 'lastModified' | 'starred'>) => void;
    deleteProject: (id: string) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    toggleStar: (id: string) => void;
    setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set) => ({
            projects: [],

            addProject: (newProjectData) => set((state) => {
                const newProject: Project = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...newProjectData,
                    files: 0,
                    lastModified: 'Just now',
                    starred: false,
                    // Default values for optional fields
                    fullDescription: newProjectData.description,
                    techStack: [],
                    features: [],
                    architecture: 'Client-Side',
                    fileStructure: '/src'
                };
                return { projects: [newProject, ...state.projects] };
            }),

            deleteProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id)
            })),

            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? { ...p, ...updates } : p
                )
            })),

            toggleStar: (id) => set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? { ...p, starred: !p.starred } : p
                )
            })),

            setProjects: (projects) => set({ projects }),
        }),
        {
            name: 'deexen-projects',
        }
    )
);
