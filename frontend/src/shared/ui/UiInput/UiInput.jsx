import styles from './UiInput.module.css'

export default function UiInput({
  multiline = false,
  size = 'md',
  className = '',
  ...rest
}) {
  const cls = [
    styles.input,
    multiline ? styles.textarea : '',
    size === 'sm' ? styles.sm : '',
    className,
  ].filter(Boolean).join(' ')

  if (multiline) {
    return <textarea className={cls} {...rest} />
  }
  return <input className={cls} {...rest} />
}
