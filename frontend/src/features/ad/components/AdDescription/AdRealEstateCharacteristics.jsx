import { realEstateCharacteristicRows } from '../../utils/realEstateDisplay'
import styles from './AdDescription.module.css'

export default function AdRealEstateCharacteristics({ ad, t }) {
  const rows = realEstateCharacteristicRows(ad, t)
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
