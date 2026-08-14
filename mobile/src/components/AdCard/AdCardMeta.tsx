import { Text, View } from 'react-native';

import { useRegionLabel } from '@/context/RegionsContext';
import { formatCardDate } from '@/utils/formatters';

import { styles } from './AdCardMeta.styles';

interface Props {
  region?: string | null;
  district?: string | null;
  createdAt?: string | null;
  /** grid — две строки; inline — одна компактная */
  variant?: 'grid' | 'list';
}

export function AdCardMeta({ region, district, createdAt, variant = 'grid' }: Props) {
  const regionLabel = useRegionLabel(region);
  const place = [district, regionLabel].filter(Boolean).join(', ') || regionLabel;
  const date = formatCardDate(createdAt);

  if (!place && !date) return null;

  if (variant === 'list') {
    return (
      <View style={styles.listWrap}>
        {place ? (
          <View style={styles.listLocationRow}>
            <View style={styles.dot} />
            <Text style={styles.listLocation} numberOfLines={1}>
              {place}
            </Text>
          </View>
        ) : null}
        {date ? (
          <Text style={styles.listDate} numberOfLines={1}>
            {date}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.gridWrap}>
      {place ? (
        <Text style={styles.gridPlace} numberOfLines={1}>
          {place}
        </Text>
      ) : null}
      {date ? (
        <Text style={styles.gridDate} numberOfLines={1}>
          {date}
        </Text>
      ) : null}
    </View>
  );
}
