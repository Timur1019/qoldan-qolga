import { StyleSheet } from 'react-native';

import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  faded: {
    opacity: 0.72,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    maxWidth: '50%',
  },
});
