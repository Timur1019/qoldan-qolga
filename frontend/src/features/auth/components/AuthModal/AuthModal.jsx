import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/context/ToastContext'
import { formatApiError } from '@/utils/apiError'
import { PARAMS, ROUTES } from '@/constants/routes'
import { usePhoneAuth } from '../../hooks/usePhoneAuth'
import PhoneAuthForm from './PhoneAuthForm'
import PhoneCodeForm from './PhoneCodeForm'
import styles from './AuthModal.module.css'

function applyAuthSession(setAuth, res, rememberMe = true) {
  setAuth(
    res.token,
    {
      id: res.userId,
      email: res.email,
      phone: res.phone,
      displayName: res.displayName,
      role: res.role || 'USER',
      avatar: res.avatar,
    },
    rememberMe,
  )
}

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setAuth, refreshUser } = useAuth()
  const { t } = useLang()
  const { showToast, showApiError } = useToast()
  const [rememberMe, setRememberMe] = useState(true)
  const phoneAuth = usePhoneAuth()

  useEffect(() => {
    if (open) {
      phoneAuth.reset()
      setRememberMe(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when modal opens
  }, [open])

  const redirectTo = searchParams.get(PARAMS.FROM) || ROUTES.DASHBOARD

  const handleClose = () => {
    phoneAuth.reset()
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.AUTH)
      next.delete(PARAMS.FROM)
      return next
    }, { replace: true })
    onClose()
  }

  const finishAuth = async (res, toastKey) => {
    applyAuthSession(setAuth, res, rememberMe)
    await refreshUser()
    showToast(t(toastKey), 'success')
    handleClose()
    navigate(redirectTo, { replace: true })
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    phoneAuth.setError('')
    try {
      await phoneAuth.sendCode()
    } catch (err) {
      phoneAuth.setError(formatApiError(err, t))
      showApiError(err)
    }
  }

  const handleVerifyCode = async (e) => {
    e?.preventDefault?.()
    phoneAuth.setError('')
    try {
      const res = await phoneAuth.verifyCode()
      const toastKey = res.newUser ? 'notify.registerSuccess' : 'notify.loginSuccess'
      await finishAuth(res, toastKey)
    } catch (err) {
      phoneAuth.setError(formatApiError(err, t))
      showApiError(err)
    }
  }

  const handleResend = async () => {
    phoneAuth.setError('')
    try {
      await phoneAuth.resendCode()
    } catch (err) {
      phoneAuth.setError(formatApiError(err, t))
      showApiError(err)
    }
  }

  const labels = {
    rememberMe: t('auth.rememberMe'),
    loading: t('common.loading'),
    phone: t('auth.phone'),
    phoneHint: t('auth.phoneHint'),
    sendCode: t('auth.sendCode'),
    code: t('auth.code'),
    codeSentTo: t('auth.codeSentTo'),
    confirm: t('auth.confirmCode'),
    changePhone: t('auth.changePhone'),
    resend: t('auth.resendCode'),
    resendIn: t('auth.resendIn'),
    devCode: t('auth.devCode'),
    smsAutofillHint: t('auth.smsAutofillHint'),
  }

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className={`app-card ${styles.modal}`}>
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 p-2 text-secondary text-decoration-none"
          style={{ top: '0.5rem', right: '0.5rem' }}
          onClick={handleClose}
          aria-label={t('common.cancel')}
        >
          <i className="bi bi-x-lg" aria-hidden />
        </button>
        <h2 id="auth-modal-title" className="h4 mb-4">
          {t('auth.phoneTitle')}
        </h2>

        {phoneAuth.step === 'phone' && (
          <PhoneAuthForm
            phone={phoneAuth.phone}
            onPhoneChange={phoneAuth.setPhone}
            onSubmit={handleSendCode}
            submitting={phoneAuth.submitting}
            error={phoneAuth.error}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
            labels={labels}
          />
        )}

        {phoneAuth.step === 'code' && (
          <PhoneCodeForm
            phoneMasked={phoneAuth.phoneMasked}
            code={phoneAuth.code}
            onCodeChange={phoneAuth.setCode}
            onSubmit={handleVerifyCode}
            onResend={handleResend}
            onBack={() => {
              phoneAuth.setStep('phone')
              phoneAuth.setError('')
            }}
            resendAfter={phoneAuth.resendAfter}
            submitting={phoneAuth.submitting}
            error={phoneAuth.error}
            debugCode={phoneAuth.debugCode}
            labels={labels}
          />
        )}
      </div>
    </div>
  )
}
