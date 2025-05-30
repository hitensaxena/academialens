import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UIState = {
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // Toast notifications
  toasts: Array<{
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    duration?: number;
  }>;
  addToast: (toast: Omit<UIState['toasts'][number], 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal state
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      isSidebarOpen: true,
      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),

      // Toast state
      toasts: [],
      addToast: toast => {
        const id = Math.random().toString(36).substring(2, 9);
        set(state => ({
          toasts: [...state.toasts, { ...toast, id, duration: toast.duration || 5000 }],
        }));

        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 5000);
        }
      },
      removeToast: id =>
        set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Modal state
      modals: {},
      openModal: id =>
        set(state => ({
          modals: { ...state.modals, [id]: true },
        })),
      closeModal: id =>
        set(state => ({
          modals: { ...state.modals, [id]: false },
        })),
      toggleModal: id =>
        set(state => ({
          modals: { ...state.modals, [id]: !state.modals[id] },
        })),
    }),
    {
      name: 'ui-storage',
      partialize: state => ({
        // Only persist sidebar state
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
);

// Toast helper functions
export const toast = {
  success: (title: string, description?: string, duration = 5000) =>
    useUIStore.getState().addToast({ title, description, variant: 'success', duration }),
  error: (title: string, description?: string, duration = 5000) =>
    useUIStore.getState().addToast({ title, description, variant: 'destructive', duration }),
  warning: (title: string, description?: string, duration = 5000) =>
    useUIStore.getState().addToast({ title, description, variant: 'warning', duration }),
  info: (title: string, description?: string, duration = 5000) =>
    useUIStore.getState().addToast({ title, description, variant: 'default', duration }),
};
