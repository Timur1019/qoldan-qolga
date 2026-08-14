import { loc } from '../loc'
import styles from './RulesToc.module.css'

export default function RulesToc({ toc, lang, t }) {
  return (
    <aside className={styles.wrap}>
      <p className={styles.label}>{t('rules.contents')}</p>
      <ul className={styles.list}>
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.link}>
              {loc(lang, item)}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
