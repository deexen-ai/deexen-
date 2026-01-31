import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Terminal,
    GitBranch, Activity, AlertCircle, Settings
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFileStore } from '@/stores/useFileStore';
import { projects } from '@/data/projects';
import Sidebar from '@/components/layout/Sidebar';
import AiAssistant from '@/components/AiAssistant/AiAssistant';

export default function DashboardPage() {
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
                        <span className="text-[var(--text-primary)] font-medium cursor-pointer">dashboard</span>
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
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-canvas)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-tertiary)]">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                        <button className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 max-w-6xl mx-auto space-y-8">

                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                title="Total Projects"
                                value={filteredProjects.length.toString()}
                                icon={Terminal}
                                trend="+2 this week"
                            />
                            <MetricCard
                                title="System Status"
                                value="Healthy"
                                icon={Activity}
                                valueColor="text-green-400"
                                trend="99.9% uptime"
                            />
                            <MetricCard
                                title="Active Alerts"
                                value="0"
                                icon={AlertCircle}
                                trend="All systems normal"
                            />
                        </div>

                        {/* Recent Projects Section */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-medium text-[var(--text-primary)]">Recent Projects</h3>
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition-colors group"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="grid gap-3">
                                {filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onClick={() => handleOpenWorkspace(project.name)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AiAssistant />
        </div>
    );
}

// Metric Card Component
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend: string;
    valueColor?: string;
}

function MetricCard({ title, value, icon: Icon, trend, valueColor = 'text-[var(--text-primary)]' }: MetricCardProps) {
    return (
        <div className="bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] rounded-lg p-5 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide mb-2">
                        {title}
                    </p>
                    <p className={cn("text-2xl font-semibold mb-1", valueColor)}>
                        {value}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs">
                        {trend}
                    </p>
                </div>
                <div className="p-2.5 bg-[var(--bg-canvas)] rounded-lg">
                    <Icon className="w-5 h-5 text-[var(--text-tertiary)]" />
                </div>
            </div>
        </div>
    );
}

// Project Card Component
interface ProjectCardProps {
    project: any;
    onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
    // Generate a mock commit hash
    const commitHash = Math.random().toString(36).substring(2, 9);

    const getLanguageColor = (lang: string) => {
        const colors: Record<string, string> = {
            TypeScript: 'text-blue-500 bg-blue-500/10',
            Python: 'text-yellow-500 bg-yellow-500/10',
            React: 'text-cyan-500 bg-cyan-500/10',
            Go: 'text-teal-500 bg-teal-500/10',
        };
        return colors[lang] || 'text-gray-500 bg-gray-500/10';
    };

    return (
        <div className="bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-default)] hover:border-[var(--border-default)]/80 rounded-lg px-5 py-4 transition-all duration-200 group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
                {/* Project Icon */}
                <div className="w-11 h-11 rounded-lg bg-[#2d3748] dark:bg-[#27272a] flex items-center justify-center flex-shrink-0 shadow-sm border border-[var(--border-default)]">
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                        {project.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <h4
                            onClick={onClick}
                            className="text-sm font-semibold text-[var(--text-primary)] hover:text-orange-600 dark:hover:text-orange-500 transition-colors cursor-pointer"
                        >
                            {project.name}
                        </h4>
                        {project.status === 'Production' && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Production</span>
                            </div>
                        )}
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                            <GitBranch className="w-3 h-3" />
                            <span className="font-medium">{project.branch}</span>
                        </div>
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span className="font-mono text-[var(--text-tertiary)]">{commitHash}</span>
                        <span className="text-[var(--text-tertiary)]">•</span>
                        <span>{project.lastUpdated}</span>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold px-2.5 py-1.5 rounded-md", getLanguageColor(project.language))}>
                        {project.language}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="px-4 py-1.5 bg-[var(--bg-canvas)] hover:bg-white dark:hover:bg-zinc-800 border border-[var(--border-default)] text-[var(--text-primary)] text-xs font-semibold rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm hover:shadow"
                    >
                        Launch
                    </button>
                    <button className="p-2 hover:bg-[var(--bg-canvas)] rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <Settings className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}
