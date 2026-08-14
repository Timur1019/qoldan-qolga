import { Pressable, Switch, Text, TextInput, View } from 'react-native';

import type { RealEstateFieldFlags } from '@/constants/categoryFilters';
import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
  type FilterOption,
} from '@/constants/filterOptions';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';

import { styles } from '@/styles/screens/createAd.styles';

interface Props {
  flags: RealEstateFieldFlags;
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
}

function ChipSelect({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <View style={styles.chipRow}>
        {options.map((o) => {
          const on = value === o.value;
          return (
            <Pressable
              key={o.value}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => onChange(o.value)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CreateAdRealEstateSection({ flags, form, patch }: Props) {
  const { t } = useLanguage();
  if (!flags.realEstate) return null;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Ko'chmas mulk</Text>

      {flags.dealType ? (
        <ChipSelect
          label="Bitim turi"
          required
          value={form.dealType}
          options={DEAL_TYPE_OPTIONS}
          onChange={(dealType) => patch({ dealType: dealType as CreateAdFormState['dealType'] })}
        />
      ) : null}

      {flags.rooms ? (
        <ChipSelect
          label="Xonalar"
          required
          value={form.rooms}
          options={ROOMS_OPTIONS}
          onChange={(rooms) => patch({ rooms })}
        />
      ) : null}

      {flags.area ? (
        <View>
          <Text style={styles.label}>Maydon (m²) *</Text>
          <TextInput
            style={styles.input}
            value={form.areaM2}
            onChangeText={(areaM2) => patch({ areaM2 })}
            keyboardType="decimal-pad"
            placeholder="65"
            placeholderTextColor={colors.muted}
          />
        </View>
      ) : null}

      {flags.landArea ? (
        <View>
          <Text style={styles.label}>Yer maydoni (m²) *</Text>
          <TextInput
            style={styles.input}
            value={form.landAreaM2}
            onChangeText={(landAreaM2) => patch({ landAreaM2 })}
            keyboardType="decimal-pad"
            placeholder="400"
            placeholderTextColor={colors.muted}
          />
        </View>
      ) : null}

      {flags.floor || flags.floorsTotal ? (
        <View style={styles.row}>
          {flags.floor ? (
            <View style={styles.flex}>
              <Text style={styles.label}>Qavat *</Text>
              <TextInput
                style={styles.input}
                value={form.floor}
                onChangeText={(floor) => patch({ floor })}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor={colors.muted}
              />
            </View>
          ) : null}
          {flags.floorsTotal ? (
            <View style={styles.flex}>
              <Text style={styles.label}>Qavatlar soni</Text>
              <TextInput
                style={styles.input}
                value={form.floorsTotal}
                onChangeText={(floorsTotal) => patch({ floorsTotal })}
                keyboardType="numeric"
                placeholder="9"
                placeholderTextColor={colors.muted}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      {flags.buildingType ? (
        <ChipSelect
          label="Uy turi"
          value={form.buildingType}
          options={BUILDING_TYPE_OPTIONS}
          onChange={(buildingType) => patch({ buildingType })}
        />
      ) : null}
      {flags.renovation ? (
        <ChipSelect
          label="Ta'mir"
          value={form.renovation}
          options={RENOVATION_OPTIONS}
          onChange={(renovation) => patch({ renovation })}
        />
      ) : null}

      {flags.furnished ? (
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Mebel bilan</Text>
          <Switch
            value={form.furnished}
            onValueChange={(furnished) => patch({ furnished })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      ) : null}

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t('ads.onlineShowing')}</Text>
        <Switch
          value={form.onlineShowing}
          onValueChange={(onlineShowing) => patch({ onlineShowing })}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
    </View>
  );
}
