import React, { useState, useRef, useEffect } from 'react';
import { FileCode, Bot, Search, GitBranch, Settings, Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import FileExplorer from '@/components/file-explorer/FileExplorer';
import CodeEditor from '@/components/editor/CodeEditor';
import Terminal from '@/components/terminal/Terminal';
import AIPanel from '@/components/ai-panel/AIPanel';

// Menu Bar Component
const MenuBar = () => {
    const handleMenuClick = (menu: string) => {
        alert(`[Mockup] Clicked ${menu} menu`);
    };

    return (
        <div className="h-8 bg-[#f8f9fa] flex items-center px-2 space-x-1 text-xs select-none border-b border-[#e5e7eb]">
            <div className="pl-3 pr-4 font-bold text-[#7c3aed]">
                <Menu className="h-4 w-4" />
            </div>
            {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(menu => (
                <div key={menu} onClick={() => handleMenuClick(menu)} className="px-2 py-1 hover:bg-[#e5e7eb] rounded cursor-pointer text-[#1f2937] transition-colors">
                    {menu}
                </div>
            ))}
        </div>
    );
};

// Activity Bar Component
const ActivityBar = ({ activeView, setActiveView }: { activeView: string, setActiveView: (v: string) => void }) => {
    const icons = [
        { id: 'explorer', icon: FileCode },
        { id: 'search', icon: Search },
        { id: 'git', icon: GitBranch },
        { id: 'debug', icon: Bot }, // Reusing Bot for generic debug feel
    ];

    return (
        <div className="w-12 bg-[#f3f4f6] border-r border-[#e5e7eb] flex flex-col items-center py-2 text-[#6b7280] flex-shrink-0 z-20">
            {icons.map(item => (
                <div
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                        "p-2 mb-2 cursor-pointer transition-all relative group",
                        activeView === item.id ? "text-[#1f2937]" : "text-[#9ca3af] hover:text-[#1f2937]"
                    )}
                >
                    {activeView === item.id && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#7c3aed]" />}
                    <item.icon className="h-6 w-6" />
                </div>
            ))}

            <div className="flex-1" />

            <div className="p-2 mb-2 hover:text-[#1f2937] cursor-pointer">
                <Settings className="h-6 w-6" />
            </div>
            <div className="p-2 mb-2 hover:text-[#1f2937] cursor-pointer">
                <span className="h-6 w-6 block rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            </div>
        </div>
    );
};

export default function WorkspacePage() {
    const [activeSidebarView, setActiveSidebarView] = useState('explorer');

    // Layout State
    const [leftPanelWidth, setLeftPanelWidth] = useState(260); // Default width
    const [rightPanelWidth, setRightPanelWidth] = useState(320); // Default width
    const [terminalHeight, setTerminalHeight] = useState(200);   // Default height
    const [isDragging, setIsDragging] = useState<'left' | 'right' | 'terminal' | null>(null);

    // Resize Handlers
    const startResize = (direction: 'left' | 'right' | 'terminal') => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(direction);
    };

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging === 'left') {
                const newWidth = e.clientX - 48; // Subtract ActivityBar width (12 * 4px = 48px)
                if (newWidth > 150 && newWidth < 500) setLeftPanelWidth(newWidth);
            } else if (isDragging === 'right') {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 200 && newWidth < 600) setRightPanelWidth(newWidth);
            } else if (isDragging === 'terminal') {
                // Approximate calculation assuming full height
                // better to calculate from bottom
                const newHeight = window.innerHeight - e.clientY - 24; // Subtract StatusBar (6 * 4px = 24px)
                if (newHeight > 100 && newHeight < window.innerHeight - 100) setTerminalHeight(newHeight);
            }
        };

        const onMouseUp = () => {
            setIsDragging(null);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging]);


    return (
        <div className={cn("h-screen w-screen flex flex-col bg-[#ffffff] overflow-hidden text-[#1f2937]", isDragging ? "cursor-grabbing select-none" : "")}>
            <MenuBar />

            {/* Main Layout Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Activity Bar - Fixed Width */}
                <ActivityBar activeView={activeSidebarView} setActiveView={setActiveSidebarView} />

                {/* Left Sidebar */}
                <div style={{ width: leftPanelWidth }} className="flex-shrink-0 flex flex-col min-h-0 bg-[#f9fafb] border-r border-[#e5e7eb] relative">
                    {/* Resizer Handle */}
                    <div
                        className="absolute top-0 bottom-0 right-[-4px] w-2 cursor-col-resize z-50 hover:bg-[#7c3aed]/10 group"
                        onMouseDown={startResize('left')}
                    >
                        <div className="absolute right-[3px] top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-[#7c3aed] transition-colors" />
                    </div>

                    {activeSidebarView === 'explorer' && <FileExplorer />}
                    {activeSidebarView === 'search' && (
                        <div className="p-4 text-sm text-[#4b5563]">
                            <div className="font-bold mb-2 text-xs uppercase">Search</div>
                            <input className="w-full border border-[#e5e7eb] p-1.5 rounded bg-white" placeholder="Search files..." />
                        </div>
                    )}
                    {activeSidebarView === 'git' && (
                        <div className="p-4 text-sm text-[#4b5563] flex flex-col items-center justify-center h-full">
                            <GitBranch className="h-8 w-8 mb-2 opacity-50" />
                            <span>No Source Control providers.</span>
                        </div>
                    )}
                    {activeSidebarView === 'debug' && (
                        <div className="p-4 text-sm text-[#4b5563] flex flex-col items-center justify-center h-full">
                            <Bot className="h-8 w-8 mb-2 opacity-50" />
                            <span>Run and Debug</span>
                        </div>
                    )}
                </div>

                {/* Center Area (Editor + Terminal) */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {/* Editor */}
                    <div className="flex-1 min-h-0 relative">
                        <CodeEditor />
                    </div>

                    {/* Terminal Resizer */}
                    <div
                        className="h-1 bg-[#f3f4f6] cursor-row-resize hover:bg-[#7c3aed] transition-colors z-40 relative"
                        onMouseDown={startResize('terminal')}
                    />

                    {/* Terminal */}
                    <div style={{ height: terminalHeight }} className="flex-shrink-0 min-h-0">
                        <Terminal />
                    </div>
                </div>

                {/* Right Sidebar Resizer */}
                <div
                    className="w-1 bg-[#f3f4f6] cursor-col-resize hover:bg-[#7c3aed] transition-colors z-50 flex-shrink-0"
                    onMouseDown={startResize('right')}
                />


                {/* Right Sidebar (AI Panel) */}
                <div style={{ width: rightPanelWidth }} className="flex-shrink-0 flex flex-col min-h-0 relative">
                    <AIPanel />
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#7c3aed] flex items-center px-3 text-[11px] text-white justify-between select-none flex-shrink-0 z-30">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center hover:bg-white/10 px-1 rounded cursor-pointer">
                        <span className="mr-1">main*</span>
                    </div>
                    <div className="flex items-center hover:bg-white/10 px-1 rounded cursor-pointer">
                        <span className="mr-1">0 errors</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center hover:bg-white/10 px-1 rounded cursor-pointer">
                        <span>TypeScript React</span>
                    </div>
                    <div className="flex items-center hover:bg-white/10 px-1 rounded cursor-pointer">
                        <span>Deexen AI Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
