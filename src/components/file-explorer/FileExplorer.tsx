import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, FilePlus, FolderPlus, FileText, RefreshCw, Layers, Copy, Scissors, Clipboard, Hash, Folder } from 'lucide-react';
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

const getGitStatus = (name: string) => {
    if (name.endsWith('.tsx')) return { type: 'M', color: 'text-orange-400' };
    if (name.endsWith('.ts')) return { type: 'M', color: 'text-orange-400' };
    if (name.endsWith('.md')) return { type: 'U', color: 'text-green-400' };
    return null;
};

const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx')) return <span className="text-blue-400 text-[10px] font-medium">TSX</span>;
    if (name.endsWith('.ts')) return <span className="text-blue-400 text-[10px] font-medium">TS</span>;
    if (name.endsWith('.css')) return <Hash className="h-3.5 w-3.5 text-purple-400" />;
    if (name.endsWith('.json')) return <span className="text-yellow-400 text-[10px] font-medium">{'{}'}</span>;
    if (name.endsWith('.md')) return <span className="text-neutral-500 text-[10px] font-medium">MD</span>;
    return <FileText className="h-3.5 w-3.5 text-neutral-500" />;
};

const FileTreeItem = ({ node, level, onContextMenu, renamingId, onRenameSubmit }: FileTreeItemProps) => {
    const { toggleFolder, openFile, activeFileId } = useFileStore();
    const [editName, setEditName] = useState(node.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const indent = level * 12;

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
        <div className="select-none text-xs">
            <div
                className={cn(
                    "flex items-center h-6 pr-2 cursor-pointer transition-colors group",
                    isSelected && !isRenaming ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300"
                )}
                style={{ paddingLeft: `${indent + 8}px` }}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                {/* Arrow */}
                <span className={cn("mr-1 flex-shrink-0 w-4", node.type !== 'folder' && "opacity-0")}>
                    {node.isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </span>

                {/* Icon */}
                <span className="mr-1.5 flex-shrink-0 w-5 flex items-center justify-center">
                    {node.type === 'folder' ? (
                        <Folder className={cn("h-3.5 w-3.5", node.isOpen ? "text-orange-400" : "text-neutral-500")} />
                    ) : (
                        getFileIcon(node.name)
                    )}
                </span>

                {/* Name */}
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        className="bg-neutral-800 text-white border border-orange-500 px-1 h-5 text-xs flex-1 outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => onRenameSubmit(node.id, editName)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.key === 'Enter' && onRenameSubmit(node.id, editName)}
                    />
                ) : (
                    <span className="truncate flex-1">{node.name}</span>
                )}

                {/* Git Status */}
                {!isRenaming && gitStatus && (
                    <span className={cn("ml-2 text-[10px] font-medium", gitStatus.color)}>
                        {gitStatus.type}
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
            className="h-full bg-[#0f0f0f] flex flex-col relative"
            onContextMenu={(e) => handleContextMenu(e, null)}
            ref={containerRef}
        >
            {/* Project Header */}
            <div className="px-3 py-2 flex items-center justify-between text-xs text-neutral-400 cursor-pointer hover:bg-neutral-800 group">
                <div className="flex items-center overflow-hidden">
                    <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate font-medium">deexen-frontend</span>
                </div>

                <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="New File" onClick={(e) => { e.stopPropagation(); handleAction('newFile'); }} className="p-1 hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-300">
                        <FilePlus className="h-3.5 w-3.5" />
                    </button>
                    <button title="New Folder" onClick={(e) => { e.stopPropagation(); handleAction('newFolder'); }} className="p-1 hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-300">
                        <FolderPlus className="h-3.5 w-3.5" />
                    </button>
                    <button title="Refresh" onClick={(e) => { e.stopPropagation(); handleAction('refresh'); }} className="p-1 hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-300">
                        <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                    </button>
                    <button title="Collapse All" onClick={(e) => { e.stopPropagation(); handleAction('collapse'); }} className="p-1 hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-300">
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

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed bg-[#1a1a1a] border border-neutral-700 rounded shadow-xl py-1 z-50 min-w-[140px]"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700" onClick={() => handleAction('newFile')}>
                        New File
                    </button>
                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700" onClick={() => handleAction('newFolder')}>
                        New Folder
                    </button>

                    {contextMenu.nodeId && (
                        <>
                            <div className="h-px bg-neutral-700 my-1" />
                            <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 flex items-center" onClick={() => handleAction('cut')}>
                                <Scissors className="h-3 w-3 mr-2" /> Cut
                            </button>
                            <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 flex items-center" onClick={() => handleAction('copy')}>
                                <Copy className="h-3 w-3 mr-2" /> Copy
                            </button>
                        </>
                    )}

                    <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 flex items-center" onClick={() => handleAction('paste')}>
                        <Clipboard className="h-3 w-3 mr-2" /> Paste
                    </button>

                    {contextMenu.nodeId && (
                        <>
                            <div className="h-px bg-neutral-700 my-1" />
                            <button className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700" onClick={() => handleAction('rename')}>Rename</button>
                            <button className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-neutral-700" onClick={() => handleAction('delete')}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
