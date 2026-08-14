import useVehicleSpecOptions from '../../hooks/useVehicleSpecOptions'
import { vehicleCharacteristicRows } from '../../utils/transportDisplay'
import styles from './AdDescription.module.css'

export default function AdVehicleCharacteristics({ ad, lang, t }) {
  const spec = useVehicleSpecOptions()
  const rows = vehicleCharacteristicRows(ad, lang, t, spec)
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
