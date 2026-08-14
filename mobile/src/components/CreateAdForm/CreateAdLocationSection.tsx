import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import * as Location from 'expo-location';

import { MAP_DEFAULT } from '@/constants/adDetail';
import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';

import { styles } from './CreateAdLocationSection.styles';

interface Props {
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
  regionLabel: string;
  onOpenRegion: () => void;
  onOpenDistrict: () => void;
  hasDistricts: boolean;
}

function buildPickerHtml(lat: number, lng: number) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>html,body,#map{margin:0;padding:0;height:100%;width:100%} .hint{position:absolute;z-index:1000;left:8px;right:8px;top:8px;background:rgba(255,255,255,.92);padding:6px 8px;border-radius:8px;font:12px sans-serif;color:#333}</style>
</head>
<body>
  <div class="hint">Xaritani bosing — nuqta qo‘yiladi</div>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OSM'
    }).addTo(map);
    var marker = L.marker([${lat}, ${lng}], { draggable: true }).addTo(map);
    function send(ll) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: ll.lat, lng: ll.lng }));
      }
    }
    marker.on('dragend', function(){ send(marker.getLatLng()); });
    map.on('click', function(e){
      marker.setLatLng(e.latlng);
      send(e.latlng);
    });
    send(marker.getLatLng());
  </script>
</body>
</html>`;
}

export function CreateAdLocationSection({
  form,
  patch,
  regionLabel,
  onOpenRegion,
  onOpenDistrict,
  hasDistricts,
}: Props) {
  const [mapSeed, setMapSeed] = useState(() => ({
    lat: Number(form.locationLat) || MAP_DEFAULT.lat,
    lng: Number(form.locationLng) || MAP_DEFAULT.lng,
    key: 0,
  }));

  const html = useMemo(() => buildPickerHtml(mapSeed.lat, mapSeed.lng), [mapSeed]);

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(e.nativeEvent.data) as { lat?: number; lng?: number };
        if (data.lat == null || data.lng == null) return;
        patch({
          locationLat: String(Number(data.lat.toFixed(6))),
          locationLng: String(Number(data.lng.toFixed(6))),
        });
      } catch {
        /* ignore */
      }
    },
    [patch]
  );

  const useMyLocation = async () => {
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Ruxsat kerak', 'Joylashuvga ruxsat bering');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));
      patch({ locationLat: String(lat), locationLng: String(lng) });
      setMapSeed((s) => ({ lat, lng, key: s.key + 1 }));
    } catch {
      Alert.alert('Xatolik', 'Joylashuvni aniqlab bo‘lmadi');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Manzil</Text>
      <Text style={styles.hint}>Xaritadan nuqtani tanlang yoki hududni belgilang</Text>

      <Pressable style={styles.selectBtn} onPress={onOpenRegion}>
        <Text style={[styles.selectText, !form.region && styles.placeholder]} numberOfLines={1}>
          {form.region ? regionLabel : 'Hudud'}
        </Text>
      </Pressable>

      {form.region && hasDistricts ? (
        <Pressable style={styles.selectBtn} onPress={onOpenDistrict}>
          <Text style={[styles.selectText, !form.district && styles.placeholder]} numberOfLines={1}>
            {form.district || 'Tuman / shahar'}
          </Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.myLocBtn} onPress={useMyLocation}>
        <Text style={styles.myLocText}>Mening joylashuvim</Text>
      </Pressable>

      <View style={styles.mapWrap}>
        <WebView
          key={mapSeed.key}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.map}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>

      <TextInput
        style={styles.input}
        value={form.address}
        onChangeText={(address) => patch({ address })}
        placeholder="Manzil (ko'cha, uy)"
        placeholderTextColor={colors.muted}
      />
      <TextInput
        style={styles.input}
        value={form.landmark}
        onChangeText={(landmark) => patch({ landmark })}
        placeholder="Yo'nalish / orientir"
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}
