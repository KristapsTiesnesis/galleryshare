'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  show: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <Toaster/>')
  return ctx
}

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const value = useMemo<ToastContextValue>(() => ({
    toasts,
    show: (t) => {
      const toast: Toast = { id: Math.random().toString(36).slice(2), type: 'info', ...t }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== toast.id))
      }, 3500)
    },
    dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  }), [toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Card key={t.id} className={`min-w-[260px] ${variantClass(t.type)}`}>
            <CardContent className="p-3">
              {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
              {t.description && <div className="text-sm text-gray-700">{t.description}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function variantClass(type: ToastType = 'info') {
  if (type === 'success') return 'border-green-200'
  if (type === 'error') return 'border-red-200'
  return 'border-gray-200'
}


