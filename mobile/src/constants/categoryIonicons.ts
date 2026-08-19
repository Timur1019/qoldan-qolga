import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { JOB_HIRE, JOB_ROOT, JOB_SEEK } from './jobCategories';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ROOT_ICONS: Record<string, IoniconName> = {
  Xizmatlar: 'clipboard-outline',
  [JOB_ROOT]: 'briefcase-outline',
  [JOB_SEEK]: 'person-outline',
  [JOB_HIRE]: 'person-add-outline',
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
  if (ROOT_ICONS[code]) return ROOT_ICONS[code];
  if (code.startsWith('JobSeek_')) return ROOT_ICONS[JOB_SEEK];
  if (code.startsWith('Hire_')) return ROOT_ICONS[JOB_HIRE];
  return 'grid-outline';
}
