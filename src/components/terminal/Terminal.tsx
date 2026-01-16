import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TerminalLine {
    id: number;
    content: React.ReactNode;
}

export default function Terminal() {
    const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 1, content: <span className="text-neutral-500">Welcome to Deexen Terminal</span> },
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
        const newHistory = [...history, { id: Date.now(), content: <span><span className="text-orange-500">$</span> <span className="text-neutral-300">{cmd}</span></span> }];
        const lowerCmd = cmd.trim().toLowerCase();

        let response: React.ReactNode = null;

        if (lowerCmd === 'help') {
            response = (
                <div className="flex flex-col text-neutral-500 pl-2">
                    <span>ls      - List files</span>
                    <span>clear   - Clear terminal</span>
                    <span>npm run - Execute scripts</span>
                </div>
            );
        } else if (lowerCmd === 'ls') {
            response = (
                <div className="flex gap-4 text-neutral-400 pl-2">
                    <span>src/</span>
                    <span>public/</span>
                    <span>package.json</span>
                </div>
            );
        } else if (lowerCmd === 'clear') {
            setHistory([]);
            return;
        } else if (lowerCmd === '') {
            // empty
        } else {
            response = <span className="text-red-400 pl-2">Command not found: {cmd}</span>;
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
            className="h-full bg-[#0a0a0a] flex flex-col font-mono text-xs overflow-hidden"
            onClick={() => activeTab === 'terminal' && inputRef.current?.focus()}
        >
            {/* Tabs */}
            <div className="h-9 px-2 flex items-center border-b border-neutral-800 bg-[#0f0f0f] flex-shrink-0 select-none gap-1">
                {['terminal', 'output', 'problems'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "px-3 h-7 text-xs capitalize transition-colors rounded",
                            activeTab === tab
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        {tab}
                        {tab === 'problems' && <span className="ml-1.5 text-neutral-600">0</span>}
                    </button>
                ))}
                <div className="flex-1" />
                <button className="p-1.5 text-neutral-600 hover:text-neutral-400 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 overflow-y-auto cursor-text text-neutral-300">
                {activeTab === 'terminal' && (
                    <>
                        {history.map((line) => (
                            <div key={line.id} className="mb-1 leading-relaxed">
                                {line.content}
                            </div>
                        ))}
                        <div className="flex items-center">
                            <span className="text-orange-500 mr-1">$</span>
                            <span className="text-green-500 mr-1">deexen</span>
                            <span className="text-neutral-600 mr-2">main</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="bg-transparent border-none outline-none text-neutral-300 flex-1 caret-orange-500"
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
                    <div className="text-neutral-600">
                        [info] Language server initialized<br />
                        [info] 2 extensions loaded
                    </div>
                )}

                {activeTab === 'problems' && (
                    <div className="flex items-center justify-center h-full text-neutral-600">
                        No problems detected
                    </div>
                )}
            </div>
        </div>
    );
}
