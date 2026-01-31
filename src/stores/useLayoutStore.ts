import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
    isSidebarOpen: boolean;
    isTerminalOpen: boolean;
    isAIPanelOpen: boolean;

    toggleSidebar: () => void;
    toggleTerminal: () => void;
    toggleAIPanel: () => void;

    setSidebarOpen: (isOpen: boolean) => void;
    setTerminalOpen: (isOpen: boolean) => void;
    setAIPanelOpen: (isOpen: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            isSidebarOpen: true,
            isTerminalOpen: true,
            isAIPanelOpen: true,

            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
            toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),

            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
            setTerminalOpen: (isOpen) => set({ isTerminalOpen: isOpen }),
            setAIPanelOpen: (isOpen) => set({ isAIPanelOpen: isOpen }),
        }),
        {
            name: 'deexen-layout-storage',
        }
    )
);
