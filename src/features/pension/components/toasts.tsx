'use client';

import { ToastNotification } from '@carbon/react';
import { createContext, useCallback, useContext, useState } from 'react';
import styles from '../portal.module.scss';

interface Toast {
  id: number;
  kind: 'success' | 'info';
  title: string;
}

type Notify = (title: string, kind?: Toast['kind']) => void;

const ToastContext = createContext<Notify | null>(null);

// Carbon toast notifications, stacked under the header.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback<Notify>((title, kind = 'success') => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), kind, title }]);
  }, []);
  const dismiss = (id: number) => setToasts((current) => current.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={styles.toasts} aria-live='polite'>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            kind={toast.kind}
            title={toast.title}
            timeout={5000}
            lowContrast
            onClose={() => {
              dismiss(toast.id);
              return true;
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useNotify() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useNotify must be used inside ToastProvider');
  return notify;
}
