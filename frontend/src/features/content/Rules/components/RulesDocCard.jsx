import { Link } from 'react-router-dom'
import { rulesDocPath } from '@/constants/routes'
import { loc } from '../loc'
import styles from './RulesDocCard.module.css'

export default function RulesDocCard({ doc, lang, index }) {
  return (
    <Link to={rulesDocPath(doc.slug)} className={styles.card}>
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <span className={styles.icon} aria-hidden>
        <i className={`bi ${doc.icon}`} />
      </span>
      <span className={styles.body}>
        <span className={styles.title}>{loc(lang, doc.title)}</span>
        <span className={styles.summary}>{loc(lang, doc.summary)}</span>
      </span>
      <i className={`bi bi-arrow-right ${styles.arrow}`} aria-hidden />
    </Link>
  )
}
