import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { MAP_DEFAULT } from '@/constants/adDetail';
import { colors } from '@/theme/colors';
import { openExternalUrl } from '@/utils/openExternalUrl';

import { styles } from './AdLocationBlock.styles';

interface Props {
  title?: string;
  regionLabel?: string | null;
  district?: string | null;
  address?: string | null;
  landmark?: string | null;
  canDeliver?: boolean;
  lat?: number | null;
  lng?: number | null;
  deliverLabel?: string;
  landmarkLabel?: string;
  openMapsLabel?: string;
}

function buildMapHtml(lat: number, lng: number) {
  const delta = 0.02;
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><style>html,body,iframe{margin:0;padding:0;height:100%;width:100%;border:0;overflow:hidden}</style></head><body><iframe src="${src}"></iframe></body></html>`;
}

export function AdLocationBlock({
  title = 'Manzil',
  regionLabel,
  district,
  address,
  landmark,
  canDeliver,
  lat,
  lng,
  deliverLabel = 'Yetkazib berish mumkin',
  landmarkLabel = "Yo'nalish",
  openMapsLabel = 'Xaritada ochish',
}: Props) {
  const addressText = address || [regionLabel, district].filter(Boolean).join(', ');
  const hasCoords = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  const mapLat = hasCoords ? Number(lat) : MAP_DEFAULT.lat;
  const mapLng = hasCoords ? Number(lng) : MAP_DEFAULT.lng;
  const mapsQuery = hasCoords
    ? `${mapLat},${mapLng}`
    : encodeURIComponent(addressText || 'Toshkent');
  const mapsUrl = hasCoords
    ? `https://maps.apple.com/?ll=${mapLat},${mapLng}&q=${encodeURIComponent(addressText || 'Manzil')}`
    : `https://maps.apple.com/?q=${mapsQuery}`;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {canDeliver ? (
        <View style={styles.deliverRow}>
          <Ionicons name="car-outline" size={16} color={colors.muted} />
          <Text style={styles.deliverText}>{deliverLabel}</Text>
        </View>
      ) : null}

      {addressText ? (
        <View style={styles.line}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <View style={styles.lineBody}>
            <Text style={styles.lineMain}>{addressText}</Text>
            {district && address ? <Text style={styles.lineSub}>{district}</Text> : null}
          </View>
        </View>
      ) : null}

      {landmark ? (
        <View style={styles.line}>
          <Ionicons name="navigate-outline" size={18} color={colors.primary} />
          <View style={styles.lineBody}>
            <Text style={styles.lineMain}>{landmark}</Text>
            <Text style={styles.lineSub}>{landmarkLabel}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.mapWrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html: buildMapHtml(mapLat, mapLng) }}
          style={styles.map}
          scrollEnabled={false}
          javaScriptEnabled
        />
      </View>

      <Pressable style={styles.openMaps} onPress={() => void openExternalUrl(mapsUrl)}>
        <Ionicons name="map-outline" size={16} color={colors.primary} />
        <Text style={styles.openMapsText}>{openMapsLabel}</Text>
      </Pressable>
    </View>
  );
}
