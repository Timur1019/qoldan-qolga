export type GeoAddressParts = {
  city?: string | null;
  district?: string | null;
  subregion?: string | null;
  region?: string | null;
  street?: string | null;
  name?: string | null;
  formatted?: string | null;
  state?: string | null;
  county?: string | null;
  suburb?: string | null;
  town?: string | null;
  village?: string | null;
};

export type MatchableDistrict = {
  id?: number | string;
  nameUz?: string;
  nameRu?: string;
};

export type MatchableRegion = {
  code: string;
  nameUz?: string;
  nameRu?: string;
  districts?: MatchableDistrict[];
};

export type RegionMatch = {
  regionCode: string;
  district: string;
};

function normalize(raw?: string | null) {
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
    .trim();
}

function blobFrom(parts: GeoAddressParts) {
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
  ]
    .map(normalize)
    .filter(Boolean)
    .join(' ');
}

function nameHit(haystack: string, name?: string) {
  const n = normalize(name);
  if (!n || n.length < 3) return 0;
  if (haystack === n) return 120;
  if (haystack.includes(n)) return 80;
  if (n.includes(haystack) && haystack.length >= 4) return 50;
  return 0;
}

function isTashkentCity(parts: GeoAddressParts) {
  const city = normalize(parts.city || parts.town || parts.name);
  const state = normalize(parts.state || parts.region);
  const cityHit = city === 'toshkent' || city === 'tashkent' || city === 'ташкент';
  const oblast =
    state.includes('viloyat') ||
    state.includes('region') ||
    state.includes('oblast') ||
    state.includes('ташкентск');
  if (cityHit && !oblast) return true;
  if (cityHit && (state.includes('shahar') || state.includes('city'))) return true;
  return cityHit && !oblast;
}

export function matchRegionFromAddress(
  parts: GeoAddressParts,
  regions: MatchableRegion[]
): RegionMatch | null {
  if (!regions.length) return null;
  const blob = blobFrom(parts);
  if (!blob) return null;

  if (isTashkentCity(parts)) {
    const city = regions.find((r) => r.code === 'toshkent_shahar');
    if (city) {
      return {
        regionCode: city.code,
        district: matchDistrict(parts, city.districts || [], blob),
      };
    }
  }

  let best: { region: MatchableRegion; score: number } | null = null;
  for (const region of regions) {
    let score = 0;
    score = Math.max(score, nameHit(blob, region.nameUz));
    score = Math.max(score, nameHit(blob, region.nameRu));
    score = Math.max(score, nameHit(blob, region.code.replace(/_/g, ' ')));
    if (region.code === 'toshkent_viloyat' && isTashkentCity(parts)) score = 0;
    if (score > (best?.score || 0)) best = { region, score };
  }

  if (!best || best.score < 50) return null;
  return {
    regionCode: best.region.code,
    district: matchDistrict(parts, best.region.districts || [], blob),
  };
}

function matchDistrict(parts: GeoAddressParts, districts: MatchableDistrict[], blob: string) {
  const local = [
    normalize(parts.district),
    normalize(parts.suburb),
    normalize(parts.county),
    normalize(parts.subregion),
    blob,
  ].filter(Boolean);

  let bestLabel = '';
  let bestScore = 0;
  for (const d of districts) {
    const uz = normalize(d.nameUz);
    const ru = normalize(d.nameRu);
    const label = d.nameUz || d.nameRu || '';
    for (const hay of local) {
      const score = Math.max(nameHit(hay, uz), nameHit(hay, ru));
      if (score > bestScore) {
        bestScore = score;
        bestLabel = label;
      }
    }
  }
  return bestScore >= 50 ? bestLabel : '';
}
