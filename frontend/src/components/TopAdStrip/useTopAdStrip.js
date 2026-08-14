import { useEffect, useState } from 'react'
import { referenceApi } from '../../api/client'
import { getDismissedBannerId, setDismissedBannerId } from './topAdStripDismiss'

export function useTopAdStrip() {
  const [banner, setBanner] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    referenceApi
      .getSiteTopBanners()
      .then((list) => {
        if (cancelled) return
        const items = Array.isArray(list) ? list : []
        const dismissed = getDismissedBannerId()
        const next = items.find((b) => b?.id && b.id !== dismissed) || null
        setBanner(next)
      })
      .catch(() => {
        if (!cancelled) setBanner(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const dismiss = () => {
    if (!banner?.id) return
    setDismissedBannerId(banner.id)
    setBanner(null)
  }

  return { banner, ready, dismiss }
}
