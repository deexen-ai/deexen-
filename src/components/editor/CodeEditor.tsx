import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { X, FileCode, File } from 'lucide-react';
import { useFileStore } from '@/stores/useFileStore';
import { cn } from '@/utils/cn';

export default function CodeEditor() {
    const { openFiles, activeFileId, files, closeFile, selectFile, updateFileContent } = useFileStore();
    const [activeContent, setActiveContent] = useState('');
    const [activeLanguage, setActiveLanguage] = useState('typescript');

    // Helper to find file content and language
    // In a real app with flat file list this is O(1), here tree search O(N)
    const findFileContent = (fileId: string) => {
        // DFS to find file
        const find = (nodes: any[]): any => {
            for (const node of nodes) {
                if (node.id === fileId) return node;
                if (node.children) {
                    const found = find(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        return find(files);
    };

    useEffect(() => {
        if (activeFileId) {
            const file = findFileContent(activeFileId);
            if (file) {
                setActiveContent(file.content || '');
                // Simple language detection
                if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) setActiveLanguage('typescript');
                else if (file.name.endsWith('.json')) setActiveLanguage('json');
                else if (file.name.endsWith('.css')) setActiveLanguage('css');
                else if (file.name.endsWith('.md')) setActiveLanguage('markdown');
                else setActiveLanguage('plaintext');
            }
        }
    }, [activeFileId, files]);

    if (!activeFileId || openFiles.length === 0) {
        return (
            <div className="h-full bg-white flex flex-col items-center justify-center text-[#9ca3af]">
                <div className="mb-4 bg-[#f3f4f6] p-4 rounded-full">
                    <FileCode className="h-12 w-12 text-[#d1d5db]" />
                </div>
                <p>Select a file to start coding</p>
            </div>
        )
    }

    return (
        <div className="h-full bg-white flex flex-col relative w-full overflow-hidden">
            {/* Tabs Bar */}
            <div className="h-9 flex bg-[#f3f4f6] border-b border-[#e5e7eb] overflow-x-auto no-scrollbar">
                {openFiles.map((fileId) => {
                    const file = findFileContent(fileId);
                    const isActive = fileId === activeFileId;
                    return (
                        <div
                            key={fileId}
                            className={cn(
                                "h-full px-3 flex items-center border-r border-[#e5e7eb] text-sm min-w-[120px] max-w-[200px] cursor-pointer group select-none",
                                isActive ? "bg-white border-t-2 border-t-[#7c3aed] text-[#1f2937]" : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
                            )}
                            onClick={() => selectFile(fileId)}
                        >
                            <FileCode className={cn("h-4 w-4 mr-2", isActive ? "text-[#7c3aed]" : "text-[#9ca3af]")} />
                            <span className="flex-1 truncate">{file?.name || fileId}</span>
                            <div
                                className={cn("ml-2 p-0.5 rounded-md hover:bg-[#e5e7eb]", !isActive && "opacity-0 group-hover:opacity-100")}
                                onClick={(e) => { e.stopPropagation(); closeFile(fileId); }}
                            >
                                <X className="h-3 w-3" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Editor Area */}
            <div className="flex-1 w-full">
                <Editor
                    height="100%"
                    language={activeLanguage}
                    value={activeContent}
                    theme="deexen-light"
                    onChange={(value) => {
                        if (activeFileId && value !== undefined) {
                            setActiveContent(value); // Local state for speed
                            updateFileContent(activeFileId, value); // Store update
                        }
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Menlo, monospace',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 },
                        wordWrap: 'on',
                    }}
                    // Customize theme to match Deexen colors
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme('deexen-light', {
                            base: 'vs', // Light theme base
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#ffffff',
                                'editor.lineHighlightBackground': '#f3f4f6',
                                'editorGutter.background': '#ffffff',
                            }
                        });
                    }}
                    onMount={(editor, monaco) => {
                        monaco.editor.setTheme('deexen-light');
                    }}
                />
            </div>
        </div>
    );
}
