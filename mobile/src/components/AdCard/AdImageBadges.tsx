import { Text, View } from 'react-native';

import { resolveSellerBadge } from '@/constants/sellerTypes';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './AdImageBadges.styles';

interface Props {
  ad: {
    sellerType?: string | null;
    sellerIsStore?: boolean | null;
    storeVerified?: boolean | null;
    onlineShowing?: boolean | null;
  };
}

const TONE_BG: Record<string, string> = {
  private: '#6b7280',
  store: colors.primary,
  accent: '#0f766e',
  agent: '#1d4ed8',
  service: '#7c3aed',
  farm: '#b45309',
  online: '#2095f3',
};

function Ribbon({ label, bg }: { label: string; bg: string }) {
  return (
    <View style={styles.ribbonRow}>
      <View style={[styles.notch, { borderRightColor: bg }]} />
      <View style={[styles.ribbonBody, { backgroundColor: bg }]}>
        <Text style={styles.text} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

/** Ленточные бейджи внизу слева на фото. */
export function AdImageBadges({ ad }: Props) {
  const { t } = useLanguage();
  const seller = resolveSellerBadge(ad);
  const showOnline = Boolean(ad.onlineShowing);

  return (
    <View style={styles.stack} pointerEvents="none">
      {showOnline ? <Ribbon label={t('ads.onlineShowing')} bg={TONE_BG.online} /> : null}
      <Ribbon label={t(seller.labelKey)} bg={TONE_BG[seller.tone] || TONE_BG.store} />
    </View>
  );
}
