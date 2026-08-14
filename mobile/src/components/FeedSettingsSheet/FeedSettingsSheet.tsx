import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { referenceApi } from '@/api/client';
import { LookupSheet, type LookupItem } from '@/components/LookupSheet/LookupSheet';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import { localizedName } from '@/utils/localizedName';

import { FeedInterestsPicker } from './FeedInterestsPicker';
import { styles } from './FeedSettingsSheet.styles';

export interface RegionOption {
  code: string;
  nameRu?: string;
  nameUz?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  regionCode: string;
  categories: CategoryDto[];
  selectedCodes: string[];
  onChangeInterests: (codes: string[]) => void;
  onChangeRegion: (code: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function FeedSettingsSheet({
  visible,
  onClose,
  regionCode,
  categories,
  selectedCodes,
  onChangeInterests,
  onChangeRegion,
  onSave,
  onReset,
}: Props) {
  const { language, t } = useLanguage();
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [regionLookup, setRegionLookup] = useState(false);

  useEffect(() => {
    if (!visible) {
      setRegionLookup(false);
      return;
    }
    referenceApi
      .getRegions()
      .then((list) => setRegions(Array.isArray(list) ? (list as RegionOption[]) : []))
      .catch(() => setRegions([]));
  }, [visible]);

  const regionItems: LookupItem[] = useMemo(
    () =>
      regions.map((r) => ({
        value: r.code,
        label: localizedName(r, language, r.code),
      })),
    [regions, language]
  );

  const selectedRegion = regions.find((r) => r.code === regionCode);
  const regionLabel = selectedRegion
    ? localizedName(selectedRegion, language, regionCode)
    : regionCode
      ? regionCode
      : t('categories.allRegions', 'Barcha hududlar');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.feed')}</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Qayerdan qidirish</Text>
              <Pressable style={styles.regionRow} onPress={() => setRegionLookup(true)}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text style={styles.regionText}>{regionLabel}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Qiziqishlaringiz</Text>
              <Text style={styles.sectionHint}>Belgilang yoki ichiga kiring (›)</Text>
              <FeedInterestsPicker
                roots={categories}
                selectedCodes={selectedCodes}
                onChange={onChangeInterests}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.primaryBtn} onPress={onSave}>
              <Text style={styles.primaryBtnText}>Saqlash</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={onReset}>
              <Text style={styles.secondaryBtnText}>Sozlamalarni tiklash</Text>
            </Pressable>
          </View>

          <LookupSheet
            mode="overlay"
            visible={regionLookup}
            title="Hududni tanlang"
            items={regionItems}
            value={regionCode}
            onClose={() => setRegionLookup(false)}
            onSelect={(code) => onChangeRegion(code)}
            searchPlaceholder="Viloyat yoki shahar..."
            clearLabel="Barcha hududlar"
          />
        </View>
      </View>
    </Modal>
  );
}
