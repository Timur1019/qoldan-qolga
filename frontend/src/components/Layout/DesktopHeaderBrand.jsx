import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import styles from './DesktopHeaderBrand.module.css'

export default function DesktopHeaderBrand({ categoryTitle }) {
  return (
    <Link to={ROUTES.HOME} className={styles.brand}>
      <span className={styles.logo}>Qoldan Qolga</span>
      {categoryTitle ? <span className={styles.section}>{categoryTitle}</span> : null}
    </Link>
  )
}
