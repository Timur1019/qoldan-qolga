import { normalizeSellerType, SELLER_TYPE } from '@/constants/sellerTypes';

/** Magazin: storeVerified yoki sellerType STORE (legacy BUSINESS). */
export function isSellerStore(adOrProfile?: {
  sellerIsStore?: boolean | null;
  storeVerified?: boolean | null;
  sellerType?: string | null;
  isStore?: boolean | null;
} | null): boolean {
  if (!adOrProfile) return false;
  if (
    adOrProfile.sellerIsStore === true ||
    adOrProfile.storeVerified === true ||
    adOrProfile.isStore === true
  ) {
    return true;
  }
  const type = normalizeSellerType(adOrProfile.sellerType);
  return type === SELLER_TYPE.STORE;
}
