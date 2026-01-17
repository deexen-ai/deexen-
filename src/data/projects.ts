export interface Project {
    id: string;
    name: string;
    description: string;
    files: number;
    lastModified: string;
    language: string;
    starred: boolean;
    // Enhanced Data
    fullDescription?: string;
    techStack?: string[];
    features?: string[];
    architecture?: string;
    fileStructure?: string; // Kept in data for reference, but not rendered by default
}

export const projects: Project[] = [
    {
        id: '1',
        name: 'deexen-frontend',
        description: 'Main frontend repository for Deexen IDE',
        files: 24,
        lastModified: '2h ago',
        language: 'TypeScript',
        starred: true,
        fullDescription: 'The `deexen-frontend` is the core client-side application for the Deexen cloud-based IDE. It provides a rich, VS Code-like coding experience directly in the browser.',
        features: [
            'Monaco Editor Integration (Syntax Highlighting, IntelliSense)',
            'Virtual File System Abstraction',
            'Plugin Architecture for Extensions',
            'Responsive Dashboard UI',
            'Real-time Collaboration (Planned)'
        ],
        techStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Monaco Editor', 'Lucide React'],
        architecture: 'Client-Side Rendering (CSR) with a feature-based folder structure. State management is handled globally by Zustand stores.',
        fileStructure: '/src\n  /components\n    /editor\n    /file-tree\n    /ui\n  /hooks\n  /pages\n  /stores\n  /utils'
    },
    {
        id: '2',
        name: 'swapcampus',
        description: 'University marketplace platform',
        files: 156,
        lastModified: '1d ago',
        language: 'React',
        starred: false,
        fullDescription: '`swapcampus` is a peer-to-peer marketplace designed specifically for university students to buy, sell, and swap textbooks, electronics, and dorm essentials.',
        features: [
            'Safe Meeting Point Suggestions',
            'Verified Student Email Integration',
            'Real-time Chat',
            'Geolocation-based Search'
        ],
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
        architecture: 'MERN Stack application. Frontend interacts with a REST API.',
        fileStructure: '/client\n/server\n/shared'
    },
    {
        id: '3',
        name: 'haven',
        description: 'Personal wellness tracker',
        files: 43,
        lastModified: '5d ago',
        language: 'Python',
        starred: true,
        fullDescription: '`haven` is a holistic wellness tracking application that combines mood tracking, habit formation, and meditation logging into a single privacy-focused app.',
        features: [
            'Daily Mood Logging',
            'Habit Streak Tracking',
            'Meditation Timer',
            'Data Privacy (Local Storage)'
        ],
        techStack: ['Python', 'Django', 'PostgreSQL', 'htmx'],
        architecture: 'Server-side rendered Django application with htmx for dynamic interactions.',
        fileStructure: '/haven_app\n  /moods\n  /habits\n/templates\n/static'
    },
    {
        id: '4',
        name: 'api-gateway',
        description: 'Microservices API gateway',
        files: 18,
        lastModified: '1w ago',
        language: 'Go',
        starred: false,
        fullDescription: 'A high-performance API Gateway written in Go. It handles request routing, rate limiting, and authentication for the underlying microservices infrastructure.',
        features: [
            'Request Routing',
            'Rate Limiting',
            'JWT Authentication',
            'Service Discovery'
        ],
        techStack: ['Go', 'Gin', 'Redis', 'Docker'],
        architecture: 'Event-driven proxy leveraging Go routines for concurrency.',
        fileStructure: '/cmd\n/pkg\n  /middleware\n  /router\n/config'
    },
];
