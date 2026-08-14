import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

import { styles } from './CategoryBentoSkeleton.styles';

export function CategoryBentoSkeleton() {
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={styles.heroRow}>
        <Skeleton style={styles.heroTile} />
        <View style={styles.sideCol}>
          <Skeleton style={styles.sideTile} />
          <Skeleton style={styles.sideTile} />
        </View>
      </View>
      <View style={styles.row}>
        <Skeleton style={styles.smallTile} />
        <Skeleton style={styles.smallTile} />
      </View>
    </View>
  );
}
