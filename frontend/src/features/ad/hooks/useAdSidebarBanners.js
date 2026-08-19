import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'

export default function useAdSidebarBanners() {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    referenceApi
      .getAdSidebarBanners()
      .then((list) => setBanners(Array.isArray(list) ? list : []))
      .catch(() => setBanners([]))
  }, [])

  return banners
}
