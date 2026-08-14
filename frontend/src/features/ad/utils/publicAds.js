/** Системное объявление «Уведомления» — не для публичной ленты. */
export const SYSTEM_AD_ID = '00000000-0000-0000-0000-000000000002'

export function isSystemListingAd(ad) {
  if (!ad?.id) return false
  return ad.id === SYSTEM_AD_ID
}

export function isSystemConversation(conversation) {
  return conversation?.adId === SYSTEM_AD_ID
}

export function filterPublicAds(ads) {
  return (Array.isArray(ads) ? ads : []).filter((ad) => !isSystemListingAd(ad))
}
