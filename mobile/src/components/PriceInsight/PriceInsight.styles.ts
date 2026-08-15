import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
    padding: spacing.sm,
  },
  inline: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.94)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  hint: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
  },
  track: {
    height: 14,
    justifyContent: 'center',
  },
  trackRow: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackSeg: {
    flex: 1,
    height: 6,
  },
  marker: {
    position: 'absolute',
    width: 13,
    height: 13,
    marginLeft: -6.5,
    borderRadius: 7,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
  },
  excellent: { color: '#15803d' },
  good: { color: '#3f6212' },
  fair: { color: '#a16207' },
  high: { color: '#c2410c' },
});
