import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { referenceApi } from '../../api/client'
import { invalidateCachedGet } from '../../api/ttlCache'
import { dismissBannerForAWhile, isBannerDismissed } from './topAdStripDismiss'

function pickBanner(list) {
  const items = Array.isArray(list) ? list : []
  return items.find((b) => b?.id && !isBannerDismissed(b.id)) || null
}

export function useTopAdStrip() {
  const { isAuthenticated } = useAuth()
  const [banner, setBanner] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = () => {
      invalidateCachedGet('site-top-banners')
      referenceApi
        .getSiteTopBanners()
        .then((list) => {
          if (!cancelled) setBanner(pickBanner(list))
        })
        .catch(() => {
          if (!cancelled) setBanner(null)
        })
        .finally(() => {
          if (!cancelled) setReady(true)
        })
    }
    run()
    const onVisible = () => {
      if (document.visibilityState === 'visible') run()
    }
    const timer = window.setInterval(run, 60 * 1000)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [isAuthenticated])

  const dismiss = () => {
    if (!banner?.id) return
    dismissBannerForAWhile(banner.id)
    setBanner(null)
  }

  return { banner, ready, dismiss }
}
