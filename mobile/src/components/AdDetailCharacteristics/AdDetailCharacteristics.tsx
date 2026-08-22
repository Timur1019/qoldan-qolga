import { Text, View } from 'react-native';

import type { CharacteristicRow } from '@/utils/adCharacteristicRows';

import { styles } from './AdDetailCharacteristics.styles';

type Props = {
  title: string;
  rows: CharacteristicRow[];
};

export function AdDetailCharacteristics({ title, rows }: Props) {
  if (!rows.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {rows.map((row) => (
          <View key={`${row.label}-${row.value}`} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
