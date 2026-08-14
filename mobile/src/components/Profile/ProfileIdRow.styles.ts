import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
  },
});
