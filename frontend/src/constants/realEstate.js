export const RE_ROOT_CODE = 'Nedvizhimost'
export const RE_APARTMENTS_CODE = 'Kvartiry'
export const RE_HOUSES_CODE = 'Doma_dachi'
export const RE_PLOTS_CODE = 'Uchastki'
export const RE_COMMERCIAL_CODE = 'Kommercheskaya'
export const RE_GARAGES_CODE = 'Garazhi_parkovki'

function hasCode(categoryCode, breadcrumb, codes) {
  if (codes.includes(categoryCode)) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => codes.includes(c.code))
}

export function isRealEstateTree(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_ROOT_CODE])
}

export function isRealEstateApartments(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_APARTMENTS_CODE])
}

export function isRealEstateHouses(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_HOUSES_CODE])
}

export function isRealEstatePlots(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_PLOTS_CODE])
}

export function isRealEstateCommercial(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_COMMERCIAL_CODE])
}

export function isRealEstateGarages(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [RE_GARAGES_CODE])
}

export function realEstateFieldFlags(categoryCode, breadcrumb) {
  const realEstate = isRealEstateTree(categoryCode, breadcrumb)
  const apartments = isRealEstateApartments(categoryCode, breadcrumb)
  const houses = isRealEstateHouses(categoryCode, breadcrumb)
  const plots = isRealEstatePlots(categoryCode, breadcrumb)
  const commercial = isRealEstateCommercial(categoryCode, breadcrumb)
  const garages = isRealEstateGarages(categoryCode, breadcrumb)
  return {
    realEstate,
    apartments,
    houses,
    plots,
    commercial,
    garages,
    dealType: realEstate,
    rooms: apartments || houses,
    area: realEstate && !plots,
    landArea: plots || houses,
    floor: apartments || commercial,
    floorsTotal: apartments || houses || commercial,
    buildingType: apartments || houses,
    renovation: apartments || houses || commercial,
    furnished: realEstate && !plots,
    hideGiveAway: realEstate,
    hideHandmade: realEstate,
    hideCanDeliver: realEstate,
    hideCondition: realEstate,
  }
}

export const DEAL_TYPE_OPTIONS = [
  { value: 'SALE', labelKey: 'ads.dealSale' },
  { value: 'RENT', labelKey: 'ads.dealRent' },
]

export const ROOMS_OPTIONS = [
  { value: '0', labelKey: 'ads.roomsStudio' },
  { value: '1', labelKey: 'ads.rooms1' },
  { value: '2', labelKey: 'ads.rooms2' },
  { value: '3', labelKey: 'ads.rooms3' },
  { value: '4', labelKey: 'ads.rooms4' },
  { value: '5PLUS', labelKey: 'ads.rooms5Plus' },
]

export const BUILDING_TYPE_OPTIONS = [
  { value: 'PANEL', labelKey: 'ads.buildingPanel' },
  { value: 'BRICK', labelKey: 'ads.buildingBrick' },
  { value: 'MONOLITH', labelKey: 'ads.buildingMonolith' },
  { value: 'BLOCK', labelKey: 'ads.buildingBlock' },
  { value: 'OTHER', labelKey: 'ads.buildingOther' },
]

export const RENOVATION_OPTIONS = [
  { value: 'NEEDS_REPAIR', labelKey: 'ads.renovationNeedsRepair' },
  { value: 'COSMETIC', labelKey: 'ads.renovationCosmetic' },
  { value: 'EURO', labelKey: 'ads.renovationEuro' },
  { value: 'DESIGN', labelKey: 'ads.renovationDesign' },
  { value: 'NEW_BUILD', labelKey: 'ads.renovationNewBuild' },
]

export const EMPTY_REAL_ESTATE_FIELDS = {
  dealType: '',
  rooms: '',
  areaM2: '',
  landAreaM2: '',
  floor: '',
  floorsTotal: '',
  buildingType: '',
  renovation: '',
  furnished: false,
}
