import { useState, useRef } from 'react';
import { Plus, ChevronDown, MoreHorizontal, Maximize, Minimize2, X, TerminalSquare, AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFileStore } from '@/stores/useFileStore';
import { useLayoutStore } from '@/stores/useLayoutStore';

interface TerminalSession {
    id: number;
    name: string;
    hasWarning?: boolean;
}

export default function Terminal() {
    const [activeTab, setActiveTab] = useState<'Problems' | 'Output' | 'Debug Console' | 'Terminal' | 'Ports'>('Terminal');
    const { projectName } = useFileStore();
    const { setTerminalOpen, toggleTerminalMaximized, isTerminalMaximized } = useLayoutStore();

    // Local Session State
    const [sessions, setSessions] = useState<TerminalSession[]>([
        { id: 1, name: 'e...', hasWarning: true },
        { id: 2, name: 'pwsh' }
    ]);
    const [activeSessionId, setActiveSessionId] = useState<number>(2);
    const [command, setCommand] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddSession = () => {
        const newId = Date.now();
        setSessions(prev => [...prev, { id: newId, name: 'pwsh' }]);
        setActiveSessionId(newId);
    };

    const handleDeleteSession = () => {
        setSessions(prev => {
            const filtered = prev.filter(s => s.id !== activeSessionId);
            if (filtered.length > 0) setActiveSessionId(filtered[filtered.length - 1].id);
            else setActiveSessionId(-1); // No active session if all are deleted
            return filtered;
        });
    };

    return (
        <div
            className="h-full bg-[#181818] flex flex-col font-mono text-[13px] overflow-hidden text-[#cccccc]"
        >
            {/* Tabs Header */}
            <div className="h-9 px-4 flex items-center flex-shrink-0 select-none gap-4 border-b border-[#2b2b2b]">
                {['Problems', 'Output', 'Debug Console', 'Terminal', 'Ports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "h-full relative flex items-center transition-colors pb-[2px]",
                            activeTab === tab
                                ? "text-[#e7e7e7]"
                                : "text-[#8c8c8c] hover:text-[#e7e7e7]"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-[#007acc]" />
                        )}
                    </button>
                ))}

                <div className="flex-1" />

                {/* Right controls */}
                <div className="flex items-center gap-[2px] text-[#cccccc]">
                    <div
                        className="flex items-center hover:bg-[#ffffff1a] rounded cursor-pointer px-1 py-0.5"
                        onClick={handleAddSession}
                        title="Add Terminal"
                    >
                        <Plus className="h-[14px] w-[14px]" />
                        <ChevronDown className="h-3 w-3 ml-[2px]" />
                    </div>
                    {sessions.length > 0 && (
                        <div
                            className="hover:bg-[#ffffff1a] rounded cursor-pointer p-[3px] ml-1"
                            onClick={handleDeleteSession}
                            title="Kill Terminal"
                        >
                            <Trash2 className="h-4 w-4" />
                        </div>
                    )}
                    <div className="hover:bg-[#ffffff1a] rounded cursor-pointer p-[3px] ml-1">
                        <MoreHorizontal className="h-4 w-4" />
                    </div>
                    <div className="w-[1px] h-3 bg-[#4d4d4d] mx-2" />
                    <div
                        className="hover:bg-[#ffffff1a] rounded cursor-pointer p-[3px]"
                        onClick={toggleTerminalMaximized}
                        title={isTerminalMaximized ? "Restore Panel Size" : "Maximize Panel Size"}
                    >
                        {isTerminalMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
                    </div>
                    <div
                        className="hover:bg-[#ffffff1a] rounded cursor-pointer p-[3px]"
                        onClick={() => setTerminalOpen(false)}
                        title="Close Panel"
                    >
                        <X className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {activeTab === 'Terminal' && (
                    <>
                        {/* Main Terminal View */}
                        <div
                            className="flex-1 h-full pl-5 pr-2 py-3 overflow-auto flex items-start cursor-text"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {sessions.length === 0 ? (
                                <div className="text-[#808080] italic px-2">No terminal sessions active. Click '+' to start a new session.</div>
                            ) : (
                                <>
                                    {/* Left margin circle indicator */}
                                    <div className="mt-[6px] mr-[18px] shrink-0">
                                        <div className="h-2 w-2 rounded-full border border-[#4d4d4d]" />
                                    </div>
                                    <div className="flex-1 leading-relaxed flex items-center flex-wrap">
                                        <span className="text-[#cccccc] mr-1 whitespace-nowrap">PS C:\Users\11ara\github\{projectName?.toLowerCase().replace(/\s+/g, '-') || 'deexen-frontend'}&gt;</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={command}
                                            onChange={(e) => setCommand(e.target.value)}
                                            className="bg-transparent border-none outline-none text-[#cccccc] flex-1 min-w-[50px] font-mono text-[13px]"
                                            autoFocus
                                            spellCheck={false}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Sidebar (Terminal Sessions) */}
                        <div className="w-[160px] shrink-0 border-l border-[#2b2b2b] flex flex-col py-1 select-none">
                            {sessions.map(session => (
                                <div
                                    key={session.id}
                                    className={cn(
                                        "px-3 py-[2px] flex items-center gap-2 cursor-pointer group",
                                        activeSessionId === session.id ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
                                    )}
                                    onClick={() => setActiveSessionId(session.id)}
                                >
                                    <TerminalSquare className="h-[14px] w-[14px] text-[#cccccc]" />
                                    <span className={cn(
                                        "flex-1 truncate text-[12px] pt-[1px]",
                                        activeSessionId === session.id ? "text-white" : "text-[#cccccc]"
                                    )}>
                                        {session.name}
                                    </span>
                                    {session.hasWarning && (
                                        <AlertTriangle className="h-[13px] w-[13px] text-[#cca700]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab !== 'Terminal' && (
                    <div className="p-4 text-[#8c8c8c] flex-1">
                        {/* Empty Space for other tabs */}
                    </div>
                )}
            </div>
        </div>
    );
}
