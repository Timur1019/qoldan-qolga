import { useId, useRef, useState } from 'react'
import { ACCEPT_DOCS, MAX_FILE_MB } from '../businessFormOptions'
import styles from './FileDropZone.module.css'

export default function FileDropZone({ name, label, required, icon, fileHint }) {
  const inputId = useId()
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState('')

  const applyFile = (file) => {
    setLocalError('')
    if (!file) {
      setFileName('')
      return
    }
    const maxBytes = MAX_FILE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      setLocalError(`Максимум ${MAX_FILE_MB} МБ`)
      setFileName('')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setFileName(file.name)
  }

  const onChange = (e) => {
    applyFile(e.target.files?.[0])
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file || !inputRef.current) return
    const dt = new DataTransfer()
    dt.items.add(file)
    inputRef.current.files = dt.files
    applyFile(file)
  }

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
        {required ? <span className={styles.req}> *</span> : null}
      </label>
      <label
        htmlFor={inputId}
        className={`${styles.zone} ${dragOver ? styles.dragOver : ''} ${fileName ? styles.hasFile : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <span className={styles.zoneIcon} aria-hidden>
          {icon}
        </span>
        <span className={styles.zoneTitle}>
          {fileName || 'Нажмите или перетащите файл'}
        </span>
        <span className={styles.zoneHint}>
          {fileHint || `PNG, JPG, PDF до ${MAX_FILE_MB} МБ`}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          className={styles.input}
          accept={ACCEPT_DOCS}
          required={required}
          onChange={onChange}
        />
      </label>
      {localError ? <p className={styles.error}>{localError}</p> : null}
    </div>
  )
}
