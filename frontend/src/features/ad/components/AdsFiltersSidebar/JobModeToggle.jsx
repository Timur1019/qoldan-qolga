import { Link, useSearchParams } from 'react-router-dom'
import { JOB_HIRE, JOB_SEEK } from '../../../../constants/jobCategories'
import { adsCategoryPathWithParams } from '../../../../constants/routes'
import styles from './JobFilters.module.css'

export default function JobModeToggle({ lang, flags }) {
  const [searchParams] = useSearchParams()
  const seekActive = flags.seek
  const hireActive = flags.hire
  const seekTo = adsCategoryPathWithParams(JOB_SEEK, searchParams)
  const hireTo = adsCategoryPathWithParams(JOB_HIRE, searchParams)
  return (
    <div className={styles.modeRow}>
      <Link to={seekTo} className={`${styles.modeBtn} ${seekActive ? styles.modeBtnActive : ''}`}>
        {lang === 'ru' ? 'Ищу работу' : 'Ish qidiraman'}
      </Link>
      <Link to={hireTo} className={`${styles.modeBtn} ${hireActive ? styles.modeBtnActive : ''}`}>
        {lang === 'ru' ? 'Ищу сотрудника' : 'Xodim qidiraman'}
      </Link>
    </div>
  )
}
