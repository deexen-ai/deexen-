import React, { useState, useEffect } from 'react';
import { FileCode, Search, GitBranch, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import FileExplorer from '@/components/file-explorer/FileExplorer';
import CodeEditor from '@/components/editor/CodeEditor';
import Terminal from '@/components/terminal/Terminal';
import AIPanel from '@/components/ai-panel/AIPanel';

// Activity Bar Component
const ActivityBar = ({ activeView, setActiveView }: { activeView: string, setActiveView: (v: string) => void }) => {
    const icons = [
        { id: 'explorer', icon: FileCode, label: 'Explorer' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'git', icon: GitBranch, label: 'Source Control' },
        { id: 'ai', icon: Sparkles, label: 'AI Assistant' },
    ];

    return (
        <div className="w-12 bg-[var(--bg-canvas)] border-r border-[var(--border-default)] flex flex-col items-center py-2 flex-shrink-0">
            {icons.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    title={item.label}
                    className={cn(
                        "w-10 h-10 flex items-center justify-center relative transition-colors",
                        activeView === item.id
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                >
                    {activeView === item.id && (
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-orange-500" />
                    )}
                    <item.icon className="w-5 h-5" />
                </button>
            ))}

            <div className="flex-1" />

            <button
                title="Settings"
                className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
    );
};

export default function WorkspacePage() {
    const navigate = useNavigate();
    const [activeSidebarView, setActiveSidebarView] = useState('explorer');
    const [leftPanelWidth, setLeftPanelWidth] = useState(240);
    const [rightPanelWidth, setRightPanelWidth] = useState(320);
    const [terminalHeight, setTerminalHeight] = useState(200);
    const [isDragging, setIsDragging] = useState<'left' | 'right' | 'terminal' | null>(null);
    const [showRightPanel, setShowRightPanel] = useState(true);

    useEffect(() => {
        if (activeSidebarView === 'ai') {
            setShowRightPanel(true);
        }
    }, [activeSidebarView]);

    const startResize = (direction: 'left' | 'right' | 'terminal') => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(direction);
    };

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging === 'left') {
                const newWidth = e.clientX - 48;
                if (newWidth > 150 && newWidth < 400) setLeftPanelWidth(newWidth);
            } else if (isDragging === 'right') {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 200 && newWidth < 500) setRightPanelWidth(newWidth);
            } else if (isDragging === 'terminal') {
                const newHeight = window.innerHeight - e.clientY - 22;
                if (newHeight > 100 && newHeight < window.innerHeight - 200) setTerminalHeight(newHeight);
            }
        };

        const onMouseUp = () => setIsDragging(null);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging]);

    return (
        <div className={cn(
            "h-screen w-screen flex flex-col bg-[var(--bg-canvas)] overflow-hidden text-[var(--text-primary)] font-sans",
            isDragging && "cursor-grabbing select-none"
        )}>
            {/* Title Bar */}
            <div className="h-8 bg-[var(--bg-canvas)] border-b border-[var(--border-default)] flex items-center px-3 text-xs select-none">
                <div
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/dashboard')}
                >
                    <img src="/deexenlogo.png" alt="Deexen" className="h-4" />
                    <span className="text-[var(--text-secondary)]">Deexen</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-[var(--text-primary)]">deexen-frontend</span>
                    <span className="text-[var(--text-secondary)] mx-2">—</span>
                    <span className="text-[var(--text-secondary)]">src/App.tsx</span>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Activity Bar */}
                <ActivityBar activeView={activeSidebarView} setActiveView={setActiveSidebarView} />

                {/* Left Sidebar */}
                <div
                    style={{ width: leftPanelWidth }}
                    className="flex-shrink-0 flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-default)] relative"
                >
                    {/* Sidebar Header */}
                    <div className="h-9 flex items-center px-4 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">
                        {activeSidebarView === 'explorer' && 'Explorer'}
                        {activeSidebarView === 'search' && 'Search'}
                        {activeSidebarView === 'git' && 'Source Control'}
                        {activeSidebarView === 'ai' && 'AI Assistant'}
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-auto">
                        {activeSidebarView === 'explorer' && <FileExplorer />}
                        {activeSidebarView === 'search' && (
                            <div className="p-3">
                                <input
                                    className="w-full h-8 px-3 bg-[var(--bg-surface-hover)] border border-[var(--border-default)] rounded text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-orange-500"
                                    placeholder="Search..."
                                />
                            </div>
                        )}
                        {activeSidebarView === 'git' && (
                            <div className="p-4 text-sm text-[var(--text-secondary)] flex flex-col items-center justify-center h-full">
                                <GitBranch className="w-8 h-8 mb-2 opacity-30" />
                                <span>No changes</span>
                            </div>
                        )}
                        {activeSidebarView === 'ai' && (
                            <div className="p-4 text-sm text-[var(--text-secondary)] flex flex-col items-center justify-center h-full">
                                <Sparkles className="w-8 h-8 mb-2 opacity-30" />
                                <span>AI panel on right →</span>
                            </div>
                        )}
                    </div>

                    {/* Resize Handle */}
                    <div
                        className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-orange-500/50 transition-colors"
                        onMouseDown={startResize('left')}
                    />
                </div>

                {/* Center Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Editor */}
                    <div className="flex-1 min-h-0 bg-[var(--bg-canvas)]">
                        <CodeEditor />
                    </div>

                    {/* Terminal Resize Handle */}
                    <div
                        className="h-1 bg-[var(--bg-surface)] cursor-row-resize hover:bg-orange-500/50 transition-colors"
                        onMouseDown={startResize('terminal')}
                    />

                    {/* Terminal */}
                    <div style={{ height: terminalHeight }} className="flex-shrink-0 bg-[var(--bg-canvas)] border-t border-[var(--border-default)]">
                        <Terminal />
                    </div>
                </div>

                {/* Right Panel (AI) */}
                {showRightPanel && (
                    <>
                        <div
                            className="w-1 bg-[var(--bg-surface)] cursor-col-resize hover:bg-orange-500/50 transition-colors flex-shrink-0"
                            onMouseDown={startResize('right')}
                        />
                        <div style={{ width: rightPanelWidth }} className="flex-shrink-0 bg-[var(--bg-surface)] border-l border-[var(--border-default)]">
                            <AIPanel />
                        </div>
                    </>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-[22px] bg-[#007acc] border-t border-[var(--border-default)] flex items-center px-3 text-[11px] text-white justify-between select-none">
                <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                        <GitBranch className="w-3 h-3 mr-1" />
                        main
                    </span>
                    <span>0 errors</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span>Ln 42, Col 18</span>
                    <span>UTF-8</span>
                    <span>TypeScript React</span>
                    <span className="text-orange-500">● AI Active</span>
                </div>
            </div>
        </div>
    );
}
