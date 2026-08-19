import { useEffect, useRef } from 'react'
import { UiAlert, UiButton, UiField } from '@/shared/ui'
import OtpBoxes from '../OtpBoxes/OtpBoxes'
import { useWebOtp } from '../../hooks/useWebOtp'
import { OTP_LENGTH } from '../../constants/otp'
import styles from './PhoneCodeForm.module.css'

export default function PhoneCodeForm({
  phoneMasked,
  code,
  onCodeChange,
  onSubmit,
  onResend,
  onBack,
  resendAfter,
  submitting,
  error,
  debugCode,
  labels,
}) {
  const submitted = useRef('')

  useWebOtp(true, onCodeChange)

  useEffect(() => {
    const next = String(code || '').replace(/\D/g, '')
    if (next.length < OTP_LENGTH || submitting || submitted.current === next) return
    submitted.current = next
    onSubmit()
  }, [code, submitting, onSubmit])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e)
      }}
      className={styles.form}
    >
      {error ? <UiAlert compact>{error}</UiAlert> : null}
      <p className={styles.hint}>
        {labels.codeSentTo} <strong>{phoneMasked}</strong>
      </p>
      {debugCode && (
        <p className={styles.debug}>
          {labels.devCode}: {debugCode}
        </p>
      )}
      <UiField label={labels.code} htmlFor="auth-otp">
        <OtpBoxes value={code} onChange={onCodeChange} disabled={submitting} />
      </UiField>
      <p className={styles.smsHint}>{labels.smsAutofillHint}</p>
      <UiButton type="submit" fullWidth loading={submitting} disabled={submitting || code.length < OTP_LENGTH}>
        {submitting ? labels.loading : labels.confirm}
      </UiButton>
      <div className={styles.actions}>
        <button type="button" className={styles.linkBtn} onClick={onBack} disabled={submitting}>
          {labels.changePhone}
        </button>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onResend}
          disabled={submitting || resendAfter > 0}
        >
          {resendAfter > 0 ? `${labels.resendIn} ${resendAfter}s` : labels.resend}
        </button>
      </div>
    </form>
  )
}
