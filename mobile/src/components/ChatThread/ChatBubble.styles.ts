import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  bubbleTheirs: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleMine,
    borderTopRightRadius: 4,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  textMine: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: 4,
  },
  time: {
    fontSize: 10,
    color: colors.muted,
  },
  timeMine: {
    color: 'rgba(255,255,255,0.72)',
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
  },
  fileLink: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 6,
  },
  fileLinkMine: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    marginBottom: 6,
  },
});
