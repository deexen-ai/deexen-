import { create } from 'zustand';
import type { ReactNode } from 'react';

export interface TerminalLine {
    id: number;
    content: ReactNode;
}

interface TerminalState {
    history: TerminalLine[];
    activeTab: 'terminal' | 'output' | 'problems';
    addToHistory: (content: ReactNode) => void;
    clearHistory: () => void;
    setActiveTab: (tab: 'terminal' | 'output' | 'problems') => void;
}

let lineCounter = 0;

export const useTerminalStore = create<TerminalState>((set) => ({
    history: [
        { id: ++lineCounter, content: "Welcome to Deexen Terminal" }
    ],
    activeTab: 'terminal',
    addToHistory: (content) => set((state) => ({
        history: [...state.history, { id: ++lineCounter, content }]
    })),
    clearHistory: () => set({ history: [] }),
    setActiveTab: (tab) => set({ activeTab: tab })
}));
