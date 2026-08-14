import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  row: { gap: spacing.sm },
  gridItem: { flex: 1, maxWidth: '50%' },
  loader: { marginTop: 24 },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.muted,
    paddingHorizontal: spacing.lg,
  },
  refreshVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
});
