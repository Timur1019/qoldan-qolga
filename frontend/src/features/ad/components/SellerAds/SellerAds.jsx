import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import useCategoryLabels from '../../hooks/useCategoryLabels'
import AdCard from '../AdCard'
import AdCardGrid from '../AdCardGrid'
import styles from './SellerAds.module.css'

function SellerAds({ ads = [], titleKey = 'ads.sellerAdsTitle' }) {
  const { t, lang } = useLang()
  const categoryLabels = useCategoryLabels(ads, lang)

  if (ads.length === 0) return null

  return (
    <section className={`${styles.wrap} mt-4`}>
      <h2 className="h5 mb-3">{t(titleKey)}</h2>
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
    </section>
  )
}

export default memo(SellerAds)
