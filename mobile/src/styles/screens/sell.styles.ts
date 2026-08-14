import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgMuted },
  guestWrap: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  secondaryBtnText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: 100,
    flexGrow: 1,
  },
  loader: { marginTop: 24 },
  fab: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
