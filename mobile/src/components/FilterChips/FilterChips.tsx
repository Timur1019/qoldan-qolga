import { Pressable, Text, View } from 'react-native';

import type { FilterOption } from '@/constants/filterOptions';

import { styles } from './FilterChips.styles';

interface Props {
  options: FilterOption[];
  value: string[];
  onChange: (next: string[]) => void;
  /** Один выбор (saralash) */
  single?: boolean;
}

export function FilterChips({ options, value, onChange, single }: Props) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <Pressable
            key={o.value}
            style={[styles.chip, on && styles.chipOn]}
            onPress={() => {
              if (single) {
                onChange([o.value]);
                return;
              }
              onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value]);
            }}
          >
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
