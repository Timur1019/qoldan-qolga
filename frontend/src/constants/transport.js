export const TRANSPORT_ROOT_CODE = 'Transport'
export const TRANSPORT_CARS_CODE = 'Avtomobili'
export const TRANSPORT_SCOOTERS_CODE = 'Elektrosamokaty'
export const TRANSPORT_BIKES_CODE = 'Transport_velosipedy'
export const TRANSPORT_MOTO_CODE = 'Motocikly_i_mototehnika'
export const TRANSPORT_WATER_CODE = 'Vodnyy_transport'
export const TRANSPORT_TRUCKS_CODE = 'Gruzoviki_i_spectehnika'
export const TRANSPORT_PARTS_CODE = 'Zapchasti_i_aksessuary_transport'

function hasCode(categoryCode, breadcrumb, codes) {
  if (codes.includes(categoryCode)) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => codes.includes(c.code))
}

export function isTransportTree(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_ROOT_CODE])
}

export function isTransportCars(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_CARS_CODE])
}

export function isTransportMoto(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_MOTO_CODE])
}

export function isTransportParts(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_PARTS_CODE])
}

export function isTransportWater(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_WATER_CODE])
}

export function isTransportTrucks(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_TRUCKS_CODE])
}

export function isTransportLight(categoryCode, breadcrumb) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_SCOOTERS_CODE, TRANSPORT_BIKES_CODE])
}

/**
 * Легковые / грузовые+сельхоз / мото — без велосипедов, самокатов, запчастей, водного.
 * На корне Transport тоже показываем (пока не внутри исключённой ветки).
 */
export function isTransportMotorVehicle(categoryCode, breadcrumb) {
  if (!isTransportTree(categoryCode, breadcrumb)) return false
  if (isTransportLight(categoryCode, breadcrumb)) return false
  if (isTransportParts(categoryCode, breadcrumb)) return false
  if (isTransportWater(categoryCode, breadcrumb)) return false
  return true
}

export function transportFieldFlags(categoryCode, breadcrumb) {
  const transport = isTransportTree(categoryCode, breadcrumb)
  const cars = isTransportCars(categoryCode, breadcrumb)
  const moto = isTransportMoto(categoryCode, breadcrumb)
  const parts = isTransportParts(categoryCode, breadcrumb)
  const water = isTransportWater(categoryCode, breadcrumb)
  const trucks = isTransportTrucks(categoryCode, breadcrumb)
  const light = isTransportLight(categoryCode, breadcrumb)
  const motorVehicle = isTransportMotorVehicle(categoryCode, breadcrumb)
  const onRootOnly = transport && !cars && !moto && !trucks && !light && !parts && !water
  /** Моторный транспорт + корень «Транспорт» (общие фильтры списка). */
  const motorOrRoot = cars || moto || trucks || onRootOnly

  return {
    transport,
    cars,
    moto,
    trucks,
    light,
    parts,
    water,
    motorVehicle,
    brand: motorVehicle,
    model: cars || moto,
    year: motorOrRoot,
    mileage: motorOrRoot,
    /** Кузов / места / привод / руль — легковые (+ корень для фильтрации). */
    bodyType: cars || onRootOnly,
    seats: cars || onRootOnly,
    driveType: cars || onRootOnly,
    steering: cars || onRootOnly,
    /** КПП / топливо / цвет / объём — авто, мото, грузовые. */
    transmission: motorOrRoot,
    fuelType: motorOrRoot,
    exteriorColor: motorOrRoot,
    engineVolume: motorOrRoot,
    /** Владельцы — авто и мото. */
    ownersCount: cars || moto || onRootOnly,
    /** @deprecated используй гранулярные флаги; true если есть любые car-спеки */
    carSpecs: cars || onRootOnly,
    hideHandmade: transport,
  }
}

export const EMPTY_TRANSPORT_FIELDS = {
  brandId: '',
  modelId: '',
  modelCustom: '',
  year: '',
  mileage: '',
  bodyType: '',
  transmission: '',
  fuelType: '',
  driveType: '',
  engineVolume: '',
  exteriorColor: '',
  seats: '',
  steering: '',
  ownersCount: '',
}

export function brandDisplayName(brand, lang) {
  if (!brand) return ''
  return lang === 'ru' ? brand.nameRu : brand.nameUz
}

export function formatBrandCount(count) {
  if (count == null || count === '') return ''
  const n = Number(count)
  if (!Number.isFinite(n) || n < 0) return ''
  return String(Math.trunc(n))
}

