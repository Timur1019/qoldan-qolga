import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useLang } from './LangContext'
import { registerToastHandler } from '../utils/toastBus'
import { formatApiError } from '../utils/apiError'
import styles from './ToastContext.module.css'

const ToastContext = createContext(null)
const TOAST_DURATION = 4200

const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

export function ToastProvider({ children }) {
  const { t } = useLang()
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setToast(null)
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    if (!message) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type, code: null })
    timerRef.current = setTimeout(() => {
      setToast(null)
      timerRef.current = null
    }, TOAST_DURATION)
  }, [])

  const showApiError = useCallback((err) => {
    const message = formatApiError(err, t)
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type: 'error', code: err?.code || null })
    timerRef.current = setTimeout(() => {
      setToast(null)
      timerRef.current = null
    }, TOAST_DURATION)
  }, [t])

  useEffect(() => {
    registerToastHandler((type, payload) => {
      if (type === 'error' && payload && typeof payload === 'object') {
        showApiError(payload)
        return
      }
      showToast(payload, type || 'info')
    })
    return () => registerToastHandler(null)
  }, [showToast, showApiError])

  return (
    <ToastContext.Provider value={{ showToast, showApiError, hideToast }}>
      {children}
      {toast != null && (
        <div
          className={`${styles.toast} ${styles[toast.type] || styles.info}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <i className={`bi ${ICONS[toast.type] || ICONS.info} ${styles.icon}`} aria-hidden />
          <div className={styles.body}>
            <span>{toast.message}</span>
            {toast.code ? <span className={styles.code}>{toast.code}</span> : null}
          </div>
          <button type="button" className={styles.close} onClick={hideToast} aria-label={t('common.close')}>
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { showToast: () => {}, showApiError: () => {}, hideToast: () => {} }
  return ctx
}
