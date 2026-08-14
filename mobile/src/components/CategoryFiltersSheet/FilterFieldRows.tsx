import { Text, TextInput, View, Switch } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './CategoryFiltersSheet.styles';

export function RangeInputs({
  from,
  to,
  onFrom,
  onTo,
  fromPh,
  toPh,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  fromPh: string;
  toPh: string;
}) {
  return (
    <View style={styles.priceRow}>
      <TextInput
        style={styles.input}
        placeholder={fromPh}
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        value={from}
        onChangeText={onFrom}
      />
      <Text style={styles.dash}>—</Text>
      <TextInput
        style={styles.input}
        placeholder={toPh}
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        value={to}
        onChangeText={onTo}
      />
    </View>
  );
}

export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}
