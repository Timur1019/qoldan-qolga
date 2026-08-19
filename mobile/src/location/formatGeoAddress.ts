import type { LocationGeocodedAddress } from 'expo-location';

import type { GeoAddressParts } from '@/utils/matchRegionFromAddress';

export function formatStreetLine(addr: LocationGeocodedAddress) {
  const parts = [addr.street, addr.streetNumber, addr.district, addr.city].filter(Boolean);
  return parts.join(', ');
}

export function toGeoAddressParts(
  addr: LocationGeocodedAddress,
  formatted?: string
): GeoAddressParts {
  return {
    city: addr.city,
    district: addr.district,
    subregion: addr.subregion,
    region: addr.region,
    street: addr.street,
    name: addr.name,
    formatted: formatted || formatStreetLine(addr),
  };
}
