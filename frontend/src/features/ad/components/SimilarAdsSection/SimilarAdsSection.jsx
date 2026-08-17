import { useState } from 'react'
import { useLang } from '../../../../context/LangContext'
import useCategoryLabels from '../../hooks/useCategoryLabels'
import AdCard from '../AdCard'
import AdCardGrid from '../AdCardGrid'
import styles from './SimilarAdsSection.module.css'

/**
 * Сворачиваемый блок «Похожие объявления» (по умолчанию закрыт).
 */
export default function SimilarAdsSection({ ads = [] }) {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const categoryLabels = useCategoryLabels(ads, lang)

  if (!ads.length) return null

  return (
    <section className={`${styles.wrap} mt-4`}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.toggleTitle}>{t('ads.similarAds')}</span>
        <span className={styles.toggleMeta}>{ads.length}</span>
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} ${styles.chevron}`} aria-hidden />
      </button>
      {open ? (
        <AdCardGrid variant="cols5">
          {ads.map((item) => (
            <AdCard
              key={item.id}
              ad={item}
              t={t}
              showFavorite={false}
              showCategoryMeta
              categoryLabel={categoryLabels[item.category]}
              showDate={false}
            />
          ))}
        </AdCardGrid>
      ) : null}
    </section>
  )
}
