import { OTP_LENGTH } from '../../constants/otp'
import styles from './OtpBoxes.module.css'

export default function OtpBoxes({ value, onChange, autoFocus = true, disabled = false }) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, OTP_LENGTH).split('')
  const activeIndex = Math.min(digits.length, OTP_LENGTH - 1)

  return (
    <div className={styles.wrap}>
      <input
        className={styles.autofill}
        id="auth-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={String(value || '').replace(/\D/g, '').slice(0, OTP_LENGTH)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label="SMS code"
      />
      <div className={styles.row} aria-hidden>
        {Array.from({ length: OTP_LENGTH }, (_, i) => {
          const filled = Boolean(digits[i])
          const active = i === activeIndex
          return (
            <div key={i} className={`${styles.box} ${filled || active ? styles.boxOn : ''}`}>
              {filled ? digits[i] : active ? <span className={styles.caret} /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
