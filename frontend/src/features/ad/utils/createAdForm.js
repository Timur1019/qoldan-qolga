import { EMPTY_TRANSPORT_FIELDS } from '../../../constants/transport'
import { EMPTY_REAL_ESTATE_FIELDS } from '../../../constants/realEstate'
import { seatsFromApi, seatsToApi, ownersFromApi, ownersToApi } from './transportFormValues'
import { appendLocationToDescription, extractLocationFromDescription } from './descriptionLocation'
import { normalizeSellerType } from '../../../constants/sellerTypes'
import { sortImagesMainFirst } from './galleryImageUrls'

export function createEmptyAdForm() {
  return {
    title: '',
    description: '',
    price: '',
    currency: 'UZS',
    category: 'Xizmatlar',
    ...EMPTY_TRANSPORT_FIELDS,
    ...EMPTY_REAL_ESTATE_FIELDS,
    itemCondition: 'USED',
    canRent: false,
    phone: '',
    email: '',
    displayName: '',
    region: '',
    district: '',
    isNegotiable: false,
    giveAway: false,
    onlineShowing: false,
    address: '',
    landmark: '',
    canDeliver: false,
    contactByPhone: true,
    contactByTelegram: false,
    telegramUsername: '',
    expiresAt: '',
    sellerType: '',
    hasLicense: false,
    worksByContract: false,
    urgentBargain: false,
    locationLat: '',
    locationLng: '',
  }
}

export function formFromAdDetail(ad) {
  const expiresAt = ad.expiresAt ? new Date(ad.expiresAt).toISOString().slice(0, 16) : ''
  const parsed = extractLocationFromDescription(ad.description || '')
  return {
    title: ad.title || '',
    description: parsed.description,
    price: ad.price != null ? String(ad.price) : '',
    currency: ad.currency || 'UZS',
    category: ad.category || 'Xizmatlar',
    brandId: ad.brandId || '',
    modelId: ad.modelId || '',
    modelCustom: ad.modelCustom || '',
    year: ad.year != null ? String(ad.year) : '',
    mileage: ad.mileage != null ? String(ad.mileage) : '',
    bodyType: ad.bodyType || '',
    transmission: ad.transmission || '',
    fuelType: ad.fuelType || '',
    driveType: ad.driveType || '',
    engineVolume: ad.engineVolume != null ? String(ad.engineVolume) : '',
    exteriorColor: ad.exteriorColor || '',
    seats: seatsFromApi(ad.seats),
    steering: ad.steering || '',
    ownersCount: ownersFromApi(ad.ownersCount),
    dealType: ad.dealType || '',
    rooms: ad.rooms != null ? String(ad.rooms) : '',
    areaM2: ad.areaM2 != null ? String(ad.areaM2) : '',
    landAreaM2: ad.landAreaM2 != null ? String(ad.landAreaM2) : '',
    floor: ad.floor != null ? String(ad.floor) : '',
    floorsTotal: ad.floorsTotal != null ? String(ad.floorsTotal) : '',
    buildingType: ad.buildingType || '',
    renovation: ad.renovation || '',
    furnished: !!ad.furnished,
    itemCondition: ad.itemCondition || 'USED',
    canRent: !!ad.canRent,
    phone: ad.phone || '',
    email: ad.email || '',
    displayName: '',
    region: ad.region || '',
    district: ad.district || '',
    isNegotiable: !!ad.isNegotiable,
    giveAway: !!ad.giveAway || ad.price === 0,
    onlineShowing: !!ad.onlineShowing,
    address: parsed.address,
    landmark: parsed.landmark,
    canDeliver: !!ad.canDeliver,
    sellerType: ad.sellerType || '',
    hasLicense: !!ad.hasLicense,
    worksByContract: !!ad.worksByContract,
    urgentBargain: !!ad.urgentBargain,
    contactByPhone: true,
    contactByTelegram: !!ad.telegramUsername,
    telegramUsername: ad.telegramUsername || '',
    expiresAt,
    locationLat: ad.locationLat != null ? String(ad.locationLat) : '',
    locationLng: ad.locationLng != null ? String(ad.locationLng) : '',
  }
}

export function imageUrlsFromAd(ad) {
  const imgs = sortImagesMainFirst(ad.images || [])
  return imgs
    .map((i) => i.url || i)
    .filter(Boolean)
}

export function buildCreateAdPayload(form, uploadedUrls, { lang, filterFlags, realEstateFlags }) {
  const description = appendLocationToDescription(form.description.trim(), {
    address: form.address,
    landmark: form.landmark,
    lang,
  })
  const price = form.giveAway ? 0 : (parseFloat(form.price) || 0)
  const expiresAt = form.expiresAt
    ? new Date(form.expiresAt).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  return {
    title: form.title.trim(),
    description,
    price,
    currency: form.currency || 'UZS',
    category: form.category || 'Xizmatlar',
    brandId: form.brandId?.trim() || undefined,
    modelId: form.modelId?.trim() || undefined,
    modelCustom: form.modelCustom?.trim() || undefined,
    year: form.year !== '' && form.year != null ? parseInt(form.year, 10) : undefined,
    mileage: form.mileage !== '' && form.mileage != null ? parseInt(form.mileage, 10) : undefined,
    bodyType: form.bodyType || undefined,
    transmission: form.transmission || undefined,
    fuelType: form.fuelType || undefined,
    driveType: form.driveType || undefined,
    engineVolume: form.engineVolume !== '' && form.engineVolume != null ? Number(form.engineVolume) : undefined,
    exteriorColor: form.exteriorColor || undefined,
    seats: seatsToApi(form.seats),
    steering: form.steering || undefined,
    ownersCount: ownersToApi(form.ownersCount),
    dealType: form.dealType || undefined,
    rooms: form.rooms !== '' && form.rooms != null ? parseInt(form.rooms, 10) : undefined,
    areaM2: form.areaM2 !== '' && form.areaM2 != null ? Number(form.areaM2) : undefined,
    landAreaM2: form.landAreaM2 !== '' && form.landAreaM2 != null ? Number(form.landAreaM2) : undefined,
    floor: form.floor !== '' && form.floor != null ? parseInt(form.floor, 10) : undefined,
    floorsTotal: form.floorsTotal !== '' && form.floorsTotal != null ? parseInt(form.floorsTotal, 10) : undefined,
    buildingType: form.buildingType || undefined,
    renovation: form.renovation || undefined,
    furnished: realEstateFlags.furnished ? !!form.furnished : false,
    itemCondition: filterFlags.condition ? (form.itemCondition || 'USED') : 'USED',
    canRent: filterFlags.canRent ? !!form.canRent : false,
    phone: form.phone.trim(),
    email: form.email.trim() || undefined,
    region: form.region.trim() || undefined,
    district: form.district.trim() || undefined,
    isNegotiable: form.isNegotiable,
    canDeliver: filterFlags.canDeliver ? form.canDeliver : false,
    sellerType: normalizeSellerType(form.sellerType) || form.sellerType || undefined,
    hasLicense: filterFlags.license ? form.hasLicense : false,
    worksByContract: filterFlags.contract ? form.worksByContract : false,
    urgentBargain: filterFlags.urgentBargain ? form.urgentBargain : false,
    giveAway: filterFlags.giveAway ? form.giveAway : false,
    onlineShowing: filterFlags.onlineShowing ? !!form.onlineShowing : false,
    locationLat: form.locationLat ? Number(form.locationLat) : null,
    locationLng: form.locationLng ? Number(form.locationLng) : null,
    expiresAt,
    imageUrls: uploadedUrls,
    telegramUsername: form.contactByTelegram
      ? ((form.telegramUsername || '').trim().replace(/^@/, '') || null)
      : null,
  }
}
