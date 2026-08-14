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
      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error}
        </div>
      )}
      <p className={styles.hint}>{labels.phoneHint}</p>
      <div className="mb-3">
        <label className="form-label" htmlFor="auth-phone">
          {labels.phone}
        </label>
        <div className={styles.phoneRow}>
          <span className={styles.prefix} aria-hidden>
            +998
          </span>
          <input
            id="auth-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="90 123 45 67"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
            className={`form-control ${styles.phoneInput}`}
          />
        </div>
      </div>
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
      <button type="submit" disabled={submitting} className="btn btn-primary w-100">
        {submitting ? labels.loading : labels.sendCode}
      </button>
    </form>
  )
}
