import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const LIST_IMAGE = 112;

export const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
  },

  /* —— grid (главная) —— */
  gridCard: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  gridImageWrap: {
    aspectRatio: 1,
    backgroundColor: colors.bgSubtle,
    position: 'relative',
    borderRadius: radius.image,
    overflow: 'hidden',
  },
  gridBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(17,24,39,0.75)',
  },
  gridBadgeText: { color: colors.white, fontSize: 10, fontWeight: '600' },
  gridFavoriteBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 6,
  },
  gridBody: { paddingTop: spacing.sm, paddingHorizontal: 2, gap: 2 },
  gridPrice: { fontWeight: '700', fontSize: 15, color: colors.text },
  gridTitle: { fontSize: 13, color: colors.text, lineHeight: 17 },

  /* —— list (категории) —— */
  listCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  listImageWrap: {
    width: LIST_IMAGE,
    height: LIST_IMAGE,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    position: 'relative',
  },
  listBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  listBadgeText: { fontSize: 10, fontWeight: '600', color: colors.text },
  listBody: { flex: 1, minWidth: 0, gap: 4 },
  listTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  listTitle: { flex: 1, fontSize: 14, lineHeight: 18, color: colors.text },
  listFavoriteBtn: { marginTop: -2, padding: 2 },
  listPrice: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 2 },
});
