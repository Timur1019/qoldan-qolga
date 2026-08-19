function normalize(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[''`ʼ‘’ʻ]/g, '')
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-яўқғҳ0-9]+/gi, ' ')
    .replace(
      /\b(viloyati|viloyat|oblasti|oblast|respublikasi|respublika|shahri|shahar|city|region|province|district|tuman|gorod|g)\b/g,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim()
}

function blobFrom(parts) {
  return [
    parts.city,
    parts.town,
    parts.village,
    parts.district,
    parts.subregion,
    parts.region,
    parts.state,
    parts.county,
    parts.suburb,
    parts.name,
    parts.formatted,
    parts.street,
    parts.road,
  ]
    .map(normalize)
    .filter(Boolean)
    .join(' ')
}

function nameHit(haystack, name) {
  const n = normalize(name)
  if (!n || n.length < 3) return 0
  if (haystack === n) return 120
  if (haystack.includes(n)) return 80
  if (n.includes(haystack) && haystack.length >= 4) return 50
  return 0
}

function isTashkentCity(parts) {
  const city = normalize(parts.city || parts.town || parts.name)
  const state = normalize(parts.state || parts.region)
  const cityHit = city === 'toshkent' || city === 'tashkent' || city === 'ташкент'
  const oblast =
    state.includes('viloyat') ||
    state.includes('region') ||
    state.includes('oblast') ||
    state.includes('ташкентск')
  if (cityHit && !oblast) return true
  if (cityHit && (state.includes('shahar') || state.includes('city'))) return true
  return cityHit && !oblast
}

function matchDistrict(parts, districts, blob) {
  const local = [
    normalize(parts.district),
    normalize(parts.suburb),
    normalize(parts.county),
    normalize(parts.city_district),
    blob,
  ].filter(Boolean)

  let bestLabel = ''
  let bestScore = 0
  for (const d of districts || []) {
    const uz = normalize(d.nameUz)
    const ru = normalize(d.nameRu)
    const label = d.nameUz || d.nameRu || ''
    for (const hay of local) {
      const score = Math.max(nameHit(hay, uz), nameHit(hay, ru))
      if (score > bestScore) {
        bestScore = score
        bestLabel = label
      }
    }
  }
  return bestScore >= 50 ? bestLabel : ''
}

export function matchRegionFromAddress(parts, regions) {
  if (!Array.isArray(regions) || regions.length === 0) return null
  const blob = blobFrom(parts || {})
  if (!blob) return null

  if (isTashkentCity(parts)) {
    const city = regions.find((r) => r.code === 'toshkent_shahar')
    if (city) {
      return {
        regionCode: city.code,
        district: matchDistrict(parts, city.districts || [], blob),
      }
    }
  }

  let best = null
  for (const region of regions) {
    let score = 0
    score = Math.max(score, nameHit(blob, region.nameUz))
    score = Math.max(score, nameHit(blob, region.nameRu))
    score = Math.max(score, nameHit(blob, String(region.code || '').replace(/_/g, ' ')))
    if (region.code === 'toshkent_viloyat' && isTashkentCity(parts)) score = 0
    if (!best || score > best.score) best = { region, score }
  }

  if (!best || best.score < 50) return null
  return {
    regionCode: best.region.code,
    district: matchDistrict(parts, best.region.districts || [], blob),
  }
}

export function addressLineFromNominatim(data) {
  const addr = data?.address || {}
  const parts = []
  if (addr.road) parts.push(addr.road)
  if (addr.house_number) parts.push(addr.house_number)
  if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
  if (addr.village || addr.town || addr.city) {
    parts.push(addr.village || addr.town || addr.city)
  }
  if (parts.length === 0 && data?.display_name) parts.push(data.display_name)
  return parts.join(', ')
}

export function nominatimToParts(data) {
  const addr = data?.address || {}
  return {
    city: addr.city,
    town: addr.town,
    village: addr.village,
    district: addr.city_district || addr.district,
    region: addr.state,
    state: addr.state,
    county: addr.county,
    suburb: addr.suburb || addr.neighbourhood,
    street: addr.road,
    road: addr.road,
    formatted: addressLineFromNominatim(data),
    name: data?.name,
  }
}
