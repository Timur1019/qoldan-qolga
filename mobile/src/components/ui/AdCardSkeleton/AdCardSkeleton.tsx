import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

import { styles } from './AdCardSkeleton.styles';

type Variant = 'grid' | 'list';

export function AdCardSkeleton({ variant = 'grid' }: { variant?: Variant }) {
  if (variant === 'list') {
    return (
      <View style={styles.listCard}>
        <Skeleton style={styles.listImage} />
        <View style={styles.listBody}>
          <Skeleton style={styles.listTitle} />
          <Skeleton style={styles.listPrice} />
          <Skeleton style={styles.listMeta} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gridCard}>
      <Skeleton style={styles.gridImage} />
      <View style={styles.gridBody}>
        <Skeleton style={styles.gridPrice} />
        <Skeleton style={styles.gridTitle} />
      </View>
    </View>
  );
}
