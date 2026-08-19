/** Центры регионов Узбекистана для пинов, если у объявления нет GPS. */

export const UZBEKISTAN_CENTER = [41.3775, 64.5853]
export const UZBEKISTAN_ZOOM = 6

export const REGION_CENTROIDS = {
  andijon: [40.7821, 72.3442],
  buxoro: [39.7681, 64.4556],
  fargona: [40.3864, 71.7864],
  jizzax: [40.1158, 67.8422],
  qoraqalpogiston: [42.4619, 59.6164],
  qashqadaryo: [38.8606, 65.789],
  xorazm: [41.55, 60.6333],
  namangan: [40.9983, 71.6726],
  navoiy: [40.0844, 65.3792],
  samarqand: [39.6542, 66.9597],
  sirdaryo: [40.4897, 68.7842],
  surxondaryo: [37.2242, 67.2783],
  toshkent_viloyat: [41.035, 69.36],
  toshkent_shahar: [41.2995, 69.2401],
}

export function regionCenter(regionCode) {
  if (!regionCode) return null
  return REGION_CENTROIDS[regionCode] || null
}
