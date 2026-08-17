import styles from './UiToggle.module.css'

export default function UiToggle({ checked, onChange, disabled, className = '', ...rest }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      disabled={disabled}
      className={[styles.toggle, checked ? styles.on : '', className].filter(Boolean).join(' ')}
      onClick={() => onChange?.(!checked)}
      {...rest}
    >
      <span className={styles.knob} />
    </button>
  )
}
