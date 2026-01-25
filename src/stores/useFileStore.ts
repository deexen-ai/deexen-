import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    isOpen?: boolean; // For folders
}

interface FileState {
    files: FileNode[];
    openFiles: string[]; // List of file IDs
    activeFileId: string | null;
    projectName: string;

    // Actions
    toggleFolder: (id: string) => void;
    openFile: (id: string) => void;
    closeFile: (id: string) => void;
    selectFile: (id: string) => void;
    createFile: (parentId: string | null, name: string) => void;
    deleteNode: (id: string) => void;
    renameNode: (id: string, newName: string) => void;
    updateFileContent: (id: string, content: string) => void;
    collapseAllFolders: () => void;
    clipboard: { nodeId: string; mode: 'copy' | 'cut' } | null;
    copyNode: (id: string) => void;
    cutNode: (id: string) => void;
    pasteNode: (parentId: string | null) => void;
    setProjectName: (name: string) => void;
}

const initialFiles: FileNode[] = [
    {
        id: 'root',
        name: 'root',
        type: 'folder',
        isOpen: true,
        children: [
            {
                id: 'src',
                name: 'src',
                type: 'folder',
                isOpen: true,
                children: [
                    { id: 'main.tsx', name: 'main.tsx', type: 'file', content: '// Entry point' },
                    { id: 'App.tsx', name: 'App.tsx', type: 'file', content: '// App component' },
                    {
                        id: 'components',
                        name: 'components',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { id: 'Button.tsx', name: 'Button.tsx', type: 'file', content: '// Button component' }
                        ]
                    },
                ]
            },
            { id: 'package.json', name: 'package.json', type: 'file', content: '{}' },
            { id: 'Readme.md', name: 'Readme.md', type: 'file', content: '# Project' },
        ]
    }
];

// Helper to find node by ID
const findNode = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

// Helper to recursively update nodes
const updateNode = (nodes: FileNode[], id: string, updater: (node: FileNode) => FileNode): FileNode[] => {
    return nodes.map(node => {
        if (node.id === id) {
            return updater(node);
        }
        if (node.children) {
            return { ...node, children: updateNode(node.children, id, updater) };
        }
        return node;
    });
};

export const useFileStore = create<FileState>()(
    persist(
        (set) => ({
            files: initialFiles,
            openFiles: ['main.tsx'],
            activeFileId: 'main.tsx',
            projectName: 'deexen-frontend',

            toggleFolder: (id) => set((state) => ({
                files: updateNode(state.files, id, (node) => ({ ...node, isOpen: !node.isOpen }))
            })),

            openFile: (id) => set((state) => {
                if (state.openFiles.includes(id)) {
                    return { activeFileId: id };
                }
                return {
                    openFiles: [...state.openFiles, id],
                    activeFileId: id
                };
            }),

            closeFile: (id) => set((state) => {
                const newOpenFiles = state.openFiles.filter(fId => fId !== id);
                let newActiveId = state.activeFileId;
                if (state.activeFileId === id) {
                    newActiveId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
                }
                return {
                    openFiles: newOpenFiles,
                    activeFileId: newActiveId
                };
            }),

            selectFile: (id) => set({ activeFileId: id }),

            createFile: (parentId, name) => set((state) => {
                let newId = name.replace(/\s+/g, '-').toLowerCase();
                // basic uniqueness check
                if (findNode(state.files, newId)) newId = `${newId}-${Date.now()}`;

                const newNode: FileNode = {
                    id: newId,
                    name,
                    type: name.includes('.') ? 'file' : 'folder',
                    isOpen: false, // For folders
                    children: name.includes('.') ? undefined : [],
                    content: name.includes('.') ? '' : undefined
                };

                // If parentId is null, add to root
                if (!parentId) { // add to root level (inside 'root' folder in our structure)
                    return {
                        files: updateNode(state.files, 'root', (node) => ({
                            ...node,
                            children: [...(node.children || []), newNode]
                        }))
                    };
                }

                return {
                    files: updateNode(state.files, parentId, (node) => ({
                        ...node,
                        isOpen: true, // Auto open parent
                        children: [...(node.children || []), newNode]
                    }))
                };
            }),

            deleteNode: (id) => set((state) => {
                // Helper to recursive delete
                const deleteFromNodes = (nodes: FileNode[]): FileNode[] => {
                    return nodes.filter(node => node.id !== id).map(node => {
                        if (node.children) {
                            return { ...node, children: deleteFromNodes(node.children) };
                        }
                        return node;
                    });
                };

                return {
                    files: deleteFromNodes(state.files),
                    openFiles: state.openFiles.filter(fid => fid !== id),
                    activeFileId: state.activeFileId === id ? null : state.activeFileId
                };
            }),

            renameNode: (id: string, newName: string) => set((state) => ({
                files: updateNode(state.files, id, (node) => ({ ...node, name: newName }))
            })),

            updateFileContent: (id: string, content: string) => set((state) => ({
                files: updateNode(state.files, id, (node) => ({ ...node, content }))
            })),

            setProjectName: (name: string) => set({ projectName: name }),

            collapseAllFolders: () => set((state) => {
                const closeAll = (nodes: FileNode[]): FileNode[] => {
                    return nodes.map(node => ({
                        ...node,
                        isOpen: false, // Close current
                        children: node.children ? closeAll(node.children) : undefined // Recurse
                    }));
                };
                return { files: closeAll(state.files) };
            }),

            // Clipboard State
            clipboard: null,

            copyNode: (id: string) => set({ clipboard: { nodeId: id, mode: 'copy' } }),
            cutNode: (id: string) => set({ clipboard: { nodeId: id, mode: 'cut' } }),

            pasteNode: (parentId: string | null) => set((state) => {
                if (!state.clipboard) return state;

                const { nodeId, mode } = state.clipboard;
                // Helper to find node by ID
                const findNode = (nodes: FileNode[], targetId: string): FileNode | null => {
                    for (const node of nodes) {
                        if (node.id === targetId) return node;
                        if (node.children) {
                            const found = findNode(node.children, targetId);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const sourceNode = findNode(state.files, nodeId);
                if (!sourceNode) return state;

                // Recursive Clone
                const cloneNode = (node: FileNode): FileNode => ({
                    ...node,
                    id: Math.random().toString(36).substr(2, 9),
                    name: mode === 'copy' ? `${node.name} (copy)` : node.name,
                    children: node.children?.map(cloneNode),
                    isOpen: false // Reset state on paste
                });

                // Insert Logic
                const insertIntoParent = (nodes: FileNode[], pid: string | null, newNode: FileNode): FileNode[] => {
                    if (!pid) { // Insert at root if no parent
                        // Assuming root is the first folder "deexen-frontend"
                        // If parentId is null, we usually mean "paste into root folder"
                        // But our root is index 0. logic:
                        // If pid is null, we insert into the children of the first node (the project root)
                        const root = nodes[0];
                        return [{
                            ...root,
                            children: [...(root.children || []), newNode]
                        }];
                    }

                    return nodes.map(node => {
                        if (node.id === pid) {
                            // Check if it's a folder. If not, paste into its parent? 
                            // Usually UI handles "paste into folder". If target is file, paste into buffer/sibling?
                            // Simplified: Pasting INTO a folder.
                            if (node.type !== 'folder') return node;
                            return { ...node, children: [...(node.children || []), newNode] };
                        }
                        if (node.children) {
                            return { ...node, children: insertIntoParent(node.children, pid, newNode) };
                        }
                        return node;
                    });
                };

                // Remove from old location if CUT
                const removeFromParent = (nodes: FileNode[], idToRemove: string): FileNode[] => {
                    return nodes.filter(n => n.id !== idToRemove).map(n => ({
                        ...n,
                        children: n.children ? removeFromParent(n.children, idToRemove) : undefined
                    }));
                };

                let newFiles = state.files;
                let nodeToPaste = sourceNode;

                if (mode === 'copy') {
                    nodeToPaste = cloneNode(sourceNode);
                    newFiles = insertIntoParent(newFiles, parentId, nodeToPaste);
                } else {
                    // CUT: Remove then Insert
                    // Special case: prevent moving folder into itself
                    if (parentId === nodeId) return state; // Can't paste into self

                    // First remove
                    newFiles = removeFromParent(newFiles, nodeId);
                    // Then insert
                    // Reset name for cut (no 'copy' suffix)
                    const movedNode = { ...sourceNode, id: sourceNode.id }; // Keep ID for cut? Or new ID? Usually keep. 
                    // If we keep ID, we might have issues if we didn't fully remove it first? 
                    // We removed it above.
                    newFiles = insertIntoParent(newFiles, parentId, movedNode);
                }

                return {
                    files: newFiles,
                    clipboard: mode === 'cut' ? null : state.clipboard // clear clipboard after cut, keep for copy
                };
            }),
        }),
        {
            name: 'deexen-file-storage', // unique name
            // Explicitly do NOT persist 'files' for now if user wants clean slate logic, BUT user asked for 'project name, files'.
            // So we persist everything relevant.
            partialize: (state) => ({
                files: state.files,
                openFiles: state.openFiles,
                activeFileId: state.activeFileId,
                projectName: state.projectName
            }),
        }
    )
);

export const getFileBreadcrumbs = (files: FileNode[], targetId: string): string => {
    const findPath = (nodes: FileNode[], currentPath: string[]): string[] | null => {
        for (const node of nodes) {
            if (node.id === targetId) {
                return [...currentPath, node.name];
            }
            if (node.children) {
                const result = findPath(node.children, [...currentPath, node.name]);
                if (result) return result;
            }
        }
        return null;
    };

    // We start searching from the children of root (assuming root is the container)
    // The structure is files[0] -> root. files[0].children -> project folders (e.g. deexen-frontend-...)
    // Actually, looking at initialFiles:
    // id: 'root', children: [ { id: 'src', name: 'src', ... } ]
    // So if we pass files, we should probably start searching.
    // However, the user request mentioned "deexen-frontend -- src...".
    // If we look at existing UI: "deexen-frontend" is static, "src/App.tsx" is static.
    // So likely "deexen-frontend" is the repo name/root folder name.

    // Let's just traverse and build the full path.
    const path = findPath(files, []);

    if (!path) return '';

    // Filter out 'root' if it's the top level implementation detail
    const filteredPath = path.filter(p => p !== 'root');

    // If the path is empty (e.g. root selected?), return empty
    if (filteredPath.length === 0) return '';

    // Join with slash
    return filteredPath.join('/');
};
