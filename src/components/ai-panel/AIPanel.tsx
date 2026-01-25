import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Mic, ChevronUp, Image, FileText, AtSign, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAIStore } from '@/stores/useAIStore';
import { MODE_CONFIG, AI_MODES } from '@/config/aiModes';
import type { AIMode } from '@/config/aiModes';
import { aiService } from '@/services/aiService';
import { useFileStore } from '@/stores/useFileStore';

// AI Models
const AI_MODELS = [
    { id: 'gemini', name: 'Gemini 2.5 Flash', suffix: '' },
    { id: 'magicoder', name: 'Magicoder 7B', suffix: '(Local)' },
    { id: 'opus', name: 'Claude Opus 4.5', suffix: '(Thinking)' },
    { id: 'sonnet', name: 'Claude Sonnet 4', suffix: '' },
    { id: 'gpt4', name: 'GPT-4o', suffix: '' },
];

// Format response with code blocks
function formatResponse(text: string) {
    const parts = text.split(/(```[\s\S]*?```)/);

    return parts.map((part, idx) => {
        if (part.startsWith('```')) {
            const lines = part.replace(/```/g, '').trim().split('\n');
            const lang = lines[0].match(/^[a-z]+$/i) ? lines.shift() : '';
            const code = lines.join('\n');
            return (
                <div key={idx} className="relative group my-4">
                    {lang && (
                        <div className="absolute right-3 top-3 text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            {lang}
                        </div>
                    )}
                    <pre className="bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded p-3 overflow-x-auto selection:bg-orange-500/30">
                        <code className="text-xs text-neutral-300 font-mono leading-relaxed">{code}</code>
                    </pre>
                </div>
            );
        } else {
            // Parse bold text
            const formatted = part.split(/(\*\*.*?\*\*)/).map((segment, i) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                    return <strong key={i} className="text-[var(--text-primary)]">{segment.slice(2, -2)}</strong>;
                }
                return segment;
            });
            return part.trim() ? (
                <p key={idx} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    {formatted}
                </p>
            ) : null;
        }
    });
}

// Helper to flatten files for mention list
const getAllFiles = (nodes: any[]): any[] => {
    let allFiles: any[] = [];
    for (const node of nodes) {
        if (node.type === 'file') {
            allFiles.push(node);
        }
        if (node.children) {
            allFiles = [...allFiles, ...getAllFiles(node.children)];
        }
    }
    return allFiles;
};

export default function AIPanel() {
    const { selectedMode, setMode, selectedModel, setModel, isLoading, setLoading, error, setError, response, setResponse, addToHistory } = useAIStore();
    const { activeFileId, files } = useFileStore();

    const [input, setInput] = useState('');
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mention state
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionIndex, setMentionIndex] = useState(0);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const config = MODE_CONFIG[selectedMode];
    const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];
    const allFiles = getAllFiles(files);

    const filteredFiles = allFiles.filter(f =>
        f.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [response]);

    useEffect(() => {
        if (!showMentions) {
            setMentionIndex(0);
            setMentionQuery('');
        }
    }, [showMentions]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handler = () => {
            setShowModeDropdown(false);
            setShowModelDropdown(false);
            setShowAddMenu(false);
            setShowMentions(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    // Get current file content
    const getCurrentCode = (): { content: string; name: string } => {
        if (!activeFileId) return { content: '', name: '' };
        const findFile = (nodes: any[]): any => {
            for (const node of nodes) {
                if (node.id === activeFileId) return node;
                if (node.children) {
                    const found = findFile(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        const file = findFile(files);
        return { content: file?.content || '', name: file?.name || '' };
    };

    // Helper to detect language
    const getLanguage = (filename: string): string => {
        if (!filename) return 'javascript';
        const ext = filename.split('.').pop()?.toLowerCase();
        const map: Record<string, string> = {
            'ts': 'typescript',
            'tsx': 'typescript',
            'js': 'javascript',
            'jsx': 'javascript',
            'py': 'python',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown'
        };
        return map[ext || ''] || 'text';
    };

    const handleAnalyze = async () => {
        let code = input.trim();
        let language = 'text';

        // 1. Check for file mentions in input (e.g. @filename)
        const mentionMatch = input.match(/@([a-zA-Z0-9_\-\.]+)/);
        if (mentionMatch) {
            const filename = mentionMatch[1];
            const file = allFiles.find(f => f.name === filename);

            if (file) {
                language = getLanguage(file.name);
                // Append file content to the user's prompt
                code = `${input}\n\n// Content of ${file.name}:\n${file.content}`;
            } else {
                // Mentioned file not found, treat as text
            }
        }
        // 2. If no input (or only whitespace), use active file
        else if (!code) {
            const currentFile = getCurrentCode();
            if (currentFile.content) {
                code = currentFile.content;
                language = getLanguage(currentFile.name);
            }
        }
        // 3. Input exists but no mention -> Treat as raw text/code input
        // (Default behavior maintained)

        if (!code) {
            setError('Please write some code first or type a question');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Use real analyze method with selected model
            const result = await aiService.analyze(selectedMode, selectedModel, code, undefined, language);

            const responseData = {
                mode: selectedMode,
                response: result,
                timestamp: Date.now(),
                codeAnalyzed: code,
            };

            setResponse(responseData);
            addToHistory(responseData);
            setInput('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const insertMention = (filename: string) => {
        const cursorPos = input.lastIndexOf('@');
        if (cursorPos === -1) return;

        const prefix = input.substring(0, cursorPos);
        const newInput = prefix + '@' + filename + ' ';
        setInput(newInput);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);

        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const query = value.slice(lastAtIndex + 1);
            // Only show if no spaces after @ (simple logic)
            if (!query.includes(' ')) {
                setMentionQuery(query);
                if (!showMentions) {
                    setShowMentions(true);
                }
                return;
            }
        }
        setShowMentions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % filteredFiles.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + filteredFiles.length) % filteredFiles.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                if (filteredFiles[mentionIndex]) {
                    insertMention(filteredFiles[mentionIndex].name);
                }
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowMentions(false);
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAnalyze();
        }
    };

    const handleCopy = () => {
        if (response) {
            navigator.clipboard.writeText(response.response);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[var(--bg-canvas)]">
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-[var(--border-default)] flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <img src="/deexenlogo.png" alt="Deexen AI" className="h-5" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">AI</span>
                </div>
            </div>

            {/* Mode Description (Dynamic) */}
            <div className="px-4 py-3 border-b border-[var(--border-default)] flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
                        <config.Icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">{config.label} Mode</h3>
                        <p className="text-xs text-[var(--text-secondary)]">{config.description}</p>
                    </div>
                </div>
            </div>



            {/* Response Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex space-x-1 mb-3">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">Analyzing your code...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-400">⚠️ {error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!response && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-sm text-[var(--text-secondary)] mb-2">{config.placeholder}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Click "<span className="text-orange-500">{config.buttonText}</span>" to get started
                        </p>
                    </div>
                )}

                {/* Response Display */}
                {response && !isLoading && (
                    <div>
                        {/* Response Header */}
                        <div className="flex items-center justify-between mb-3">
                            <span
                                className="text-xs px-2 py-1 rounded font-medium flex items-center space-x-1"
                                style={{ backgroundColor: `${config.color}20`, color: config.color }}
                            >
                                <config.Icon className="w-3 h-3" />
                                <span>{config.label}</span>
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-neutral-300 transition-colors"
                                >
                                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Response Content */}
                        <div className="prose prose-invert prose-sm max-w-none">
                            {formatResponse(response.response)}
                        </div>

                        {/* Response Footer */}
                        <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                            <small className="text-[var(--text-secondary)]">
                                {new Date(response.timestamp).toLocaleTimeString()}
                            </small>
                            <div className="flex items-center space-x-2">
                                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs flex items-center space-x-1">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>Good</span>
                                </button>
                                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs flex items-center space-x-1">
                                    <ThumbsDown className="w-3 h-3" />
                                    <span>Bad</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[var(--border-default)] flex-shrink-0 relative">
                {/* Mention Dropdown */}
                {showMentions && filteredFiles.length > 0 && (
                    <div
                        className="absolute bottom-full left-3 mb-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto"
                    >
                        <div className="px-3 py-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
                            Mention File
                        </div>
                        {filteredFiles.map((file, idx) => (
                            <button
                                key={file.id}
                                onClick={() => insertMention(file.name)}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-[var(--bg-surface-hover)] transition-colors",
                                    idx === mentionIndex ? "bg-neutral-800 text-[var(--text-primary)]" : "text-neutral-300"
                                )}
                            >
                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                <span>{file.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Text Input */}
                <div className="p-3">
                    <div className="relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything (Ctrl+L), @ to mention, / for workflows"
                            rows={2}
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2 pr-20 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-default)] resize-none"
                        />
                        <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                            <button className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors">
                                <Mic className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading}
                                className={cn(
                                    "p-1.5 rounded transition-colors",
                                    !isLoading
                                        ? "bg-orange-500 text-[var(--text-primary)] hover:bg-orange-600"
                                        : "bg-neutral-700 text-[var(--text-secondary)]"
                                )}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="px-3 pb-2">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className={cn(
                            "w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2",
                            isLoading ? "bg-neutral-800 text-[var(--text-secondary)]" : "text-[var(--text-primary)] hover:opacity-90"
                        )}
                        style={{ backgroundColor: isLoading ? undefined : config.color }}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{config.buttonText}</span>
                        )}
                    </button>
                </div>

                {/* Footer Controls */}
                <div className="px-3 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* Add Button */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowAddMenu(!showAddMenu); }}
                                className="p-1.5 text-[var(--text-secondary)] hover:text-neutral-300 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            {showAddMenu && (
                                <div className="absolute bottom-full left-0 mb-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 min-w-[160px] z-50">
                                    <button className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-[var(--bg-surface-hover)] flex items-center space-x-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Add File</span>
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-[var(--bg-surface-hover)] flex items-center space-x-2">
                                        <Image className="w-3.5 h-3.5" />
                                        <span>Add Image</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInput(input + '@');
                                            setShowAddMenu(false);
                                            inputRef.current?.focus();
                                            // The onChange won't trigger automatically here, so we manually trigger logic or rely on them typing next
                                            // Ideally we manually trigger the mention state:
                                            setMentionQuery('');
                                            setShowMentions(true);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-[var(--bg-surface-hover)] flex items-center space-x-2"
                                    >
                                        <AtSign className="w-3.5 h-3.5" />
                                        <span>Mention File</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mode Toggle */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowModeDropdown(!showModeDropdown); }}
                                className="flex items-center space-x-1.5 px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-neutral-200 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                            >
                                <ChevronUp className="w-3 h-3" />
                                <config.Icon className="w-3 h-3" style={{ color: config.color }} />
                                <span>{config.label}</span>
                            </button>
                            {showModeDropdown && (
                                <div className="absolute bottom-full left-0 mb-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 min-w-[220px] z-50">
                                    <div className="px-3 py-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">AI Mode</div>
                                    {AI_MODES.map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => { setMode(mode.id as AIMode); setShowModeDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 hover:bg-[var(--bg-surface-hover)] flex items-center space-x-3",
                                                selectedMode === mode.id && "bg-neutral-800"
                                            )}
                                        >
                                            <mode.Icon className="w-3.5 h-3.5" style={{ color: mode.color }} />
                                            <div className="flex-1">
                                                <div className="text-xs text-[var(--text-primary)]">{mode.label}</div>
                                                <div className="text-[9px] text-[var(--text-secondary)]">{mode.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Model Selector */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowModelDropdown(!showModelDropdown); }}
                                className="flex items-center space-x-1 px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-neutral-200 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
                            >
                                <ChevronUp className="w-3 h-3" />
                                <span>{currentModel.name}</span>
                            </button>
                            {showModelDropdown && (
                                <div className="absolute bottom-full left-0 mb-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-xl py-1 min-w-[200px] z-50">
                                    <div className="px-3 py-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Model</div>
                                    {AI_MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => { setModel(model.id); setShowModelDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]",
                                                selectedModel === model.id && "bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                                            )}
                                        >
                                            {model.name} <span className="text-[var(--text-secondary)]">{model.suffix}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
