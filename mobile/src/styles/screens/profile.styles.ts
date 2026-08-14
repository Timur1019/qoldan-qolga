import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMuted,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  loader: {
    marginTop: 48,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
