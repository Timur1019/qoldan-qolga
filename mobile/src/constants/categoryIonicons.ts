import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ROOT_ICONS: Record<string, IoniconName> = {
  Xizmatlar: 'clipboard-outline',
  Ish: 'briefcase-outline',
  Transport: 'car-outline',
  Nedvizhimost: 'home-outline',
  Elektronika: 'phone-portrait-outline',
  Bytovaya_tekhnika: 'tv-outline',
  Mebel_i_interer: 'bed-outline',
  Posuda_i_kuhnya: 'restaurant-outline',
  Krasota_zdorovie: 'heart-outline',
  Odezhda_obuv: 'shirt-outline',
  Dlya_detey: 'balloon-outline',
  Stroyka_remont: 'hammer-outline',
  Zhivotnye: 'paw-outline',
  Kantselyariya: 'pencil-outline',
};

export function categoryIonicon(code?: string | null): IoniconName {
  if (!code) return 'grid-outline';
  return ROOT_ICONS[code] || 'grid-outline';
}
