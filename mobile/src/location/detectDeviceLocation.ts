import * as Location from 'expo-location';

import { formatStreetLine, toGeoAddressParts } from '@/location/formatGeoAddress';
import {
  matchRegionFromAddress,
  type MatchableRegion,
  type RegionMatch,
} from '@/utils/matchRegionFromAddress';

export type DetectedLocation = RegionMatch & {
  lat: string;
  lng: string;
  address: string;
};

export async function detectDeviceLocation(
  regions: MatchableRegion[]
): Promise<DetectedLocation | null> {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (!perm.granted) return null;

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }).catch(
    () => []
  );
  const addr = places[0];
  const address = addr ? formatStreetLine(addr) : '';
  const match = addr ? matchRegionFromAddress(toGeoAddressParts(addr, address), regions) : null;

  return {
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
    address,
    regionCode: match?.regionCode || '',
    district: match?.district || '',
  };
}
