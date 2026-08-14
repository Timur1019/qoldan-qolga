import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    left: 0,
    bottom: 8,
    zIndex: 3,
    gap: 4,
    maxWidth: '90%',
  },
  ribbonRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  notch: {
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ribbonBody: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
