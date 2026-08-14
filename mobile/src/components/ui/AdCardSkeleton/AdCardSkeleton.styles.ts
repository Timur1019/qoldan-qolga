import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    width: '100%',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.image,
  },
  gridBody: {
    paddingTop: spacing.sm,
    gap: 6,
  },
  gridTitle: {
    height: 14,
    width: '88%',
    borderRadius: 6,
  },
  gridPrice: {
    height: 16,
    width: '52%',
    borderRadius: 6,
  },
  listCard: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    marginBottom: spacing.sm,
  },
  listImage: {
    width: 112,
    height: 112,
    borderRadius: radius.md,
  },
  listBody: {
    flex: 1,
    gap: 8,
    paddingTop: 4,
  },
  listTitle: {
    height: 14,
    width: '90%',
    borderRadius: 6,
  },
  listPrice: {
    height: 16,
    width: '45%',
    borderRadius: 6,
  },
  listMeta: {
    height: 12,
    width: '70%',
    borderRadius: 6,
  },
});
