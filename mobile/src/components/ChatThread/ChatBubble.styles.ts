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
  time: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.72)',
  },
});
