import { UiAlert, UiButton, UiField, UiInput } from '@/shared/ui'
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
  return (
    <form onSubmit={onSubmit} className={styles.form}>
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
        <UiInput
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
          required
          className={`text-center ${styles.codeInput}`}
          autoFocus
        />
      </UiField>
      <UiButton type="submit" fullWidth loading={submitting} disabled={submitting || code.length < 4}>
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
