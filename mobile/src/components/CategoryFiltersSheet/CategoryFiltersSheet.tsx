import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { referenceApi } from '@/api/client';
import {
  categoryFilterFlags,
  realEstateFieldFlags,
  transportFieldFlags,
} from '@/constants/categoryFilters';
import { SORT_OPTIONS } from '@/constants/filterOptions';
import { FilterChips } from '@/components/FilterChips/FilterChips';
import { LookupSheet, type LookupItem } from '@/components/LookupSheet/LookupSheet';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import {
  EMPTY_CATEGORY_FILTERS,
  type CategoryFiltersState,
} from '@/utils/categoryFiltersState';
import { localizedName } from '@/utils/localizedName';

import { CommonFiltersSection } from './CommonFiltersSection';
import { styles } from './CategoryFiltersSheet.styles';
import { RangeInputs, SectionTitle } from './FilterFieldRows';
import { RealEstateFiltersSection } from './RealEstateFiltersSection';
import { TransportFiltersSection } from './TransportFiltersSection';

export type { CategoryFiltersState };
export { EMPTY_CATEGORY_FILTERS };

export interface RegionOption {
  code: string;
  nameRu?: string;
  nameUz?: string;
  districts?: { id: number | string; nameRu?: string; nameUz?: string }[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  value: CategoryFiltersState;
  regions: RegionOption[];
  categoryCode?: string;
  breadcrumb?: CategoryDto[];
  onApply: (next: CategoryFiltersState) => void;
  onReset: () => void;
}

type LookupKind = 'region' | 'district' | null;

function useStateDraft(value: CategoryFiltersState, visible: boolean) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);
  return [draft, setDraft] as const;
}

export function CategoryFiltersSheet({
  visible,
  onClose,
  value,
  regions: regionsProp,
  categoryCode,
  breadcrumb = [],
  onApply,
  onReset,
}: Props) {
  const { language, t } = useLanguage();
  const [draft, setDraft] = useStateDraft(value, visible);
  const [lookup, setLookup] = useState<LookupKind>(null);
  const [regionsLocal, setRegionsLocal] = useState<RegionOption[]>([]);

  useEffect(() => {
    if (!visible) setLookup(null);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (regionsProp.length > 0) return;
    referenceApi
      .getRegions()
      .then((list) => setRegionsLocal(Array.isArray(list) ? (list as RegionOption[]) : []))
      .catch(() => setRegionsLocal([]));
  }, [visible, regionsProp.length]);

  const regions = regionsProp.length > 0 ? regionsProp : regionsLocal;

  const flags = useMemo(() => categoryFilterFlags(categoryCode, breadcrumb), [categoryCode, breadcrumb]);
  const transport = useMemo(() => transportFieldFlags(categoryCode, breadcrumb), [categoryCode, breadcrumb]);
  const realEstate = useMemo(() => realEstateFieldFlags(categoryCode, breadcrumb), [categoryCode, breadcrumb]);

  const regionItems: LookupItem[] = useMemo(
    () =>
      regions.map((r) => ({
        value: r.code,
        label: localizedName(r, language, r.code),
      })),
    [regions, language]
  );

  const selectedRegion = regions.find((r) => r.code === draft.region);
  const regionLabel = selectedRegion
    ? localizedName(selectedRegion, language, draft.region)
    : t('categories.allRegions', 'Barcha hududlar');

  const districtItems: LookupItem[] = useMemo(() => {
    const list = selectedRegion?.districts || [];
    return list.map((d) => {
      const label = localizedName(
        { nameUz: d.nameUz, nameRu: d.nameRu, id: d.id },
        language,
        String(d.id)
      );
      return { value: label, label };
    });
  }, [selectedRegion, language]);

  const patch = (partial: Partial<CategoryFiltersState>) => setDraft((p) => ({ ...p, ...partial }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrlar</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <SectionTitle>Hudud</SectionTitle>
            <Pressable style={styles.lookupBtn} onPress={() => setLookup('region')}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={styles.lookupBtnText} numberOfLines={1}>
                {regionLabel}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.muted} />
            </Pressable>

            {draft.region && districtItems.length > 0 ? (
              <>
                <SectionTitle>Tuman / shahar</SectionTitle>
                <Pressable style={styles.lookupBtn} onPress={() => setLookup('district')}>
                  <Ionicons name="map-outline" size={18} color={colors.primary} />
                  <Text style={styles.lookupBtnText} numberOfLines={1}>
                    {draft.district || 'Barchasi'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={colors.muted} />
                </Pressable>
              </>
            ) : null}

            {flags.price ? (
              <>
                <SectionTitle>Narx</SectionTitle>
                <RangeInputs
                  from={draft.priceFrom}
                  to={draft.priceTo}
                  fromPh="dan"
                  toPh="gacha"
                  onFrom={(priceFrom) => patch({ priceFrom })}
                  onTo={(priceTo) => patch({ priceTo })}
                />
              </>
            ) : null}

            <SectionTitle>Saralash</SectionTitle>
            <FilterChips
              single
              options={SORT_OPTIONS}
              value={[draft.sort]}
              onChange={(arr) =>
                patch({ sort: (arr[0] as CategoryFiltersState['sort']) || 'createdAt,desc' })
              }
            />

            <TransportFiltersSection flags={transport} draft={draft} patch={patch} />
            <RealEstateFiltersSection flags={realEstate} draft={draft} patch={patch} />
            <CommonFiltersSection
              flags={flags}
              draft={draft}
              patch={patch}
              categoryCode={categoryCode}
              breadcrumb={breadcrumb}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            >
              <Text style={styles.primaryBtnText}>Qo'llash</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => {
                onReset();
                onClose();
              }}
            >
              <Text style={styles.secondaryBtnText}>Tozalash</Text>
            </Pressable>
          </View>

          <LookupSheet
            mode="overlay"
            visible={lookup === 'region'}
            title="Hududni tanlang"
            items={regionItems}
            value={draft.region}
            onClose={() => setLookup(null)}
            onSelect={(region) => patch({ region, district: '' })}
            searchPlaceholder="Viloyat yoki shahar..."
          />
          <LookupSheet
            mode="overlay"
            visible={lookup === 'district'}
            title="Tuman / shahar"
            items={districtItems}
            value={draft.district}
            onClose={() => setLookup(null)}
            onSelect={(district) => patch({ district })}
            searchPlaceholder="Qidirish..."
          />
        </View>
      </View>
    </Modal>
  );
}
