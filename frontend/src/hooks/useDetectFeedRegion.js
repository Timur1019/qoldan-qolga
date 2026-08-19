import { useEffect, useRef } from 'react'
import { detectBrowserLocation } from '@/utils/detectBrowserLocation'
import { FEED_REGION_ALL, readFeedRegion, writeFeedRegion } from '@/utils/feedRegionStorage'

/**
 * On first visit to home/ads, ask for location and put region into the URL.
 */
export default function useDetectFeedRegion({
  regions,
  selectedRegionCode,
  isAdsOrHome,
  lang,
  onApply,
}) {
  const started = useRef(false)

  useEffect(() => {
    if (!isAdsOrHome || started.current) return undefined

    if (selectedRegionCode) {
      started.current = true
      writeFeedRegion(selectedRegionCode)
      return undefined
    }

    const stored = readFeedRegion()
    if (stored === FEED_REGION_ALL) {
      started.current = true
      return undefined
    }
    if (stored) {
      started.current = true
      onApply(stored)
      return undefined
    }
    if (!regions.length) return undefined

    started.current = true
    detectBrowserLocation(regions, lang)
      .then((loc) => {
        if (loc?.regionCode) {
          writeFeedRegion(loc.regionCode)
          onApply(loc.regionCode)
        }
      })
      .catch(() => {})
    return undefined
  }, [regions, selectedRegionCode, isAdsOrHome, lang, onApply])
}
