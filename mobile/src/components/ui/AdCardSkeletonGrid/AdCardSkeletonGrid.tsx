import { View } from 'react-native';

import { AdCardSkeleton } from '@/components/ui/AdCardSkeleton/AdCardSkeleton';

import { styles } from './AdCardSkeletonGrid.styles';

type Props = {
  count?: number;
  faded?: boolean;
};

export function AdCardSkeletonGrid({ count = 6, faded = false }: Props) {
  const rows = Math.ceil(count / 2);
  return (
    <View style={[styles.wrap, faded && styles.faded]} accessibilityElementsHidden>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={styles.row}>
          <View style={styles.cell}>
            <AdCardSkeleton />
          </View>
          {row * 2 + 1 < count ? (
            <View style={styles.cell}>
              <AdCardSkeleton />
            </View>
          ) : (
            <View style={styles.cell} />
          )}
        </View>
      ))}
    </View>
  );
}
