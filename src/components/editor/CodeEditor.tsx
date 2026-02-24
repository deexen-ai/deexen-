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
        <div className="h-full bg-transparent flex flex-col w-full overflow-hidden">
            {/* Tabs */}
            <div className="h-10 flex bg-transparent overflow-x-auto px-2 pt-2 pb-1 gap-1.5 z-10 relative">
                {openFiles.map((fileId) => {
                    const file = findFileContent(fileId);
                    const isActive = fileId === activeFileId;
                    return (
                        <div
                            key={fileId}
                            className={cn(
                                "editor-tab flex items-center text-[11px] cursor-pointer group select-none px-3 font-medium tracking-wide",
                                isActive
                                    ? "active text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                            )}
                            onClick={() => selectFile(fileId)}
                        >
                            <FileCode className={cn("h-3.5 w-3.5 mr-2", isActive ? "text-orange-500" : "text-[var(--text-tertiary)] group-hover:text-orange-500/50 transition-colors")} />
                            <span className="truncate max-w-[120px]">{file?.name || fileId}</span>
                            <div
                                className={cn(
                                    "ml-2 p-0.5 rounded-md hover:bg-white/10 transition-colors",
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
            <div className="flex-1 w-full relative min-h-0">
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
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontLigatures: true,
                        letterSpacing: 0.5,
                        lineHeight: 24,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        cursorWidth: 2,
                        smoothScrolling: true,
                    }}
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme('deexen-dark', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [
                                { background: '00000000' } // Ensure transparent rules
                            ],
                            colors: {
                                'editor.background': '#00000000', // Transparent
                                'editor.lineHighlightBackground': '#ffffff05',
                                'editorGutter.background': '#00000000',
                                'editorLineNumber.foreground': '#444444',
                                'editorLineNumber.activeForeground': '#888888',
                                'editorCursor.foreground': '#f97316',
                                'editor.selectionBackground': '#f9731630',
                            }
                        });
                        monaco.editor.defineTheme('deexen-light', {
                            base: 'vs',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#ffffff00',
                                'editor.lineHighlightBackground': '#00000005',
                                'editorGutter.background': '#ffffff00',
                                'editorLineNumber.foreground': '#cccccc',
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
