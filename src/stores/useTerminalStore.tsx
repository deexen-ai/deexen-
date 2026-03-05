import React from 'react';
import { create } from 'zustand';

/**
 * Terminal Store: Manages shell sessions, command history, and execution logic.
 */

interface TerminalHistoryItem {
    id: number;
    content: React.ReactNode;
}

interface TerminalSession {
    id: number;
    name: string;
    hasWarning?: boolean;
}

interface TerminalState {
    history: TerminalHistoryItem[];
    sessions: TerminalSession[];
    activeSessionId: number;

    // Actions
    addHistory: (content: React.ReactNode) => void;
    clearHistory: () => void;
    addSession: (name: string) => void;
    deleteActiveSession: () => void;
    setActiveSession: (id: number) => void;
    executeCommand: (command: string, projectName: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
    history: [],
    sessions: [
        { id: 1, name: 'e...', hasWarning: true },
        { id: 2, name: 'pwsh' }
    ],
    activeSessionId: 2,

    addHistory: (content) => set((state) => ({
        history: [...state.history, { id: Date.now(), content }]
    })),

    clearHistory: () => set({ history: [] }),

    addSession: (name) => {
        const newId = Date.now();
        set((state) => ({
            sessions: [...state.sessions, { id: newId, name }],
            activeSessionId: newId
        }));
    },

    deleteActiveSession: () => set((state) => {
        const filtered = state.sessions.filter(s => s.id !== state.activeSessionId);
        let newActiveId = state.activeSessionId;
        if (filtered.length > 0) {
            newActiveId = filtered[filtered.length - 1].id;
        } else {
            newActiveId = -1;
        }
        return { sessions: filtered, activeSessionId: newActiveId };
    }),

    setActiveSession: (id) => set({ activeSessionId: id }),

    executeCommand: (command, projectName) => {
        const { addHistory } = get();
        const cmd = command.trim();
        if (!cmd) return;

        // Add the prompt line
        addHistory(
            <span>
                <span className="text-orange-500">$</span>{' '}
                <span className="text-[#cccccc]">{cmd}</span>
            </span>
        );

        const lowerCmd = cmd.toLowerCase();

        if (lowerCmd === 'npm run dev' || lowerCmd === 'run') {
            // Simulated run sequence
            setTimeout(() => {
                addHistory(<span className="text-blue-400 pl-2">Starting development server...</span>);
            }, 300);
            setTimeout(() => {
                addHistory(<span className="text-[#808080] pl-2">&gt; {projectName?.toLowerCase() || 'project'}@0.1.0 dev</span>);
                addHistory(<span className="text-[#808080] pl-2">&gt; vite</span>);
            }, 800);
            setTimeout(() => {
                addHistory(
                    <div className="flex flex-col text-[#808080] pl-2">
                        <span className="text-emerald-400">  VITE v5.0.0  ready in 420 ms</span>
                        <span>  ➜  Local:   <span className="text-cyan-400 underline">http://localhost:5173/</span></span>
                        <span>  ➜  Network: use --host to expose</span>
                        <span>  ➜  press h + enter to show help</span>
                    </div>
                );
            }, 1500);
        } else if (lowerCmd === 'ls') {
            addHistory(
                <div className="flex gap-4 text-[#808080] pl-2">
                    <span>src/</span>
                    <span>public/</span>
                    <span>package.json</span>
                </div>
            );
        } else if (lowerCmd === 'help') {
            addHistory(
                <div className="flex flex-col text-[#808080] pl-2">
                    <span>ls      - List files</span>
                    <span>clear   - Clear terminal</span>
                    <span>run     - Execute active project</span>
                </div>
            );
        } else if (lowerCmd === 'clear') {
            get().clearHistory();
        } else {
            addHistory(<span className="text-red-400 pl-2">Command not found: {cmd}</span>);
        }
    }
}));
