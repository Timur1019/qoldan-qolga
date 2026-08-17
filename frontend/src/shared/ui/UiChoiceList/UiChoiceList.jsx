import styles from './UiChoiceList.module.css'

/**
 * Radio or checkbox list. value: string for radio, string[] for checkbox.
 */
export default function UiChoiceList({
  name,
  type = 'radio',
  options = [],
  value,
  onChange,
}) {
  const selected = type === 'checkbox'
    ? (Array.isArray(value) ? value.map(String) : [])
    : String(value ?? '')

  const handle = (optVal, checked) => {
    if (type === 'radio') {
      onChange?.(optVal)
      return
    }
    const key = String(optVal)
    const next = checked ? [...selected, key] : selected.filter((v) => v !== key)
    onChange?.(next)
  }

  return (
    <div className={styles.list}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const isOn = type === 'checkbox'
          ? selected.includes(String(opt.value))
          : selected === String(opt.value)
        return (
          <label key={id} className={styles.row} htmlFor={id}>
            <input
              id={id}
              type={type}
              name={name}
              checked={isOn}
              onChange={(e) => handle(opt.value, e.target.checked)}
            />
            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
