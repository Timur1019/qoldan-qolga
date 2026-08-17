import styles from './UiButton.module.css'

const VARIANTS = {
  primary: styles.primary,
  outline: styles.outline,
  danger: styles.danger,
  ghost: styles.ghost,
}

const SIZES = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export default function UiButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  type = 'button',
  className = '',
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        VARIANTS[variant] || styles.primary,
        SIZES[size] || styles.md,
        fullWidth ? styles.full : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  )
}
