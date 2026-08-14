import { Pressable, Text, TextInput, View } from 'react-native';

import type { TransportFieldFlags } from '@/constants/categoryFilters';
import {
  BODY_TYPE_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  FUEL_TYPE_OPTIONS,
  OWNERS_COUNT_OPTIONS,
  SEATS_OPTIONS,
  STEERING_OPTIONS,
  TRANSMISSION_OPTIONS,
  type FilterOption,
} from '@/constants/filterOptions';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';

import { styles } from '@/styles/screens/createAd.styles';

interface Props {
  flags: TransportFieldFlags;
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
  onOpenBrand: () => void;
}

function ChipSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((o) => {
          const on = value === o.value;
          return (
            <Pressable
              key={o.value}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => onChange(on ? '' : o.value)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function CreateAdTransportSection({ flags, form, patch, onOpenBrand }: Props) {
  const { t } = useLanguage();
  if (!flags.motorVehicle) return null;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Transport</Text>

      {flags.brand ? (
        <View>
          <Text style={styles.label}>Brend{flags.cars ? ' *' : ''}</Text>
          <Pressable style={styles.selectBtn} onPress={onOpenBrand}>
            <Text style={[styles.selectText, !form.brandId && styles.selectPlaceholder]} numberOfLines={1}>
              {form.brandLabel || 'Tanlang'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {flags.model ? (
        <View>
          <Text style={styles.label}>Model{flags.cars ? ' *' : ''}</Text>
          <TextInput
            style={styles.input}
            value={form.modelCustom}
            onChangeText={(modelCustom) => patch({ modelCustom, modelId: '' })}
            placeholder="Cobalt, Malibu..."
            placeholderTextColor={colors.muted}
          />
        </View>
      ) : null}

      {flags.year || flags.mileage ? (
        <View style={styles.row}>
          {flags.year ? (
            <View style={styles.flex}>
              <Text style={styles.label}>Yil{flags.cars ? ' *' : ''}</Text>
              <TextInput
                style={styles.input}
                value={form.year}
                onChangeText={(year) => patch({ year })}
                keyboardType="numeric"
                placeholder="2020"
                placeholderTextColor={colors.muted}
              />
            </View>
          ) : null}
          {flags.mileage ? (
            <View style={styles.flex}>
              <Text style={styles.label}>Yurgani (km){flags.cars ? ' *' : ''}</Text>
              <TextInput
                style={styles.input}
                value={form.mileage}
                onChangeText={(mileage) => patch({ mileage })}
                keyboardType="numeric"
                placeholder="50000"
                placeholderTextColor={colors.muted}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      {flags.engineVolume ? (
        <View>
          <Text style={styles.label}>{t('ads.engineVolumeLabel')}</Text>
          <TextInput
            style={styles.input}
            value={form.engineVolume}
            onChangeText={(engineVolume) => patch({ engineVolume })}
            keyboardType="decimal-pad"
            placeholder="1.6"
            placeholderTextColor={colors.muted}
          />
          <Text style={styles.hint}>{t('ads.engineVolumeHint')}</Text>
        </View>
      ) : null}

      {flags.bodyType ? (
        <ChipSelect
          label="Kuzov"
          value={form.bodyType}
          options={BODY_TYPE_OPTIONS}
          onChange={(bodyType) => patch({ bodyType })}
        />
      ) : null}
      {flags.transmission ? (
        <ChipSelect
          label="Uzatma"
          value={form.transmission}
          options={TRANSMISSION_OPTIONS}
          onChange={(transmission) => patch({ transmission })}
        />
      ) : null}
      {flags.fuelType ? (
        <ChipSelect
          label="Yoqilg'i"
          value={form.fuelType}
          options={FUEL_TYPE_OPTIONS}
          onChange={(fuelType) => patch({ fuelType })}
        />
      ) : null}
      {flags.driveType ? (
        <ChipSelect
          label="Privod"
          value={form.driveType}
          options={DRIVE_TYPE_OPTIONS}
          onChange={(driveType) => patch({ driveType })}
        />
      ) : null}
      {flags.steering ? (
        <ChipSelect
          label="Rul"
          value={form.steering}
          options={STEERING_OPTIONS}
          onChange={(steering) => patch({ steering })}
        />
      ) : null}
      {flags.exteriorColor ? (
        <ChipSelect
          label="Rang"
          value={form.exteriorColor}
          options={EXTERIOR_COLOR_OPTIONS}
          onChange={(exteriorColor) => patch({ exteriorColor })}
        />
      ) : null}
      {flags.ownersCount ? (
        <ChipSelect
          label="Egalar soni"
          value={form.ownersCount}
          options={OWNERS_COUNT_OPTIONS}
          onChange={(ownersCount) => patch({ ownersCount })}
        />
      ) : null}
      {flags.seats ? (
        <ChipSelect
          label="O'rindiqlar"
          value={form.seats}
          options={SEATS_OPTIONS}
          onChange={(seats) => patch({ seats })}
        />
      ) : null}
    </View>
  );
}
