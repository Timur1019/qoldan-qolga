import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { CreateAdExtrasSection } from '@/components/CreateAdForm/CreateAdExtrasSection';
import { CreateAdLocationSection } from '@/components/CreateAdForm/CreateAdLocationSection';
import { CreateAdRealEstateSection } from '@/components/CreateAdForm/CreateAdRealEstateSection';
import { CreateAdJobSection } from '@/components/CreateAdForm/CreateAdJobSection';
import { CreateAdTransportSection } from '@/components/CreateAdForm/CreateAdTransportSection';
import type {
  CategoryFilterFlags,
  RealEstateFieldFlags,
  TransportFieldFlags,
} from '@/constants/categoryFilters';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import type { CreateAdFormState } from '@/utils/createAdForm';
import type { EditAdSectionKey } from '@/utils/editAdSummary';
import type { MatchableRegion } from '@/utils/matchRegionFromAddress';
import { localizedName } from '@/utils/localizedName';

import { styles as createStyles } from '@/styles/screens/createAd.styles';
import { styles } from './EditAdSectionSheet.styles';

const TITLE_KEYS: Record<EditAdSectionKey, string> = {
  category: 'edit.category',
  photos: 'edit.photos',
  title: 'edit.adTitle',
  price: 'edit.price',
  specs: 'edit.specs',
  description: 'edit.description',
  location: 'edit.location',
  contact: 'edit.contact',
};

interface Props {
  section: EditAdSectionKey | null;
  form: CreateAdFormState;
  existingImageUrls: string[];
  transport: TransportFieldFlags;
  realEstate: RealEstateFieldFlags;
  flags: CategoryFilterFlags;
  regionLabel: string;
  hasDistricts: boolean;
  regions?: MatchableRegion[];
  onClose: () => void;
  patch: (partial: Partial<CreateAdFormState>) => void;
  setExistingImageUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  onOpenCategory: () => void;
  onOpenRegion: () => void;
  onOpenDistrict: () => void;
  onOpenBrand: () => void;
  onOpenModel?: () => void;
  hasModels?: boolean;
  breadcrumb?: CategoryDto[];
  onPickImages: () => void;
}

export function EditAdSectionSheet({
  section,
  form,
  existingImageUrls,
  transport,
  realEstate,
  flags,
  regionLabel,
  hasDistricts,
  regions = [],
  onClose,
  patch,
  setExistingImageUrls,
  onOpenCategory,
  onOpenRegion,
  onOpenDistrict,
  onOpenBrand,
  onOpenModel,
  hasModels,
  breadcrumb = [],
  onPickImages,
}: Props) {
  const { language, t } = useLanguage();
  if (!section) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.head}>
            <Text style={styles.title}>{t(TITLE_KEYS[section])}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {section === 'category' ? (
              <Pressable style={createStyles.selectBtn} onPress={onOpenCategory}>
                <Ionicons name="grid-outline" size={18} color={colors.primary} />
                <Text
                  style={[
                    createStyles.selectText,
                    !form.category && createStyles.selectPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {form.category
                    ? localizedName(form.category, language)
                    : t('categories.select', 'Tanlang')}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.muted} />
              </Pressable>
            ) : null}

            {section === 'photos' ? (
              <View style={createStyles.photos}>
                {existingImageUrls.map((uri) => (
                  <View key={uri} style={createStyles.photoWrap}>
                    <Image source={{ uri: imageUrl(uri) }} style={createStyles.photo} />
                    <Pressable
                      style={createStyles.photoRemove}
                      onPress={() => setExistingImageUrls((prev) => prev.filter((u) => u !== uri))}
                    >
                      <Ionicons name="close" size={14} color={colors.white} />
                    </Pressable>
                  </View>
                ))}
                {form.localImages.map((uri) => (
                  <View key={uri} style={createStyles.photoWrap}>
                    <Image source={{ uri }} style={createStyles.photo} />
                    <Pressable
                      style={createStyles.photoRemove}
                      onPress={() =>
                        patch({ localImages: form.localImages.filter((u) => u !== uri) })
                      }
                    >
                      <Ionicons name="close" size={14} color={colors.white} />
                    </Pressable>
                  </View>
                ))}
                {existingImageUrls.length + form.localImages.length < 6 ? (
                  <Pressable style={createStyles.photoAdd} onPress={onPickImages}>
                    <Ionicons name="camera-outline" size={22} color={colors.muted} />
                    <Text style={createStyles.photoAddText}>Qo'shish</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            {section === 'title' ? (
              <TextInput
                style={createStyles.input}
                value={form.title}
                onChangeText={(title) => patch({ title })}
                placeholder="Sarlavha"
                placeholderTextColor={colors.muted}
              />
            ) : null}

            {section === 'description' ? (
              <TextInput
                style={[createStyles.input, createStyles.textArea]}
                value={form.description}
                onChangeText={(description) => patch({ description })}
                placeholder="Tavsif"
                placeholderTextColor={colors.muted}
                multiline
              />
            ) : null}

            {section === 'price' ? (
              <View style={{ gap: 12 }}>
                <View style={createStyles.row}>
                  <TextInput
                    style={[createStyles.input, createStyles.flex]}
                    value={form.price}
                    onChangeText={(price) => patch({ price })}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.muted}
                    editable={!form.giveAway}
                  />
                  <View style={createStyles.chipRow}>
                    {(['UZS', 'USD'] as const).map((c) => (
                      <Pressable
                        key={c}
                        style={[createStyles.chip, form.currency === c && createStyles.chipOn]}
                        onPress={() => patch({ currency: c })}
                      >
                        <Text
                          style={[
                            createStyles.chipText,
                            form.currency === c && createStyles.chipTextOn,
                          ]}
                        >
                          {c}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <CreateAdExtrasSection flags={flags} form={form} patch={patch} breadcrumb={breadcrumb} />
              </View>
            ) : null}

            {section === 'specs' ? (
              <View style={{ gap: 12 }}>
                <CreateAdTransportSection
                  flags={transport}
                  form={form}
                  patch={patch}
                  onOpenBrand={onOpenBrand}
                  onOpenModel={onOpenModel}
                  hasModels={hasModels}
                />
                <CreateAdRealEstateSection flags={realEstate} form={form} patch={patch} />
                <CreateAdJobSection
                  categoryCode={form.category?.code}
                  breadcrumb={breadcrumb}
                  form={form}
                  patch={patch}
                />
                <CreateAdExtrasSection flags={flags} form={form} patch={patch} breadcrumb={breadcrumb} />
              </View>
            ) : null}

            {section === 'location' ? (
              <CreateAdLocationSection
                form={form}
                patch={patch}
                regionLabel={regionLabel}
                onOpenRegion={onOpenRegion}
                onOpenDistrict={onOpenDistrict}
                hasDistricts={hasDistricts}
                regions={regions}
              />
            ) : null}

            {section === 'contact' ? (
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={createStyles.label}>Telefon *</Text>
                  <TextInput
                    style={createStyles.input}
                    value={form.phone}
                    onChangeText={(phone) => patch({ phone })}
                    keyboardType="phone-pad"
                    placeholder="+998..."
                    placeholderTextColor={colors.muted}
                  />
                </View>
                <View>
                  <Text style={createStyles.label}>Telegram</Text>
                  <TextInput
                    style={createStyles.input}
                    value={form.telegramUsername}
                    onChangeText={(telegramUsername) => patch({ telegramUsername })}
                    placeholder="@username"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ) : null}
          </ScrollView>

          <Pressable style={styles.done} onPress={onClose}>
            <Text style={styles.doneText}>{t('edit.done')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
