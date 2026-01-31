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

    // Tour State
    hasSeenDashboardTour: boolean;
    hasSeenWorkspaceTour: boolean;
    completeDashboardTour: () => void;
    completeWorkspaceTour: () => void;
    resetTours: () => void;
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

            // Tour State
            hasSeenDashboardTour: false,
            hasSeenWorkspaceTour: false,
            completeDashboardTour: () => set({ hasSeenDashboardTour: true }),
            completeWorkspaceTour: () => set({ hasSeenWorkspaceTour: true }),
            resetTours: () => set({ hasSeenDashboardTour: false, hasSeenWorkspaceTour: false }),
        }),
        {
            name: 'deexen-layout-storage',
        }
    )
);
