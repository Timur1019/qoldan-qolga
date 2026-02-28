import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

const TOAST_DURATION = 3500

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(msg)
    timerRef.current = setTimeout(() => {
      setMessage(null)
      timerRef.current = null
    }, TOAST_DURATION)
  }, [])

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setMessage(null)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {message != null && (
        <div
          className="toast-notification position-fixed bottom-0 end-0 m-3 p-3 rounded shadow app-card d-flex align-items-center gap-2"
          role="status"
          aria-live="polite"
          style={{
            zIndex: 10000,
            maxWidth: '90vw',
            backgroundColor: 'var(--color-bg-card, #ffffff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            fontSize: 'var(--font-size-body, 15px)',
            fontWeight: 500,
            color: 'var(--color-text, #111827)',
          }}
        >
          <i className="bi bi-check-circle-fill text-success" aria-hidden />
          <span>{message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { showToast: () => {}, hideToast: () => {} }
  return ctx
}
