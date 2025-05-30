import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@prisma/client';

type UserState = {
  // User profile
  user: Omit<User, 'password' | 'emailVerified'> | null;
  setUser: (user: UserState['user']) => void;

  // User preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  setPreference: <K extends keyof UserState['preferences']>(
    key: K,
    value: UserState['preferences'][K],
  ) => void;

  // UI preferences
  ui: {
    sidebarWidth: number;
    isSidebarCollapsed: boolean;
    viewMode: 'grid' | 'list';
  };
  setUIPreference: <K extends keyof UserState['ui']>(key: K, value: UserState['ui'][K]) => void;

  // Reset store
  reset: () => void;
};

const initialState: Omit<UserState, 'setUser' | 'setPreference' | 'setUIPreference' | 'reset'> = {
  user: null,
  preferences: {
    theme: 'system',
    language: 'en-US',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
  },
  ui: {
    sidebarWidth: 240,
    isSidebarCollapsed: false,
    viewMode: 'grid',
  },
};

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      ...initialState,

      setUser: user => set({ user }),

      setPreference: (key, value) =>
        set(state => ({
          preferences: { ...state.preferences, [key]: value },
        })),

      setUIPreference: (key, value) =>
        set(state => ({
          ui: { ...state.ui, [key]: value },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'user-storage',
      // Don't persist the entire user object, only preferences
      partialize: state => ({
        preferences: state.preferences,
        ui: state.ui,
      }),
    },
  ),
);

// Helper function to get user initials
export const getUserInitials = (user: UserState['user']) => {
  if (!user) return '';
  if (user.name) {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return (user.email || '').slice(0, 2).toUpperCase();
};
