import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { adsApi } from '../../api/client'
import { useLang } from '../../context/LangContext'
import { ROUTES } from '../../constants/routes'
import styles from './PromoResult.module.css'

const POLL_MS = 2000
const MAX_POLLS = 20

export default function PromoResult() {
  const { t } = useLang()
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const isMock = params.get('mock') === '1'

  const [status, setStatus] = useState('PENDING')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setError(t('ads.promoOrderMissing'))
      return undefined
    }

    let cancelled = false
    let polls = 0
    let timer

    const poll = () => {
      adsApi
        .getPromoOrder(orderId)
        .then((order) => {
          if (cancelled) return
          setStatus(order.status || 'PENDING')
          if (order.status === 'PAID' || order.status === 'FAILED' || order.status === 'CANCELLED') {
            return
          }
          polls += 1
          if (polls < MAX_POLLS) {
            timer = setTimeout(poll, POLL_MS)
          }
        })
        .catch((e) => {
          if (!cancelled) setError(e.message || t('common.error'))
        })
    }

    poll()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [orderId, t])

  const completeMock = async () => {
    if (!orderId || busy) return
    setBusy(true)
    setError('')
    try {
      await adsApi.mockCompletePromoPayment(orderId)
      setStatus('PAID')
    } catch (e) {
      setError(e.message || t('common.error'))
    } finally {
      setBusy(false)
    }
  }

  const paid = status === 'PAID'

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {paid ? t('ads.promoResultSuccessTitle') : t('ads.promoResultPendingTitle')}
        </h1>
        <p className={styles.text}>
          {paid ? t('ads.promoResultSuccessText') : t('ads.promoResultPendingText')}
        </p>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}

        {isMock && !paid ? (
          <button type="button" className={styles.mockBtn} onClick={completeMock} disabled={busy}>
            {busy ? t('common.loading') : t('ads.promoMockPayBtn')}
          </button>
        ) : null}

        <div className={styles.actions}>
          <Link to={ROUTES.ADS_MY} className={styles.primary}>
            {t('ads.promoBackToMyAds')}
          </Link>
          <Link to={ROUTES.HOME} className={styles.secondary}>
            {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
