import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  count: number;
  children: ReactNode;
}


/** Badge на иконке таба (как на скрине BirBir, цвет — бренд сайта). */
export function TabBarBadge({ count, children }: Props) {
  if (!count || count <= 0) return <>{children}</>;
  const label = count > 99 ? '99+' : String(count);
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      {children}
      <View
        style={{
          position: 'absolute',
          top: -4,
          right: -10,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
          borderWidth: 1.5,
          borderColor: colors.white,
        }}
      >
        <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700' }}>{label}</Text>
      </View>
    </View>
  );
}
