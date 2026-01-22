import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { X, FileCode } from 'lucide-react';
import { useFileStore } from '@/stores/useFileStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/utils/cn';

export default function CodeEditor() {
    const { openFiles, activeFileId, files, closeFile, selectFile, updateFileContent } = useFileStore();
    const { theme } = useThemeStore();
    const [activeContent, setActiveContent] = useState('');
    const [activeLanguage, setActiveLanguage] = useState('typescript');

    const findFileContent = (fileId: string) => {
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
            <div className="h-full bg-[var(--bg-canvas)] flex flex-col items-center justify-center text-[var(--text-secondary)]">
                <FileCode className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Select a file to start editing</p>
            </div>
        )
    }

    return (
        <div className="h-full bg-[var(--bg-canvas)] flex flex-col w-full overflow-hidden">
            {/* Tabs */}
            <div className="h-9 flex bg-[var(--bg-surface)] border-b border-[var(--border-default)] overflow-x-auto">
                {openFiles.map((fileId) => {
                    const file = findFileContent(fileId);
                    const isActive = fileId === activeFileId;
                    return (
                        <div
                            key={fileId}
                            className={cn(
                                "h-full px-3 flex items-center text-xs cursor-pointer group select-none border-r border-[var(--border-default)]",
                                isActive
                                    ? "bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t-2 border-t-orange-500"
                                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            )}
                            onClick={() => selectFile(fileId)}
                        >
                            <FileCode className={cn("h-3.5 w-3.5 mr-2", isActive ? "text-orange-500" : "text-neutral-600")} />
                            <span className="truncate max-w-[120px]">{file?.name || fileId}</span>
                            <div
                                className={cn(
                                    "ml-2 p-0.5 rounded hover:bg-[var(--bg-surface-hover)]",
                                    !isActive && "opacity-0 group-hover:opacity-100"
                                )}
                                onClick={(e) => { e.stopPropagation(); closeFile(fileId); }}
                            >
                                <X className="h-3 w-3" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Editor */}
            <div className="flex-1 w-full">
                <Editor
                    height="100%"
                    language={activeLanguage}
                    value={activeContent}
                    theme={theme === 'dark' ? 'deexen-dark' : 'deexen-light'}
                    onChange={(value) => {
                        if (activeFileId && value !== undefined) {
                            setActiveContent(value);
                            updateFileContent(activeFileId, value);
                        }
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: 'JetBrains Mono, Consolas, monospace',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 12 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                    }}
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme('deexen-dark', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#0a0a0a',
                                'editor.lineHighlightBackground': '#141414',
                                'editorGutter.background': '#0a0a0a',
                                'editorCursor.foreground': '#f97316',
                                'editor.selectionBackground': '#f9731630',
                            }
                        });
                        monaco.editor.defineTheme('deexen-light', {
                            base: 'vs',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#ffffff',
                                'editor.lineHighlightBackground': '#f3f4f6',
                                'editorGutter.background': '#ffffff',
                                'editorCursor.foreground': '#f97316',
                                'editor.selectionBackground': '#f9731630',
                            }
                        });
                    }}
                />
            </div>
        </div>
    );
}
