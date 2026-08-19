import { jobCharacteristicRows } from '../../utils/jobDisplay'
import styles from './AdDescription.module.css'

export default function AdJobCharacteristics({ ad, lang }) {
  const rows = jobCharacteristicRows(ad, lang)
  if (!rows.length) return null
  return (
    <>
      {rows.map((row) => (
        <div key={row.label} className={styles.charRow}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </>
  )
}
