import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, FilePlus, FolderPlus, MoreHorizontal, FileText, Code2, Box, RefreshCw, Layers, Copy, Scissors, Clipboard, Hash } from 'lucide-react';
import { useFileStore, type FileNode } from '@/stores/useFileStore';
import { cn } from '@/utils/cn';

interface ContextMenuPosition {
    x: number;
    y: number;
    nodeId: string | null;
}

interface FileTreeItemProps {
    node: FileNode;
    level: number;
    onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
    renamingId: string | null;
    onRenameSubmit: (id: string, newName: string) => void;
}

// Mock Git Status
const getGitStatus = (name: string) => {
    if (name.endsWith('.tsx')) return { type: 'U', color: 'text-green-600' };
    if (name.endsWith('.ts')) return { type: 'U', color: 'text-green-600' };
    if (name.endsWith('.md')) return { type: 'M', color: 'text-yellow-600' };
    if (name === 'node_modules') return null; // ignored
    if (['src', 'components', 'pages'].includes(name)) return { type: 'dot', color: 'text-yellow-600' };
    if (['ui', 'hooks'].includes(name)) return { type: 'dot', color: 'text-green-600' };
    return { type: 'U', color: 'text-green-600' };
};

const getFileIcon = (name: string, isFolder: boolean, isOpen: boolean) => {
    if (isFolder) {
        if (name === 'src') return <Code2 className="h-4 w-4 text-orange-500" />;
        // Generic folder chevron logic handled in parent, this is for the file icon slot if we separate content icon from arrow
        // But VS Code often just uses arrows for folders unless icon theme. 
        // Screenshot shows arrows + specific icons for folders (e.g. green folder, blue folder).
        // For simplicity using Lucide icons.
        return isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />;
    }

    // Files
    if (name.endsWith('.tsx')) return <div className="text-blue-500 text-[10px] font-bold">TSX</div>; // Using text for React
    if (name.endsWith('.ts')) return <div className="text-blue-500 text-[10px] font-bold">TS</div>;
    if (name.endsWith('.css')) return <Hash className="h-4 w-4 text-blue-400" />;
    if (name.endsWith('.json')) return <span className="text-yellow-500 text-[10px] font-bold">{ }</span>;
    if (name.endsWith('.md')) return <div className="text-gray-500 text-[10px] font-bold">M↓</div>;
    return <FileText className="h-4 w-4 text-gray-400" />;
};

const FolderIcon = ({ name, isOpen }: { name: string, isOpen: boolean }) => {
    // VS Code Style folder icons
    // Using Lucide approximations or colors
    let color = "text-blue-400";
    if (name === 'src') color = "text-green-500";
    if (name === 'components') color = "text-orange-400";
    if (name === 'api') color = "text-red-400";

    // In the screenshot, folders have folder icons.
    // We emulate this with a generic folder icon that changes color.
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn("h-4 w-4", color)}
        >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" fill="currentColor" className="opacity-20" />
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
        </svg>
    )
}


const FileTreeItem = ({ node, level, onContextMenu, renamingId, onRenameSubmit }: FileTreeItemProps) => {
    const { toggleFolder, openFile, activeFileId } = useFileStore();
    const [editName, setEditName] = useState(node.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const indent = level * 12; // Tighter indent

    useEffect(() => {
        if (renamingId === node.id) {
            setEditName(node.name);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [renamingId, node.id, node.name]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === 'folder') {
            toggleFolder(node.id);
        } else {
            openFile(node.id);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node.id);
    };

    const isSelected = activeFileId === node.id;
    const isRenaming = renamingId === node.id;
    const gitStatus = getGitStatus(node.name);

    return (
        <div className="select-none text-[13px] font-sans">
            <div
                className={cn(
                    "flex items-center py-[2px] pr-2 cursor-pointer hover:bg-[#e8eaed] transition-colors relative group",
                    isSelected && !isRenaming ? "bg-[#e8eaed] text-black" : "text-[#374151]"
                )}
                style={{ paddingLeft: `${indent + 8}px` }}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                {/* Indent Guide Line (optional, skipping for now as per screenshot cleaner look) */}

                {/* Toggle Arrow */}
                <span className={cn("mr-1 flex-shrink-0", node.type !== 'folder' && "invisible")}>
                    {node.isOpen ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                </span>

                {/* Icon */}
                <span className="mr-1.5 flex-shrink-0">
                    {node.type === 'folder' ? (
                        <FolderIcon name={node.name} isOpen={!!node.isOpen} />
                    ) : (
                        getFileIcon(node.name, false, false)
                    )}
                </span>

                {/* Name */}
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        className="bg-white text-black border border-[#007fd4] px-1 h-5 text-[13px] w-full outline-none leading-none -ml-1"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => onRenameSubmit(node.id, editName)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.key === 'Enter' && onRenameSubmit(node.id, editName)}
                    />
                ) : (
                    <span className={cn("truncate flex-1", gitStatus?.color && "text-[#5f6368]")}>
                        {node.name}
                    </span>
                )}

                {/* Git Status Indicator */}
                {!isRenaming && gitStatus && (
                    <span className={cn("ml-2 text-[10px] font-bold w-4 text-center", gitStatus.color)}>
                        {gitStatus.type === 'dot' ? '•' : gitStatus.type}
                    </span>
                )}
            </div>

            {node.type === 'folder' && node.isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onContextMenu={onContextMenu}
                            renamingId={renamingId}
                            onRenameSubmit={onRenameSubmit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function FileExplorer() {
    const { files, createFile, deleteNode, renameNode, collapseAllFolders, copyNode, cutNode, pasteNode } = useFileStore();
    const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleContextMenu = (e: React.MouseEvent, nodeId: string | null) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
    };

    const handleAction = (action: 'newFile' | 'newFolder' | 'rename' | 'delete' | 'refresh' | 'collapse' | 'copy' | 'cut' | 'paste') => {
        const targetId = contextMenu?.nodeId;
        // Default to root if no target
        const rootId = files[0]?.id;

        switch (action) {
            case 'newFile':
                const fileName = prompt('File Name:');
                if (fileName) createFile(targetId || rootId || null, fileName);
                break;
            case 'newFolder':
                const folderName = prompt('Folder Name:');
                if (folderName) createFile(targetId || rootId || null, folderName);
                break;
            case 'rename':
                if (targetId) setRenamingId(targetId);
                break;
            case 'delete':
                if (targetId && confirm('Delete?')) deleteNode(targetId);
                break;
            case 'refresh':
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 700);
                break;
            case 'collapse':
                collapseAllFolders();
                break;
            case 'copy':
                if (targetId) copyNode(targetId);
                break;
            case 'cut':
                if (targetId) cutNode(targetId);
                break;
            case 'paste':
                // If target is folder, paste there. If null, paste to root.
                // Logic handled in store somewhat, but passing targetId is key.
                pasteNode(targetId || rootId || null);
                break;
        }
        setContextMenu(null);
    };

    const onRenameSubmit = (id: string, newName: string) => {
        if (newName && newName.trim()) renameNode(id, newName);
        setRenamingId(null);
    }

    const rootFiles = files[0].children || [];

    return (
        <div
            className="h-full bg-[#f3f4f6] flex flex-col relative border-r border-[#e5e7eb]"
            onContextMenu={(e) => handleContextMenu(e, null)}
            ref={containerRef}
        >
            <div className="h-9 px-4 flex items-center justify-between flex-shrink-0">
                <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Explorer</span>
                <div className="flex space-x-0.5">
                    <button className="p-1 hover:bg-[#e5e7eb] rounded text-[#4b5563]"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                </div>
            </div>

            {/* Root Project Header with Actions */}
            <div className="px-4 py-1 flex items-center justify-between text-xs font-bold text-[#374151] cursor-pointer hover:bg-[#e5e7eb] group">
                <div className="flex items-center overflow-hidden">
                    <ChevronDown className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">deexen-frontend</span>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#f3f4f6] pl-2">
                    <button title="New File" onClick={(e) => { e.stopPropagation(); handleAction('newFile'); }} className="p-0.5 hover:bg-[#d1d5db] rounded text-[#4b5563]">
                        <FilePlus className="h-3.5 w-3.5" />
                    </button>
                    <button title="New Folder" onClick={(e) => { e.stopPropagation(); handleAction('newFolder'); }} className="p-0.5 hover:bg-[#d1d5db] rounded text-[#4b5563]">
                        <FolderPlus className="h-3.5 w-3.5" />
                    </button>
                    <button title="Refresh" onClick={(e) => { e.stopPropagation(); handleAction('refresh'); }} className="p-0.5 hover:bg-[#d1d5db] rounded text-[#4b5563]">
                        <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                    </button>
                    <button title="Collapse All" onClick={(e) => { e.stopPropagation(); handleAction('collapse'); }} className="p-0.5 hover:bg-[#d1d5db] rounded text-[#4b5563]">
                        <Layers className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
                {rootFiles.map((node) => (
                    <FileTreeItem
                        key={node.id}
                        node={node}
                        level={0}
                        onContextMenu={handleContextMenu}
                        renamingId={renamingId}
                        onRenameSubmit={onRenameSubmit}
                    />
                ))}
            </div>

            {/* Context Menu (Generic) */}
            {contextMenu && (
                <div
                    className="fixed bg-white border border-[#e5e7eb] rounded-md shadow-xl py-1 z-50 min-w-[160px]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="w-full text-left px-4 py-1.5 text-xs text-[#1f2937] hover:bg-[#007fd4] hover:text-white flex items-center" onClick={() => handleAction('newFile')}>
                        <span className="flex-1">New File</span>
                    </button>
                    <button className="w-full text-left px-4 py-1.5 text-xs text-[#1f2937] hover:bg-[#007fd4] hover:text-white flex items-center" onClick={() => handleAction('newFolder')}>
                        <span className="flex-1">New Folder</span>
                    </button>

                    <div className="h-px bg-[#e5e7eb] my-1" />

                    {contextMenu.nodeId && (
                        <>
                            <button className="w-full text-left px-4 py-1.5 text-xs text-[#1f2937] hover:bg-[#007fd4] hover:text-white flex items-center" onClick={() => handleAction('cut')}>
                                <Scissors className="h-3 w-3 mr-2" /> Cut
                            </button>
                            <button className="w-full text-left px-4 py-1.5 text-xs text-[#1f2937] hover:bg-[#007fd4] hover:text-white flex items-center" onClick={() => handleAction('copy')}>
                                <Copy className="h-3 w-3 mr-2" /> Copy
                            </button>
                        </>
                    )}

                    <button
                        className={cn(
                            "w-full text-left px-4 py-1.5 text-xs flex items-center",
                            files[0].children ? "text-[#1f2937] hover:bg-[#007fd4] hover:text-white" : "text-gray-400 cursor-not-allowed"
                        )}
                        onClick={() => handleAction('paste')}
                    >
                        <Clipboard className="h-3 w-3 mr-2" /> Paste
                    </button>

                    {contextMenu.nodeId && (
                        <>
                            <div className="h-px bg-[#e5e7eb] my-1" />
                            <button className="w-full text-left px-4 py-1.5 text-xs text-[#1f2937] hover:bg-[#007fd4] hover:text-white" onClick={() => handleAction('rename')}>Rename</button>
                            <button className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-[#007fd4] hover:text-white" onClick={() => handleAction('delete')}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
