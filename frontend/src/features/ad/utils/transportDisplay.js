import { FALLBACK_VEHICLE_SPEC_OPTIONS, vehicleSpecOptionLabel } from '../../../constants/vehicleSpecOptions'
import { seatsFromApi, ownersFromApi } from './transportFormValues'

function enumLabel(options, value, lang) {
  const opt = (options || []).find((o) => o.value === value)
  return opt ? vehicleSpecOptionLabel(opt, lang) : value
}

export function vehicleBrandModel(ad, lang) {
  const brand = lang === 'ru' ? ad.brandNameRu : ad.brandNameUz
  const model = ad.modelCustom || (lang === 'ru' ? ad.modelNameRu : ad.modelNameUz)
  return [brand, model].filter(Boolean).join(' ')
}

export function vehicleMetaLine(ad, t) {
  const parts = []
  if (ad.year) parts.push(String(ad.year))
  if (ad.mileage != null) parts.push(`${ad.mileage} ${t('ads.kmShort')}`)
  return parts.join(' · ')
}

/** Отображение характеристик; options можно передать из API, иначе fallback. */
export function vehicleCharacteristicRows(ad, lang, t, specOptions = FALLBACK_VEHICLE_SPEC_OPTIONS) {
  const rows = []
  const brandModel = vehicleBrandModel(ad, lang)
  if (brandModel) rows.push({ label: t('ads.brandLabel'), value: brandModel })
  if (ad.year) rows.push({ label: t('ads.yearLabel'), value: String(ad.year) })
  if (ad.mileage != null) rows.push({ label: t('ads.mileageLabel'), value: String(ad.mileage) })
  if (ad.bodyType) rows.push({ label: t('ads.bodyTypeLabel'), value: enumLabel(specOptions.bodyType, ad.bodyType, lang) })
  if (ad.transmission) rows.push({ label: t('ads.transmissionLabel'), value: enumLabel(specOptions.transmission, ad.transmission, lang) })
  if (ad.fuelType) rows.push({ label: t('ads.fuelTypeLabel'), value: enumLabel(specOptions.fuelType, ad.fuelType, lang) })
  if (ad.driveType) rows.push({ label: t('ads.driveTypeLabel'), value: enumLabel(specOptions.driveType, ad.driveType, lang) })
  if (ad.engineVolume != null) rows.push({ label: t('ads.engineVolumeLabel'), value: String(ad.engineVolume) })
  if (ad.exteriorColor) rows.push({ label: t('ads.colorLabel'), value: enumLabel(specOptions.exteriorColor, ad.exteriorColor, lang) })
  if (ad.seats != null) {
    const seatsKey = seatsFromApi(ad.seats)
    rows.push({ label: t('ads.seatsLabel'), value: enumLabel(specOptions.seats, seatsKey, lang) || String(ad.seats) })
  }
  if (ad.steering) rows.push({ label: t('ads.steeringLabel'), value: enumLabel(specOptions.steering, ad.steering, lang) })
  if (ad.ownersCount != null) {
    const ownersKey = ownersFromApi(ad.ownersCount)
    rows.push({ label: t('ads.ownersLabel'), value: enumLabel(specOptions.ownersCount, ownersKey, lang) || String(ad.ownersCount) })
  }
  return rows
}
