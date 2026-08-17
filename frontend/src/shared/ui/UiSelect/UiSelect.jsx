import styles from './UiSelect.module.css'

export default function UiSelect({
  options = [],
  placeholder = '—',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <select
      className={[
        styles.select,
        size === 'sm' ? styles.sm : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children || (
        <>
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </>
      )}
    </select>
  )
}

export function UiSelectTrigger({
  className = '',
  placeholder = false,
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={[styles.select, styles.trigger, placeholder ? styles.placeholder : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
