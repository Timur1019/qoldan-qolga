import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  gridWrap: {
    gap: 1,
    marginTop: 2,
  },
  gridPlace: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  gridDate: {
    fontSize: 11,
    color: colors.muted,
  },

  listWrap: {
    gap: 2,
    marginTop: 2,
  },
  listLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.locationDot,
  },
  listLocation: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  listDate: {
    fontSize: 12,
    color: colors.muted,
  },
});
