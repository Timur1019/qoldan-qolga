import { isTransportTree, isTransportParts, TRANSPORT_ROOT_CODE, TRANSPORT_PARTS_CODE } from './transport'
import { isRealEstateTree, RE_ROOT_CODE } from './realEstate'
import { isClothingTree } from './routes'
import { CATEGORY_PARENTS } from './categoryParents'

/** Корни категорий для наборов типов продавца. */
const SERVICES_ROOT = 'Xizmatlar'
const ELECTRONICS_ROOT = 'Elektronika'
const APPLIANCES_ROOT = 'Bytovaya_tekhnika'
const ANIMALS_ROOT = 'Zhivotnye'
const BEAUTY_ROOT = 'Krasota_zdorovie'
const KIDS_ROOT = 'Dlya_detey'
const FURNITURE_ROOT = 'Mebel_i_interer'
const KITCHEN_ROOT = 'Posuda_i_kuhnya'
const BUILD_ROOT = 'Stroyka_remont'
const STATIONERY_ROOT = 'Kantselyariya'

/**
 * Все коды типов продавца.
 * BUSINESS — legacy-алиас магазина (старые объявления).
 */
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
}

/** Нормализация: BUSINESS → STORE. */
export function normalizeSellerType(code) {
  if (!code || typeof code !== 'string') return ''
  const v = code.trim().toUpperCase()
  if (v === SELLER_TYPE.BUSINESS) return SELLER_TYPE.STORE
  return v
}

/** Бизнес-подобные (не «Частный»). */
const BUSINESS_LIKE = new Set([
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
])

export function isBusinessLikeSellerType(code) {
  return BUSINESS_LIKE.has(normalizeSellerType(code) || code)
}

/** i18n key: ads.sellerTypes.<CODE> */
export function sellerTypeLabelKey(code) {
  const n = normalizeSellerType(code) || SELLER_TYPE.PRIVATE
  return `ads.sellerTypes.${n}`
}

/** CSS tone for badge. */
export function sellerTypeTone(code) {
  const n = normalizeSellerType(code) || SELLER_TYPE.PRIVATE
  if (n === SELLER_TYPE.PRIVATE) return 'private'
  if (
    n === SELLER_TYPE.DEALER ||
    n === SELLER_TYPE.OFFICIAL ||
    n === SELLER_TYPE.SHOWROOM ||
    n === SELLER_TYPE.DEVELOPER
  ) {
    return 'accent'
  }
  if (n === SELLER_TYPE.AGENT || n === SELLER_TYPE.BROKER) return 'agent'
  if (n === SELLER_TYPE.SERVICE || n === SELLER_TYPE.STUDIO) return 'service'
  if (n === SELLER_TYPE.FARM || n === SELLER_TYPE.BREEDER) return 'farm'
  return 'store'
}

function inTree(categoryCode, breadcrumb, roots) {
  if (!categoryCode) return false
  if (roots.includes(categoryCode)) return true
  if (Array.isArray(breadcrumb) && breadcrumb.some((c) => roots.includes(c.code))) return true
  // Подъём по родителям, если breadcrumb не передан
  let cur = categoryCode
  const seen = new Set()
  while (cur && !seen.has(cur)) {
    seen.add(cur)
    if (roots.includes(cur)) return true
    cur = CATEGORY_PARENTS[cur]
  }
  return false
}

/** Наборы по доменам — без пересечений лишних ролей. */
const SETS = {
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
  services: [
    SELLER_TYPE.PRIVATE,
    SELLER_TYPE.SERVICE,
    SELLER_TYPE.STUDIO,
    SELLER_TYPE.COMPANY,
  ],
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
}

/**
 * Типы продавца, доступные для выбранной категории.
 * @returns {string[]} codes
 */
export function sellerTypesForCategory(categoryCode, breadcrumb = []) {
  if (!categoryCode) return SETS.default

  if (isTransportTree(categoryCode, breadcrumb) || inTree(categoryCode, breadcrumb, [TRANSPORT_ROOT_CODE])) {
    if (isTransportParts(categoryCode, breadcrumb) || inTree(categoryCode, breadcrumb, [TRANSPORT_PARTS_CODE])) {
      return SETS.transportParts
    }
    return SETS.transportVehicle
  }
  if (isRealEstateTree(categoryCode, breadcrumb) || inTree(categoryCode, breadcrumb, [RE_ROOT_CODE])) {
    return SETS.realEstate
  }
  if (inTree(categoryCode, breadcrumb, [SERVICES_ROOT])) return SETS.services
  if (inTree(categoryCode, breadcrumb, [ANIMALS_ROOT])) return SETS.animals

  if (
    inTree(categoryCode, breadcrumb, [
      ELECTRONICS_ROOT,
      APPLIANCES_ROOT,
      BEAUTY_ROOT,
      KIDS_ROOT,
      FURNITURE_ROOT,
      KITCHEN_ROOT,
      BUILD_ROOT,
      STATIONERY_ROOT,
    ]) ||
    isClothingTree(categoryCode, breadcrumb)
  ) {
    return SETS.goods
  }

  return SETS.default
}

/** Опции для селектов/фильтров: { value, labelKey }. */
export function sellerTypeOptionsForCategory(categoryCode, breadcrumb = []) {
  return sellerTypesForCategory(categoryCode, breadcrumb).map((value) => ({
    value,
    labelKey: sellerTypeLabelKey(value),
  }))
}

/**
 * Резолв кода и тона для бейджа объявления/профиля.
 * storeVerified без типа → STORE.
 */
export function resolveSellerBadge(adOrProfile) {
  if (!adOrProfile) {
    return { code: SELLER_TYPE.PRIVATE, tone: 'private', labelKey: sellerTypeLabelKey(SELLER_TYPE.PRIVATE) }
  }
  const raw = adOrProfile.sellerType
  let code = normalizeSellerType(raw)
  if (!code && (adOrProfile.sellerIsStore === true || adOrProfile.storeVerified === true)) {
    code = SELLER_TYPE.STORE
  }
  if (!code) code = SELLER_TYPE.PRIVATE
  return {
    code,
    tone: sellerTypeTone(code),
    labelKey: sellerTypeLabelKey(code),
  }
}

/** Все уникальные коды (для глобального фильтра без категории). */
export function allSellerTypeCodes() {
  const set = new Set()
  Object.values(SETS).forEach((arr) => arr.forEach((c) => set.add(c)))
  return Array.from(set)
}
