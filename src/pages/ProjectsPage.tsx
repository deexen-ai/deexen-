import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search,
    GitBranch, Settings
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFileStore } from '@/stores/useFileStore';

import { projects } from '@/data/projects';
import Sidebar from '@/components/layout/Sidebar';
import AiAssistant from '@/components/AiAssistant/AiAssistant';

// Mock Commit Hash generator
const getShortHash = () => Math.random().toString(36).substring(2, 9);

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { setProjectName } = useFileStore();
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleOpenWorkspace = (name: string) => {
        setProjectName(name);
        navigate('/workspace');
    };

    const getLanguageColor = (lang: string) => {
        const colors: Record<string, string> = {
            'React': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            'TypeScript': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            'Python': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
            'JavaScript': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
            'Vue': 'text-green-400 bg-green-500/10 border-green-500/20',
            'Rust': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
            'Go': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        };
        return colors[lang] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    };

    if (!user) return null;

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen w-full bg-[var(--bg-main)] font-sans text-[var(--text-primary)] overflow-hidden">
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Canvas */}
            <main className="flex-1 ml-64 h-full overflow-y-auto overflow-x-hidden relative">

                {/* Sticky Header */}
                <header className="sticky top-0 z-40 w-full h-16 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-default)] flex items-center justify-between px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">deexen</span>
                        <span className="text-[var(--text-tertiary)]">/</span>
                        <span className="text-[var(--text-primary)] font-medium cursor-pointer">projects</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--text-secondary)] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                ref={searchInputRef}
                                className="w-64 h-9 pl-9 pr-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                        </div>
                        <button className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-1">All Projects</h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-6">Manage your workspaces and deployments.</p>

                        <div className="grid gap-3">
                            {filteredProjects.map((project) => {
                                // Generate mock status for visuals
                                const status = Math.random() > 0.8 ? 'building' : 'live';
                                const env = 'Production';

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() => handleOpenWorkspace(project.name)}
                                        className="group relative flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-default)] transition-all cursor-pointer"
                                    >
                                        {/* Left: Info */}
                                        <div className="flex items-center gap-5">
                                            {/* Icon */}
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-900 border border-[var(--border-default)] flex items-center justify-center shadow-inner">
                                                <span className="text-[var(--text-secondary)] font-bold text-lg">{project.name.charAt(0).toUpperCase()}</span>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-[15px] font-medium text-[var(--text-primary)] transition-colors">
                                                        {project.name}
                                                    </h3>
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[10px] text-[var(--text-secondary)] font-medium">
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", status === 'live' ? "bg-green-500 animate-pulse" : "bg-yellow-500")} />
                                                        {env}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-secondary)]">
                                                    <span className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
                                                        <GitBranch className="w-3 h-3" />
                                                        main
                                                    </span>
                                                    <span className="text-[var(--text-tertiary)]">•</span>
                                                    <span className="font-mono">{getShortHash()}</span>
                                                    <span className="text-[var(--text-tertiary)]">•</span>
                                                    <span>{project.lastModified}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions & Tech */}
                                        <div className="flex items-center gap-6">
                                            {/* Tech Pill */}
                                            <div className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-medium border hidden sm:block",
                                                getLanguageColor(project.language)
                                            )}>
                                                {project.language}
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                                                <button className="h-8 px-3 rounded-md bg-gray-900 dark:bg-zinc-100 text-white dark:text-black text-xs font-medium hover:bg-black dark:hover:bg-white shadow transition-colors">
                                                    Launch
                                                </button>
                                                <button className="p-2 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <AiAssistant />
        </div>
    );
}
