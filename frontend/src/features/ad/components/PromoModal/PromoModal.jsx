import PromoAdPreview from './PromoAdPreview'
import PromoPlanCard from './PromoPlanCard'
import usePromoCheckout from './usePromoCheckout'
import { useLang } from '../../../../context/LangContext'
import styles from './PromoModal.module.css'

export default function PromoModal({ ad, onClose }) {
  const { t } = useLang()
  const {
    plans,
    loadingPlans,
    selectedCode,
    setSelectedCode,
    provider,
    setProvider,
    submitting,
    error,
    setError,
    submit,
    isUz,
  } = usePromoCheckout(ad)

  if (!ad) return null

  const day1 = plans.find((p) => p.code === 'day1')
  const week7 = plans.find((p) => p.code === 'week7')
  const month30 = plans.find((p) => p.code === 'month30')
  const premium = plans.find((p) => p.code === 'premium')
  const otherPlans = plans.filter((p) => !['day1', 'week7', 'month30', 'premium'].includes(p.code))

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="promo-modal-title" className={styles.title}>{t('ads.promoModalTitle')}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.cancel')}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.sectionLabel}>{t('ads.promoYourAd')}</p>
          <PromoAdPreview ad={ad} />

          {loadingPlans ? (
            <p className={styles.loading}>{t('common.loading')}</p>
          ) : (
            <>
              <div className={styles.grid}>
                {day1 ? (
                  <PromoPlanCard
                    plan={day1}
                    selected={selectedCode === day1.code}
                    onSelect={(code) => { setSelectedCode(code); setError('') }}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {week7 ? (
                  <PromoPlanCard
                    plan={week7}
                    selected={selectedCode === week7.code}
                    onSelect={(code) => { setSelectedCode(code); setError('') }}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {month30 ? (
                  <PromoPlanCard
                    plan={month30}
                    selected={selectedCode === month30.code}
                    onSelect={(code) => { setSelectedCode(code); setError('') }}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ) : null}
                {otherPlans.map((plan) => (
                  <PromoPlanCard
                    key={plan.code}
                    plan={plan}
                    selected={selectedCode === plan.code}
                    onSelect={(code) => { setSelectedCode(code); setError('') }}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                  />
                ))}
              </div>

              {premium ? (
                <div className={styles.premiumWrap}>
                  <PromoPlanCard
                    plan={premium}
                    selected={selectedCode === premium.code}
                    onSelect={(code) => { setSelectedCode(code); setError('') }}
                    isUz={isUz}
                    selectLabel={t('ads.promoSelectPlan')}
                    featured
                  />
                </div>
              ) : null}
            </>
          )}

          <div className={styles.providers}>
            <p className={styles.sectionLabel}>{t('ads.promoPayWith')}</p>
            <div className={styles.providerRow}>
              <label className={`${styles.provider} ${provider === 'PAYME' ? styles.providerActive : ''}`}>
                <input
                  type="radio"
                  name="promoProvider"
                  checked={provider === 'PAYME'}
                  onChange={() => setProvider('PAYME')}
                />
                Payme
              </label>
              <label className={`${styles.provider} ${provider === 'CLICK' ? styles.providerActive : ''}`}>
                <input
                  type="radio"
                  name="promoProvider"
                  checked={provider === 'CLICK'}
                  onChange={() => setProvider('CLICK')}
                />
                Click
              </label>
            </div>
          </div>

          {error ? (
            <p className={styles.error} role="alert">{error}</p>
          ) : null}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.payBtn}
            onClick={submit}
            disabled={submitting || loadingPlans}
          >
            {submitting ? t('common.loading') : t('ads.promoPromoteBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
