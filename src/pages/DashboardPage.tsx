import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderOpen, Plus,
    Search, Star, MoreHorizontal,
    ExternalLink, Sparkles
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAIStore } from '@/stores/useAIStore'; // Import AI Store

import { projects } from '@/data/projects';

import Header from '@/components/layout/Header';
import AiAssistant from '@/components/AiAssistant/AiAssistant';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { setChatOpen, setTriggerMessage } = useAIStore(); // Use hooks
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenWorkspace = () => {
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
        <div className="min-h-screen w-full bg-[#0a0a0a] font-sans text-white">
            <Header />

            {/* Main */}
            <div className="max-w-4xl mx-auto py-8 px-6">
                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-lg font-medium">Projects</h1>
                    <p className="text-sm text-neutral-500">Select a project to open in the editor</p>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 h-8 pl-9 pr-3 bg-[#141414] border border-neutral-800 rounded text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors"
                        />
                    </div>
                    <button className="flex items-center space-x-1.5 h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Projects List */}
                <div className="border border-neutral-800 rounded overflow-hidden">
                    {/* Header */}
                    <div className="h-9 bg-[#0f0f0f] border-b border-neutral-800 flex items-center px-4 text-xs text-neutral-500">
                        <div className="flex-1">Name</div>
                        <div className="w-24 text-center">Files</div>
                        <div className="w-24 text-center">Updated</div>
                        <div className="w-28 pl-4">Actions</div>
                    </div>

                    {/* Rows */}
                    {filteredProjects.map((project, i) => (
                        <div
                            key={project.id}
                            onClick={() => handleOpenWorkspace()}
                            className={cn(
                                "h-14 flex items-center px-4 cursor-pointer transition-colors group",
                                "hover:bg-[#141414]",
                                i !== filteredProjects.length - 1 && "border-b border-neutral-800/50"
                            )}
                        >
                            <div className="flex-1 flex items-center space-x-3 min-w-0">
                                <div className="w-8 h-8 bg-neutral-800 rounded-sm flex items-center justify-center flex-shrink-0">
                                    <FolderOpen className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-white truncate">{project.name}</span>
                                        {project.starred && (
                                            <Star className="w-3 h-3 text-orange-500 fill-orange-500 flex-shrink-0" />
                                        )}
                                        <span className="text-xs px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded flex-shrink-0">
                                            {project.language}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 truncate">{project.description}</p>
                                </div>
                            </div>
                            <div className="w-24 text-center text-sm text-neutral-500">
                                {project.files}
                            </div>
                            <div className="w-24 text-center text-sm text-neutral-500">
                                {project.lastModified}
                            </div>
                            <div className="w-28 flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleExplainProject(project.name, e)}
                                    title="Explain Project with AI"
                                    className="p-1.5 text-neutral-500 hover:text-violet-400 hover:bg-neutral-700/50 rounded transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="h-32 flex items-center justify-center text-sm text-neutral-500">
                            No projects found
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-600">
                    <span>{projects.length} projects</span>
                </div>
            </div>
            <AiAssistant />
        </div>
    );
}
