import { UiAlert, UiButton, UiField, UiInput } from '@/shared/ui'
import styles from './PhoneAuthForm.module.css'

export default function PhoneAuthForm({
  phone,
  onPhoneChange,
  onSubmit,
  submitting,
  error,
  rememberMe,
  onRememberMeChange,
  labels,
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error ? <UiAlert compact>{error}</UiAlert> : null}
      <p className={styles.hint}>{labels.phoneHint}</p>
      <UiField label={labels.phone} htmlFor="auth-phone">
        <div className={styles.phoneRow}>
          <span className={styles.prefix} aria-hidden>
            +998
          </span>
          <UiInput
            id="auth-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="90 123 45 67"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
            className={styles.phoneInput}
          />
        </div>
      </UiField>
      {onRememberMeChange && (
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="auth-remember-phone"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="auth-remember-phone">
            {labels.rememberMe}
          </label>
        </div>
      )}
      <UiButton type="submit" fullWidth loading={submitting}>
        {submitting ? labels.loading : labels.sendCode}
      </UiButton>
    </form>
  )
}
