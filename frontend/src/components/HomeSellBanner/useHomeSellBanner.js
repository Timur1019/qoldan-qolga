import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'

export default function useHomeSellBanner() {
  const [banner, setBanner] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    referenceApi
      .getHomeSellBanners()
      .then((list) => setBanner(Array.isArray(list) && list[0] ? list[0] : null))
      .catch(() => setBanner(null))
      .finally(() => setLoaded(true))
  }, [])

  return { banner, loaded }
}
