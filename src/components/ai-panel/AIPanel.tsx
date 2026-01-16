import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Bug, GraduationCap, Zap, Play, Send, Mic, Plus, ChevronUp, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

// AI Modes Data
const AI_MODES = [
    { id: 'debug', name: 'Debug Mode', icon: Bug, color: 'text-red-500' },
    { id: 'enhance', name: 'Enhancement', icon: Sparkles, color: 'text-yellow-500' },
    { id: 'expand', name: 'Expansion', icon: Zap, color: 'text-blue-500' },
    { id: 'strict', name: 'Strict Teaching', icon: GraduationCap, color: 'text-purple-600' },
    { id: 'live', name: 'Live Fix', icon: Play, color: 'text-green-500' },
];

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    mode?: string;
}

export default function AIPanel() {
    const [activeMode, setActiveMode] = useState(AI_MODES[0]);
    const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'assistant', content: 'Hello! I am Deexen AI. Select a mode below to start coding with me.', mode: 'general' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const modeSelectorRef = useRef<HTMLDivElement>(null);

    // Close selector on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (modeSelectorRef.current && !modeSelectorRef.current.contains(e.target as Node)) {
                setIsModeSelectorOpen(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [
            ...messages,
            { id: Date.now(), role: 'user' as const, content: input, mode: activeMode.id }
        ];
        setMessages(newMessages);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, role: 'assistant', content: `Processing request in ${activeMode.name}...`, mode: activeMode.id }
            ]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full bg-white border-l border-[#e5e7eb] flex flex-col font-sans">
            {/* Header */}
            <div className="h-9 px-4 flex items-center border-b border-[#e5e7eb] justify-between flex-shrink-0 bg-[#f9fafb]">
                <div className="flex items-center">
                    <span className="text-xs font-semibold text-[#1f2937]">Agent Manager</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Plus className="h-3.5 w-3.5 text-[#6b7280] cursor-pointer" />
                    <X className="h-3.5 w-3.5 text-[#6b7280] cursor-pointer" />
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                        <div className={cn(
                            "px-3 py-2 rounded-lg max-w-[85%] text-sm",
                            msg.role === 'user'
                                ? "bg-[#e5e7eb] text-[#1f2937]"
                                : "bg-white border border-[#e5e7eb] text-[#374151]"
                        )}>
                            {msg.content}
                        </div>
                        {msg.role === 'assistant' && (
                            <span className="text-[10px] text-[#9ca3af] mt-1 ml-1 flex items-center">
                                {activeMode.id === msg.mode && <activeMode.icon className="h-3 w-3 mr-1" />}
                                AI
                            </span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#e5e7eb] bg-white relative">

                {/* Mode Selector Popup */}
                {isModeSelectorOpen && (
                    <div ref={modeSelectorRef} className="absolute bottom-full left-3 mb-2 w-48 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 z-10 transition-all animate-in fade-in slide-in-from-bottom-2">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-[#6b7280] uppercase">Switch Mode</div>
                        {AI_MODES.map(mode => (
                            <button
                                key={mode.id}
                                className="w-full text-left px-3 py-2 text-xs flex items-center hover:bg-[#f3f4f6]"
                                onClick={() => {
                                    setActiveMode(mode);
                                    setIsModeSelectorOpen(false);
                                }}
                            >
                                <mode.icon className={cn("h-3.5 w-3.5 mr-2", mode.color)} />
                                <span className={cn(activeMode.id === mode.id && "font-semibold")}>{mode.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative bg-[#f3f4f6] rounded-xl border border-transparent focus-within:border-[#e5e7eb] focus-within:bg-white transition-colors">
                    <textarea
                        className="w-full bg-transparent border-none text-sm p-3 outline-none resize-none h-[50px] text-[#1f2937] placeholder:text-[#9ca3af]"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="flex items-center justify-between px-2 pb-2">
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-[#e5e7eb] rounded text-[#6b7280]">
                                <Plus className="h-4 w-4" />
                            </button>
                            {/* Mode Trigger */}
                            <button
                                className="flex items-center space-x-1 px-2 py-0.5 rounded-full hover:bg-[#e5e7eb] text-xs text-[#4b5563] font-medium transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModeSelectorOpen(!isModeSelectorOpen);
                                }}
                            >
                                <ChevronUp className="h-3 w-3" />
                                <span>{activeMode.name}</span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-[#e5e7eb] rounded text-[#6b7280]">
                                <Mic className="h-4 w-4" />
                            </button>
                            <button
                                className={cn("p-1 rounded transition-colors", input.trim() ? "bg-[#7c3aed] text-white" : "bg-[#e5e7eb] text-[#9ca3af]")}
                                onClick={handleSend}
                                disabled={!input.trim()}
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
