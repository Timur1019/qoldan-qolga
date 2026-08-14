import { useEffect } from 'react'
import { useLang } from '../../context/LangContext'
import ScrollTop from '../../components/ui/ScrollTop'
import { LEGAL_DOCS } from './documents'
import RulesBreadcrumbs from './components/RulesBreadcrumbs'
import RulesDocCard from './components/RulesDocCard'
import styles from './Rules.module.css'

/** @param {{ embedded?: boolean }} props — embedded: внутри dashboard (сайдбар профиля) */
export default function Rules({ embedded = false }) {
  const { t, lang } = useLang()

  useEffect(() => {
    document.title = t('rules.pageTitle')
    return () => {
      document.title = 'Qoldan Qolga'
    }
  }, [t])

  return (
    <div className={embedded ? styles.embedded : styles.page}>
      <div className={styles.inner}>
        {!embedded ? <RulesBreadcrumbs t={t} /> : null}
        <header className={styles.header}>
          <h1 className={styles.title}>{t('rules.pageTitle')}</h1>
          <p className={styles.lead}>{t('rules.subtitle')}</p>
        </header>
        <div className={styles.list}>
          {LEGAL_DOCS.map((doc, index) => (
            <RulesDocCard key={doc.slug} doc={doc} lang={lang} index={index} />
          ))}
        </div>
      </div>
      {!embedded ? <ScrollTop /> : null}
    </div>
  )
}
