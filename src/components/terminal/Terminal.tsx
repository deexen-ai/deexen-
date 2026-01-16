import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TerminalLine {
    id: number;
    content: React.ReactNode;
}

export default function Terminal() {
    const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 1, content: <span>Welcome to Deexen Terminal v1.0.0</span> },
        { id: 2, content: <span>Type 'help' for available commands.</span> }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'terminal') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, activeTab]);

    const handleCommand = (cmd: string) => {
        const newHistory = [...history, { id: Date.now(), content: <span><span className="text-[#3b82f6]">➜</span> <span className="text-[#9ca3af]">{cmd}</span></span> }];

        const lowerCmd = cmd.trim().toLowerCase();

        let response: React.ReactNode = null;

        if (lowerCmd === 'help') {
            response = (
                <div className="flex flex-col text-[#4b5563]">
                    <span>Available commands:</span>
                    <span className="pl-4">ls      - List files</span>
                    <span className="pl-4">clear   - Clear terminal</span>
                    <span className="pl-4">npm run - Execute scripts (mock)</span>
                    <span className="pl-4">git     - Git commands (mock)</span>
                </div>
            );
        } else if (lowerCmd === 'ls') {
            response = (
                <div className="flex space-x-4 text-[#3b82f6]">
                    <span>src/</span>
                    <span>public/</span>
                    <span>package.json</span>
                    <span>README.md</span>
                </div>
            );
        } else if (lowerCmd === 'clear') {
            setHistory([]);
            return;
        } else if (lowerCmd === '') {
            // Do nothing
        } else {
            response = <span className="text-red-400">Command not found: {cmd}</span>;
        }

        if (response) {
            newHistory.push({ id: Date.now() + 1, content: response });
        }

        setHistory(newHistory);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div
            className="h-full bg-white border-t border-[#e5e7eb] flex flex-col font-mono text-sm overflow-hidden"
            onClick={() => activeTab === 'terminal' && inputRef.current?.focus()}
        >
            <div className="h-9 px-4 flex items-center border-b border-[#e5e7eb] bg-[#f8f9fa] flex-shrink-0 select-none">
                <div
                    onClick={() => setActiveTab('terminal')}
                    className={cn("flex items-center space-x-2 text-xs uppercase font-bold h-full px-2 cursor-pointer transition-colors border-b-2", activeTab === 'terminal' ? "border-[#7c3aed] text-[#1f2937]" : "border-transparent text-[#6b7280] hover:text-[#1f2937]")}
                >
                    <span>Terminal</span>
                </div>
                <div
                    onClick={() => setActiveTab('output')}
                    className={cn("flex items-center space-x-2 text-xs uppercase font-bold h-full px-2 cursor-pointer transition-colors border-b-2", activeTab === 'output' ? "border-[#7c3aed] text-[#1f2937]" : "border-transparent text-[#6b7280] hover:text-[#1f2937]")}
                >
                    <span>Output</span>
                </div>
                <div
                    onClick={() => setActiveTab('problems')}
                    className={cn("flex items-center space-x-2 text-xs uppercase font-bold h-full px-2 cursor-pointer transition-colors border-b-2", activeTab === 'problems' ? "border-[#7c3aed] text-[#1f2937]" : "border-transparent text-[#6b7280] hover:text-[#1f2937]")}
                >
                    <span>Problems</span>
                    {activeTab !== 'problems' && <span className="ml-1 rounded-full bg-[#7c3aed] text-white text-[9px] w-4 h-4 flex items-center justify-center">0</span>}
                </div>

                <div className="flex-1" />
                <div className="flex items-center cursor-pointer hover:bg-[#e5e7eb] p-1 rounded">
                    <Plus className="h-4 w-4 text-[#6b7280]" />
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto cursor-text text-[#1f2937]">

                {activeTab === 'terminal' && (
                    <>
                        {history.map((line) => (
                            <div key={line.id} className="mb-1 text-[#1f2937]">
                                {line.content}
                            </div>
                        ))}
                        <div className="flex items-center">
                            <span className="text-[#3b82f6] mr-2">➜</span>
                            <span className="text-[#10b981] mr-2">deexen-frontend</span>
                            <span className="text-[#1f2937] mr-2">git:(<span className="text-[#7c3aed]">main</span>)</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="bg-transparent border-none outline-none text-[#1f2937] flex-1"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                        <div ref={bottomRef} />
                    </>
                )}

                {activeTab === 'output' && (
                    <div className="text-[#6b7280] italic">
                        [Info] Deexen Language Server initialized successfully.<br />
                        [Info] Loaded 2 extensions.<br />
                        [Info] File system watcher active.
                    </div>
                )}

                {activeTab === 'problems' && (
                    <div className="flex flex-col items-center justify-center h-full text-[#9ca3af]">
                        <span>No problems have been detected in the workspace.</span>
                    </div>
                )}

            </div>
        </div>
    );
}
