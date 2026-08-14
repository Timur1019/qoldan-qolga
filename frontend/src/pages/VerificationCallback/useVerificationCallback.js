import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/client'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { useToast } from '../../context/ToastContext'

export function useVerificationCallback() {
  const { t } = useLang()
  const { refreshUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const authCode = params.get('auth_code') || params.get('code')
    const sessionId = params.get('session_id') || params.get('sessionId')
    const providerError = params.get('error') || params.get('error_description') || params.get('message')

    if (providerError && !authCode) {
      setError(providerError)
      return
    }
    if (!authCode || !sessionId) {
      setError(t('profile.verificationCallbackMissing'))
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const result = await authApi.completeVerification({ authCode, sessionId })
        await refreshUser()
        if (cancelled) return
        showToast(result?.message || t('profile.verificationCallbackSuccess'))
        navigate(ROUTES.PROFILE_EDIT, { replace: true })
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || t('profile.verificationCallbackError'))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate, params, refreshUser, showToast, t])

  return { error }
}
