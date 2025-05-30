"use client"

import * as React from "react"

import { usePathname } from "next/navigation"
import { toast, Toast } from "@/components/ui/toast"

type ToasterPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

interface ToastOptions {
  title: string
  description?: string
  action?: React.ReactNode
  duration?: number
  position?: ToasterPosition
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  const pathname = usePathname()

  const showToast = React.useCallback(
    ({
      title,
      description,
      action,
      duration = 5000,
      position = "bottom-right",
      variant = "default",
    }: ToastOptions) => {
      // Don't show toasts during SSR
      if (typeof window === "undefined") return

      // Don't show toasts on certain pages if needed
      if (pathname?.startsWith("/auth")) return

      const toastId = Math.random().toString(36).substring(2, 9)
      
      const positionClasses = {
        "top-left": "top-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "top-right": "top-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-4 right-4",
      }

      const toastElement = (
        <Toast
          key={toastId}
          className={cn(
            "fixed z-50 w-full max-w-sm p-4 rounded-lg shadow-lg",
            positionClasses[position],
            variant === "destructive" && "bg-destructive text-destructive-foreground",
            variant === "success" && "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50"
          )}
          duration={duration}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <Toast.Title className="text-sm font-medium">{title}</Toast.Title>
              {description && (
                <Toast.Description className="mt-1 text-sm opacity-90">
                  {description}
                </Toast.Description>
              )}
            </div>
            {action && <div className="ml-4">{action}</div>}
            <button
              onClick={() => toast.dismiss(toastId)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </Toast>
      )

      toast.custom(toastElement, {
        id: toastId,
        duration,
      })

      return toastId
    },
    [pathname]
  )

  const showSuccess = React.useCallback(
    (options: Omit<ToastOptions, 'variant'>) =>
      showToast({ ...options, variant: 'success' }),
    [showToast]
  )

  const showError = React.useCallback(
    (options: Omit<ToastOptions, 'variant'>) =>
      showToast({ ...options, variant: 'destructive' }),
    [showToast]
  )

  return {
    toast: showToast,
    success: showSuccess,
    error: showError,
    dismiss: toast.dismiss,
  }
}

// Helper function to handle API errors
export function handleApiError(error: unknown, toast: ReturnType<typeof useToast>) {
  console.error('API Error:', error)
  
  let errorMessage = 'An unexpected error occurred. Please try again.'
  
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message)
  }
  
  toast.error({
    title: 'Error',
    description: errorMessage,
  })
  
  return errorMessage
}

// Helper function to handle success messages
export function showSuccessMessage(
  message: string,
  toast: ReturnType<typeof useToast>,
  title = 'Success!'
) {
  toast.success({
    title,
    description: message,
  })
}

// Helper function to show loading state
export function showLoadingToast(
  message: string,
  toast: ReturnType<typeof useToast>
) {
  return toast({
    title: message,
    description: 'Please wait...',
    duration: 0, // Don't auto-dismiss
  })
}

// Helper to update a loading toast to success/error
export function updateLoadingToast(
  toastId: string,
  type: 'success' | 'error',
  message: string,
  toast: ReturnType<typeof useToast>,
  title?: string
) {
  toast.dismiss(toastId)
  
  if (type === 'success') {
    showSuccessMessage(message, toast, title)
  } else {
    toast.error({
      title: title || 'Error',
      description: message,
    })
  }
}
