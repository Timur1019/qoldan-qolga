import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '../../../constants/realEstate'

function enumLabel(options, value, t) {
  const opt = options.find((o) => o.value === value)
  return opt ? t(opt.labelKey) : value
}

export function roomsLabel(rooms, t) {
  if (rooms == null || rooms === '') return ''
  const n = Number(rooms)
  if (n === 0) return t('ads.roomsStudio')
  if (n >= 5) return t('ads.rooms5Plus')
  const opt = ROOMS_OPTIONS.find((o) => o.value === String(n))
  return opt ? t(opt.labelKey) : String(n)
}

export function realEstateMetaLine(ad, t) {
  const parts = []
  if (ad.dealType) parts.push(enumLabel(DEAL_TYPE_OPTIONS, ad.dealType, t))
  if (ad.rooms != null) parts.push(roomsLabel(ad.rooms, t))
  if (ad.areaM2 != null) parts.push(`${ad.areaM2} ${t('ads.m2Short')}`)
  if (ad.landAreaM2 != null) parts.push(`${ad.landAreaM2} ${t('ads.landM2Short')}`)
  return parts.join(' · ')
}

export function realEstateCharacteristicRows(ad, t) {
  const rows = []
  if (ad.dealType) rows.push({ label: t('ads.dealTypeLabel'), value: enumLabel(DEAL_TYPE_OPTIONS, ad.dealType, t) })
  if (ad.rooms != null) rows.push({ label: t('ads.roomsLabel'), value: roomsLabel(ad.rooms, t) })
  if (ad.areaM2 != null) rows.push({ label: t('ads.areaLabel'), value: `${ad.areaM2} ${t('ads.m2Short')}` })
  if (ad.landAreaM2 != null) rows.push({ label: t('ads.landAreaLabel'), value: `${ad.landAreaM2} ${t('ads.m2Short')}` })
  if (ad.floor != null || ad.floorsTotal != null) {
    const floor = ad.floor != null ? String(ad.floor) : '—'
    const total = ad.floorsTotal != null ? String(ad.floorsTotal) : '—'
    rows.push({ label: t('ads.floorLabel'), value: `${floor} / ${total}` })
  }
  if (ad.buildingType) rows.push({ label: t('ads.buildingTypeLabel'), value: enumLabel(BUILDING_TYPE_OPTIONS, ad.buildingType, t) })
  if (ad.renovation) rows.push({ label: t('ads.renovationLabel'), value: enumLabel(RENOVATION_OPTIONS, ad.renovation, t) })
  if (ad.furnished) rows.push({ label: t('ads.furnishedLabel'), value: t('ads.canRentYes') })
  return rows
}
