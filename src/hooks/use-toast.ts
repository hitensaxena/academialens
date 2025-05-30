'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { toast as showToast } from '@/components/ui/toast/use-toast';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastReturn = {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastOptions>) => void;
};

type UseToastReturn = {
  toast: (options: ToastOptions) => ToastReturn;
  success: (title: string, description?: string) => ToastReturn;
  error: (title: string, description?: string) => ToastReturn;
  dismiss: (toastId?: string) => void;
};

// Create a type for the toast function with dismiss method
interface ToastFunction {
  (options: ToastOptions): ToastReturn;
  dismiss: (toastId?: string) => void;
}

export function useToast(): UseToastReturn {
  const pathname = usePathname();

  // Helper to show a toast with the given options
  const toast = React.useCallback(
    (options: ToastOptions): ToastReturn => {
      // Don't show toasts during SSR or on auth pages
      if (typeof window === 'undefined' || pathname?.startsWith('/auth')) {
        return {
          id: '',
          dismiss: () => {},
          update: () => {},
        };
      }

      // Type assertion to handle the toast function
      const toastFn = showToast as unknown as ToastFunction;

      return toastFn({
        title: options.title,
        description: options.description,
        variant: options.variant || 'default',
      });
    },
    [pathname],
  );

  // Success toast helper
  const success = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        title,
        description,
        variant: 'success',
      });
    },
    [toast],
  );

  // Error toast helper
  const error = React.useCallback(
    (title: string, description?: string) => {
      return toast({
        title,
        description,
        variant: 'destructive',
      });
    },
    [toast],
  );

  // Dismiss toast by ID
  const dismiss = React.useCallback((toastId?: string) => {
    if (typeof window !== 'undefined') {
      const toastFn = showToast as unknown as { dismiss: (toastId?: string) => void };
      toastFn.dismiss?.(toastId);
    }
  }, []);

  // Return the toast methods
  return {
    toast,
    success,
    error,
    dismiss,
  };
}

// Helper function to handle API errors
export function handleApiError(error: unknown, toastInstance: ReturnType<typeof useToast>): string {
  console.error('API Error:', error);

  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message);
  }

  toastInstance.error('Error', errorMessage);
  return errorMessage;
}

// Helper function to show success state
export function showSuccessToast(
  title: string,
  message: string,
  toastInstance: ReturnType<typeof useToast>,
) {
  toastInstance.success(title, message);
}

// Helper function to show loading state
export function showLoadingToast(message: string, toastInstance: ReturnType<typeof useToast>) {
  return toastInstance.toast({
    title: message,
    description: 'Please wait...',
    duration: 0, // Don't auto-dismiss
  });
}

// Helper to update a loading toast to success/error
export function updateLoadingToast(
  toastId: string,
  type: 'success' | 'error',
  message: string,
  toastInstance: ReturnType<typeof useToast>,
  title?: string,
) {
  toastInstance.dismiss(toastId);

  if (type === 'success') {
    toastInstance.success(title || 'Success', message);
  } else {
    toastInstance.error(title || 'Error', message);
  }
}
