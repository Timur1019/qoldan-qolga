import { isBusinessLikeSellerType, normalizeSellerType, SELLER_TYPE } from '../../../constants/sellerTypes'

/** Магазин / бизнес-аккаунт: storeVerified или тип STORE (legacy BUSINESS). */
export function isSellerStore(adOrProfile) {
  if (!adOrProfile) return false
  if (adOrProfile.sellerIsStore === true || adOrProfile.storeVerified === true) return true
  const type = normalizeSellerType(adOrProfile.sellerType)
  return type === SELLER_TYPE.STORE
}

/** Любой не-частный тип продавца. */
export function isBusinessSeller(adOrProfile) {
  if (!adOrProfile) return false
  if (adOrProfile.sellerIsStore === true || adOrProfile.storeVerified === true) return true
  return isBusinessLikeSellerType(adOrProfile.sellerType)
}
