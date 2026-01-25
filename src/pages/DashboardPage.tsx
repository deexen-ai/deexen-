import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderOpen, Plus,
    Search, Star, MoreHorizontal,
    ExternalLink, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAIStore } from '@/stores/useAIStore';
import { useFileStore } from '@/stores/useFileStore';

import { projects } from '@/data/projects';

import Header from '@/components/layout/Header';
import AiAssistant from '@/components/AiAssistant/AiAssistant';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { setChatOpen, setTriggerMessage } = useAIStore();
    const { setProjectName } = useFileStore();
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenWorkspace = (name: string) => {
        setProjectName(name);
        navigate('/workspace');
    };

    const handleExplainProject = (projectName: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening workspace
        setTriggerMessage(`Explain ${projectName}`);
        setChatOpen(true);
        // We rely on AiAssistant to detect the open state change or trigger change
    };

    if (!user) return null;

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[var(--bg-canvas)] font-sans text-[var(--text-primary)] transition-colors duration-200">
            <Header />

            {/* Main */}
            <div className="max-w-4xl mx-auto py-8 px-6">
                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-lg font-medium">Projects</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Select a project to open in the editor</p>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 h-8 pl-9 pr-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-neutral-500 transition-colors"
                        />
                    </div>
                    <button className="flex items-center space-x-1.5 h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Projects List */}
                <div className="border border-[var(--border-default)] rounded overflow-hidden">
                    {/* Header */}
                    <div className="h-9 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex items-center px-4 text-xs text-[var(--text-secondary)]">
                        <div className="flex-1">Name</div>
                        <div className="w-24 text-center">Files</div>
                        <div className="w-24 text-center">Updated</div>
                        <div className="w-28 pl-4">Actions</div>
                    </div>

                    {/* Rows */}
                    {filteredProjects.map((project, i) => (
                        <div
                            key={project.id}
                            onClick={() => handleOpenWorkspace(project.name)}
                            className={cn(
                                "h-14 flex items-center px-4 cursor-pointer transition-colors group",
                                "hover:bg-[var(--bg-surface-hover)]",
                                i !== filteredProjects.length - 1 && "border-b border-[var(--border-default)]"
                            )}
                        >
                            <div className="flex-1 flex items-center space-x-3 min-w-0">
                                <div className="w-8 h-8 bg-[var(--bg-surface-hover)] rounded-sm flex items-center justify-center flex-shrink-0">
                                    <FolderOpen className="w-4 h-4 text-[var(--text-secondary)]" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-[var(--text-primary)] truncate">{project.name}</span>
                                        {project.starred && (
                                            <Star className="w-3 h-3 text-orange-500 fill-orange-500 flex-shrink-0" />
                                        )}
                                        <span className="text-xs px-1.5 py-0.5 bg-[var(--bg-surface)] text-[var(--text-secondary)] rounded flex-shrink-0">
                                            {project.language}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] truncate">{project.description}</p>
                                </div>
                            </div>
                            <div className="w-24 text-center text-sm text-[var(--text-secondary)]">
                                {project.files}
                            </div>
                            <div className="w-24 text-center text-sm text-[var(--text-secondary)]">
                                {project.lastModified}
                            </div>
                            <div className="w-28 flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleExplainProject(project.name, e)}
                                    title="Explain Project with AI"
                                    className="p-1.5 text-[var(--text-secondary)] hover:text-violet-400 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                                >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="h-32 flex items-center justify-center text-sm text-[var(--text-secondary)]">
                            No projects found
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
                </div>
            </div>
            <AiAssistant />
        </div>
    );
}
