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
      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error}
        </div>
      )}
      <p className={styles.hint}>
        {labels.codeSentTo} <strong>{phoneMasked}</strong>
      </p>
      {debugCode && (
        <p className={styles.debug}>
          {labels.devCode}: {debugCode}
        </p>
      )}
      <div className="mb-3">
        <label className="form-label" htmlFor="auth-otp">
          {labels.code}
        </label>
        <input
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
          required
          className={`form-control text-center ${styles.codeInput}`}
          autoFocus
        />
      </div>
      <button type="submit" disabled={submitting || code.length < 4} className="btn btn-primary w-100">
        {submitting ? labels.loading : labels.confirm}
      </button>
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
