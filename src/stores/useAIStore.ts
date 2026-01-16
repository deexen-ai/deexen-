import { create } from 'zustand';
import type { AIMode } from '@/config/aiModes';

export interface AIResponse {
    mode: AIMode;
    response: string;
    timestamp: number;
    codeAnalyzed: string;
}

interface AIStore {
    // State
    selectedMode: AIMode;
    isLoading: boolean;
    error: string | null;
    response: AIResponse | null;
    history: AIResponse[];

    // Actions
    setMode: (mode: AIMode) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setResponse: (response: AIResponse) => void;
    addToHistory: (response: AIResponse) => void;
    clearResponse: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
    selectedMode: 'debug',
    isLoading: false,
    error: null,
    response: null,
    history: [],

    setMode: (mode) =>
        set({
            selectedMode: mode,
            response: null,
            error: null,
        }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error, isLoading: false }),

    setResponse: (response) =>
        set({ response, isLoading: false, error: null }),

    addToHistory: (response) =>
        set((state) => ({
            history: [response, ...state.history].slice(0, 20),
        })),

    clearResponse: () => set({ response: null, error: null }),
}));
