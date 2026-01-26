import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Zap } from 'lucide-react';
import { useAIStore } from '@/stores/useAIStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { cn } from '@/utils/cn';

export default function AiAssistant() {
    const { isChatOpen, toggleChat, messages, addMessage, updateLastMessage, isLoading, setLoading, triggerMessage, setTriggerMessage } = useAIStore();
    const { projects } = useProjectStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        if (isChatOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [messages, isChatOpen]);

    // Effect to handle triggers (e.g., from Dashboard)
    useEffect(() => {
        if (triggerMessage && isChatOpen) {
            processMessage(triggerMessage);
            setTriggerMessage(null); // Clear after processing
        }
    }, [triggerMessage, isChatOpen]);


    const processMessage = (text: string) => {
        if (!text.trim() || isLoading) return;

        const userText = text.trim();
        addMessage({
            id: Date.now().toString(),
            role: 'user',
            text: userText,
            timestamp: Date.now()
        });
        setInput('');
        setLoading(true);

        // Simulation of AI processing
        setTimeout(() => {
            const lowercaseInput = userText.toLowerCase();
            const foundProject = projects.find(p => lowercaseInput.includes(p.name.toLowerCase()));

            let responseText = '';

            if (foundProject) {
                // Construct Rich Response WITHOUT File Structure
                responseText = `### 🚀 ${foundProject.name}\n\n`;

                if (foundProject.fullDescription) {
                    responseText += `${foundProject.fullDescription}\n\n`;
                } else {
                    responseText += `${foundProject.description}\n\n`;
                }

                // Tech Stack & Tools (How it is made)
                if (foundProject.techStack) {
                    responseText += `**🛠️ Tech Stack & Tools:**\n${foundProject.techStack.join(' • ')}\n\n`;
                }

                // Application Architecture
                if (foundProject.architecture) {
                    responseText += `**🏗️ Architecture:**\n${foundProject.architecture}\n\n`;
                }

                // Key Features
                if (foundProject.features) {
                    responseText += `**✨ Key Features:**\n${foundProject.features.map(f => `- ${f}`).join('\n')}\n\n`;
                }

                responseText += `\n_Last updated: ${foundProject.lastModified}_`;

            } else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
                responseText = "Hello! I am ready to assist you. Ask me about any of your projects to see their architecture, tech stack, and features.";
            } else {
                responseText = `I can tell you about your projects:\n\n${projects.map(p => `- **${p.name}** (${p.language})`).join('\n')}\n\nTry clicking the AI icon on a project or asking "Explain [project name]".`;
            }

            // Start Streaming
            const messageId = (Date.now() + 1).toString();
            // Add empty message first
            addMessage({
                id: messageId,
                role: 'assistant',
                text: '', // Start empty
                timestamp: Date.now()
            });

            let currentIndex = 0;
            const streamInterval = setInterval(() => {
                if (currentIndex < responseText.length) {
                    // Update content
                    const nextChunk = responseText.substring(0, currentIndex + 1);
                    updateLastMessage(nextChunk);
                    currentIndex++;
                    // Scroll to bottom during streaming
                    if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
                    }
                } else {
                    clearInterval(streamInterval);
                    setLoading(false);
                }
            }, 10); // Typing speed

        }, 1000); // Initial delay
    };

    const handleSend = () => {
        processMessage(input);
    };

    const handleQuickAction = (actionText: string) => {
        processMessage(actionText);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Helper to format messages (basic markdown support)
    const renderMessageText = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (line.startsWith('### ')) {
                return <h4 key={i} className="text-lg font-bold text-white mt-2 mb-1">{line.replace('### ', '')}</h4>;
            }
            if (line.startsWith('**') && line.includes(':**')) {
                const parts = line.split(':**');
                return <p key={i} className="mt-2 mb-1"><span className="font-semibold text-violet-400">{parts[0].replace('**', '')}:</span>{parts[1]}</p>;
            }
            if (line.startsWith('- **')) {
                return <li key={i} className="ml-4 list-disc text-neutral-300">{line.replace('- ', '').replace(/\*\*/g, '')}</li>
            }
            if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 list-disc text-neutral-300">{line.replace('- ', '')}</li>
            }
            if (line.trim().startsWith('src') || line.trim().startsWith('/')) {
                return <pre key={i} className="text-xs font-mono text-neutral-500 pl-4 my-1 opacity-50">{line}</pre>;
            }
            if (line.startsWith('_') && line.endsWith('_')) {
                return <p key={i} className="text-xs text-neutral-500 mt-2 italic">{line.replace(/_/g, '')}</p>
            }
            if (line === '') return <br key={i} />;

            return <p key={i} className="text-neutral-300 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={cn(
                    "mb-4 w-80 sm:w-96 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col",
                    isChatOpen
                        ? "opacity-100 scale-100 translate-y-0 h-[550px]"
                        : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0"
                )}
            >
                {/* Header */}
                <div className="h-14 bg-[#111111] border-b border-neutral-800 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white">AI Assistant</h3>
                            <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-neutral-400">Online</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex space-x-3", msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row")}>
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-neutral-800",
                                    msg.role === 'user' ? "bg-neutral-800" : "bg-[#141414]"
                                )}
                            >
                                {msg.role === 'user' ? <User className="w-4 h-4 text-neutral-400" /> : <Sparkles className="w-4 h-4 text-violet-500" />}
                            </div>
                            <div
                                className={cn(
                                    "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-neutral-800 text-white"
                                        : "bg-[#141414] border border-neutral-800 text-neutral-300"
                                )}
                            >
                                {msg.role === 'assistant' ? renderMessageText(msg.text) : (
                                    msg.text.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-neutral-800 bg-[#141414]">
                                <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                            </div>
                            <div className="bg-[#141414] border border-neutral-800 rounded-lg p-3 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions (Still kept as secondary way, but FAB is gone) */}
                <div className="px-4 pb-2 bg-[#0a0a0a] flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap mask-linear-fade">
                    {projects.slice(0, 3).map(p => (
                        <button
                            key={p.id}
                            onClick={() => handleQuickAction(`Explain ${p.name}`)}
                            className="flex items-center space-x-1.5 bg-[#141414] border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs px-3 py-1.5 rounded-full transition-all"
                        >
                            <Zap className="w-3 h-3 text-violet-500" />
                            <span>{p.name}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => handleQuickAction("Hello")}
                        className="flex items-center space-x-1.5 bg-[#141414] border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs px-3 py-1.5 rounded-full transition-all"
                    >
                        <span>👋 Hi</span>
                    </button>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0a0a0a] border-t border-neutral-800 shrink-0">
                    <div className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your projects..."
                            className="w-full h-10 bg-[#141414] border border-neutral-800 rounded-lg pl-4 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-1.5 text-neutral-400 hover:text-white disabled:opacity-50 disabled:hover:text-neutral-400 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* FAB Removed */}
        </div>
    );
}
