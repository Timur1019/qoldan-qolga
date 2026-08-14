import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { ROUTES } from '../../constants/routes'
import ScrollTop from '../../components/ui/ScrollTop'
import { getLegalDoc } from './documents'
import { formatDocDate, loc } from './loc'
import RulesBreadcrumbs from './components/RulesBreadcrumbs'
import RulesToc from './components/RulesToc'
import RulesArticle from './components/RulesArticle'
import styles from './RuleDocument.module.css'

export default function RuleDocument() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const doc = getLegalDoc(slug)

  useEffect(() => {
    document.title = doc ? loc(lang, doc.title) : t('rules.notFound')
    return () => {
      document.title = 'Qoldan Qolga'
    }
  }, [doc, lang, t])

  if (!doc) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <RulesBreadcrumbs t={t} />
          <h1 className={styles.title}>{t('rules.notFound')}</h1>
          <Link to={ROUTES.RULES} className={styles.back}>{t('rules.backToList')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <RulesBreadcrumbs t={t} current={loc(lang, doc.title)} />
        <header className={styles.header}>
          <h1 className={styles.title}>{loc(lang, doc.title)}</h1>
          <p className={styles.meta}>
            {loc(lang, doc.city)} · {t('rules.updated')} {formatDocDate(doc.updated, lang)}
          </p>
        </header>
        <div className={styles.layout}>
          <RulesToc toc={doc.toc} lang={lang} t={t} />
          <RulesArticle doc={doc} lang={lang} />
        </div>
      </div>
      <ScrollTop />
    </div>
  )
}
