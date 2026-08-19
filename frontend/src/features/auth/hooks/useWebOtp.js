import { useEffect } from 'react'
import { OTP_LENGTH } from '../constants/otp'

/**
 * Chrome / Android WebOTP: OS asks to share the SMS code, then fills the field.
 */
export function useWebOtp(enabled, onCode) {
  useEffect(() => {
    if (!enabled) return undefined
    if (typeof window === 'undefined' || !('OTPCredential' in window) || !navigator.credentials) {
      return undefined
    }
    const ac = new AbortController()
    navigator.credentials
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      })
      .then((otp) => {
        const code = String(otp?.code || '').replace(/\D/g, '').slice(0, OTP_LENGTH)
        if (code) onCode(code)
      })
      .catch(() => {})
    return () => ac.abort()
  }, [enabled, onCode])
}
