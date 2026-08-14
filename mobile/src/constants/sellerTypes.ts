import {
  isClothingTree,
  isRealEstateTree,
  isServicesTree,
  isTransportParts,
  isTransportTree,
} from '@/constants/categoryTree';
import type { CategoryDto } from '@/types/api';

export const SELLER_TYPE = {
  PRIVATE: 'PRIVATE',
  STORE: 'STORE',
  BUSINESS: 'BUSINESS',
  DEALER: 'DEALER',
  OFFICIAL: 'OFFICIAL',
  SHOWROOM: 'SHOWROOM',
  AGENT: 'AGENT',
  BROKER: 'BROKER',
  DEVELOPER: 'DEVELOPER',
  COMPANY: 'COMPANY',
  SERVICE: 'SERVICE',
  STUDIO: 'STUDIO',
  WHOLESALER: 'WHOLESALER',
  MANUFACTURER: 'MANUFACTURER',
  BREEDER: 'BREEDER',
  FARM: 'FARM',
} as const;

export type SellerTypeCode = (typeof SELLER_TYPE)[keyof typeof SELLER_TYPE];

export function normalizeSellerType(code?: string | null): SellerTypeCode | '' {
  if (!code || typeof code !== 'string') return '';
  const v = code.trim().toUpperCase();
  if (v === SELLER_TYPE.BUSINESS) return SELLER_TYPE.STORE;
  return v as SellerTypeCode;
}

const BUSINESS_LIKE = new Set<string>([
  SELLER_TYPE.STORE,
  SELLER_TYPE.BUSINESS,
  SELLER_TYPE.DEALER,
  SELLER_TYPE.OFFICIAL,
  SELLER_TYPE.SHOWROOM,
  SELLER_TYPE.AGENT,
  SELLER_TYPE.BROKER,
  SELLER_TYPE.DEVELOPER,
  SELLER_TYPE.COMPANY,
  SELLER_TYPE.SERVICE,
  SELLER_TYPE.STUDIO,
  SELLER_TYPE.WHOLESALER,
  SELLER_TYPE.MANUFACTURER,
  SELLER_TYPE.BREEDER,
  SELLER_TYPE.FARM,
]);

export function isBusinessLikeSellerType(code?: string | null) {
  const n = normalizeSellerType(code) || String(code || '').toUpperCase();
  return BUSINESS_LIKE.has(n);
}

export function sellerTypeLabelKey(code?: string | null) {
  const n = normalizeSellerType(code) || SELLER_TYPE.PRIVATE;
  return `ads.sellerTypes.${n}` as const;
}

export function sellerTypeTone(code?: string | null): string {
  const n = normalizeSellerType(code) || SELLER_TYPE.PRIVATE;
  if (n === SELLER_TYPE.PRIVATE) return 'private';
  if (
    n === SELLER_TYPE.DEALER ||
    n === SELLER_TYPE.OFFICIAL ||
    n === SELLER_TYPE.SHOWROOM ||
    n === SELLER_TYPE.DEVELOPER
  ) {
    return 'accent';
  }
  if (n === SELLER_TYPE.AGENT || n === SELLER_TYPE.BROKER) return 'agent';
  if (n === SELLER_TYPE.SERVICE || n === SELLER_TYPE.STUDIO) return 'service';
  if (n === SELLER_TYPE.FARM || n === SELLER_TYPE.BREEDER) return 'farm';
  return 'store';
}

function inTree(categoryCode: string | undefined, breadcrumb: CategoryDto[], roots: string[]) {
  if (!categoryCode) return false;
  if (roots.includes(categoryCode)) return true;
  return breadcrumb.some((c) => roots.includes(c.code));
}

const SETS: Record<string, string[]> = {
  transportVehicle: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.DEALER,
    SELLER_TYPE.OFFICIAL,
    SELLER_TYPE.SHOWROOM,
    SELLER_TYPE.COMPANY,
  ],
  transportParts: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.STORE,
    SELLER_TYPE.DEALER,
    SELLER_TYPE.WHOLESALER,
    SELLER_TYPE.COMPANY,
  ],
  realEstate: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.AGENT,
    SELLER_TYPE.BROKER,
    SELLER_TYPE.DEVELOPER,
    SELLER_TYPE.COMPANY,
  ],
  services: [SELLER_TYPE.PRIVATE, SELLER_TYPE.SERVICE, SELLER_TYPE.STUDIO, SELLER_TYPE.COMPANY],
  animals: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.BREEDER,
    SELLER_TYPE.FARM,
    SELLER_TYPE.STORE,
    SELLER_TYPE.COMPANY,
  ],
  goods: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.STORE,
    SELLER_TYPE.WHOLESALER,
    SELLER_TYPE.MANUFACTURER,
    SELLER_TYPE.COMPANY,
  ],
  default: [SELLER_TYPE.PRIVATE, SELLER_TYPE.STORE, SELLER_TYPE.COMPANY],
};

export function sellerTypesForCategory(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  if (!categoryCode) return SETS.default;

  if (isTransportTree(categoryCode, breadcrumb)) {
    if (isTransportParts(categoryCode, breadcrumb)) return SETS.transportParts;
    return SETS.transportVehicle;
  }
  if (isRealEstateTree(categoryCode, breadcrumb)) return SETS.realEstate;
  if (isServicesTree(categoryCode, breadcrumb)) return SETS.services;
  if (inTree(categoryCode, breadcrumb, ['Zhivotnye'])) return SETS.animals;

  if (
    inTree(categoryCode, breadcrumb, [
      'Elektronika',
      'Bytovaya_tekhnika',
      'Krasota_zdorovie',
      'Dlya_detey',
      'Mebel_i_interer',
      'Posuda_i_kuhnya',
      'Stroyka_remont',
      'Kantselyariya',
    ]) ||
    isClothingTree(categoryCode, breadcrumb)
  ) {
    return SETS.goods;
  }

  return SETS.default;
}

export function sellerTypeOptionsForCategory(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return sellerTypesForCategory(categoryCode, breadcrumb).map((value) => ({
    value,
    labelKey: sellerTypeLabelKey(value),
  }));
}

export function resolveSellerBadge(adOrProfile?: {
  sellerType?: string | null;
  sellerIsStore?: boolean | null;
  storeVerified?: boolean | null;
  isStore?: boolean | null;
} | null) {
  if (!adOrProfile) {
    return {
      code: SELLER_TYPE.PRIVATE,
      tone: 'private',
      labelKey: sellerTypeLabelKey(SELLER_TYPE.PRIVATE),
    };
  }
  let code = normalizeSellerType(adOrProfile.sellerType);
  if (
    !code &&
    (adOrProfile.sellerIsStore === true ||
      adOrProfile.storeVerified === true ||
      adOrProfile.isStore === true)
  ) {
    code = SELLER_TYPE.STORE;
  }
  if (!code) code = SELLER_TYPE.PRIVATE;
  return {
    code,
    tone: sellerTypeTone(code),
    labelKey: sellerTypeLabelKey(code),
  };
}

export function allSellerTypeCodes() {
  const set = new Set<string>();
  Object.values(SETS).forEach((arr) => arr.forEach((c) => set.add(c)));
  return Array.from(set);
}
