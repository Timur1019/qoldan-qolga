import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { adsApi, imageUrl, referenceApi } from '@/api/client';
import { CategoryTreeSheet } from '@/components/CategoryTreeSheet/CategoryTreeSheet';
import { CreateAdExtrasSection } from '@/components/CreateAdForm/CreateAdExtrasSection';
import { CreateAdLocationSection } from '@/components/CreateAdForm/CreateAdLocationSection';
import { CreateAdRealEstateSection } from '@/components/CreateAdForm/CreateAdRealEstateSection';
import { CreateAdTransportSection } from '@/components/CreateAdForm/CreateAdTransportSection';
import { EditAdSectionSheet } from '@/components/EditAd/EditAdSectionSheet';
import { EditAdSummary } from '@/components/EditAd/EditAdSummary';
import { LookupSheet, type LookupItem } from '@/components/LookupSheet/LookupSheet';
import {
  categoryFilterFlags,
  realEstateFieldFlags,
  transportFieldFlags,
} from '@/constants/categoryFilters';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import type { AdDetailDto, CategoryDto } from '@/types/api';
import {
  EMPTY_CREATE_AD,
  buildCreateAdPayload,
  resetCategoryFields,
  validateCreateAd,
  type CreateAdFormState,
} from '@/utils/createAdForm';
import { buildEditAdSummary, type EditAdSectionKey } from '@/utils/editAdSummary';
import { localizedName } from '@/utils/localizedName';
import { mapAdDetailToCreateForm } from '@/utils/mapAdDetailToCreateForm';

import { styles } from '@/styles/screens/createAd.styles';

type RegionDto = {
  code: string;
  nameUz?: string;
  nameRu?: string;
  districts?: { id: number | string; nameUz?: string; nameRu?: string }[];
};

type BrandDto = { id: string; nameUz?: string; nameRu?: string };

type LookupKind = 'region' | 'district' | 'brand' | null;

export default function CreateAdScreen() {
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = Array.isArray(params.editId) ? params.editId[0] : params.editId;
  const isEdit = Boolean(editId);

  const { isAuthenticated, user } = useAuth();
  const requireAuth = useRequireAuth();
  const { language, t } = useLanguage();
  const [form, setForm] = useState<CreateAdFormState>(() => ({
    ...EMPTY_CREATE_AD,
    phone: typeof user?.phone === 'string' ? user.phone : '',
  }));
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));
  const [breadcrumb, setBreadcrumb] = useState<CategoryDto[]>([]);
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [lookup, setLookup] = useState<LookupKind>(null);
  const [editSection, setEditSection] = useState<EditAdSectionKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    referenceApi
      .getRegions()
      .then((list) => setRegions(Array.isArray(list) ? (list as RegionDto[]) : []))
      .catch(() => setRegions([]));
  }, [isAuthenticated]);

  useEffect(() => {
    const phone = typeof user?.phone === 'string' ? user.phone : '';
    if (phone && !form.phone) setForm((p) => ({ ...p, phone }));
  }, [user, form.phone]);

  useEffect(() => {
    if (!editId || !isAuthenticated) {
      setLoadingEdit(false);
      return;
    }
    let alive = true;
    setLoadingEdit(true);
    adsApi
      .getById(editId)
      .then(async (raw) => {
        const ad = raw as AdDetailDto;
        let category: CategoryDto | null = null;
        try {
          category = (await referenceApi.getCategory(ad.category)) as CategoryDto;
        } catch {
          category = ad.category
            ? ({ code: ad.category, nameUz: ad.category, nameRu: ad.category } as CategoryDto)
            : null;
        }
        if (!alive) return;
        const mapped = mapAdDetailToCreateForm(ad, category);
        setForm(mapped.form);
        setExistingImageUrls(mapped.existingImageUrls);
        if (category?.code) {
          try {
            const list = await referenceApi.getCategoryBreadcrumb(category.code);
            if (alive) setBreadcrumb(Array.isArray(list) ? (list as CategoryDto[]) : []);
          } catch {
            if (alive) setBreadcrumb([]);
          }
        }
      })
      .catch(() => {
        if (alive) {
          setError("E'lonni yuklab bo'lmadi");
        }
      })
      .finally(() => {
        if (alive) setLoadingEdit(false);
      });
    return () => {
      alive = false;
    };
  }, [editId, isAuthenticated]);

  const patch = (partial: Partial<CreateAdFormState>) => setForm((p) => ({ ...p, ...partial }));

  const categoryCode = form.category?.code;
  const transport = useMemo(
    () => transportFieldFlags(categoryCode, breadcrumb),
    [categoryCode, breadcrumb]
  );
  const realEstate = useMemo(
    () => realEstateFieldFlags(categoryCode, breadcrumb),
    [categoryCode, breadcrumb]
  );
  const flags = useMemo(
    () => categoryFilterFlags(categoryCode, breadcrumb),
    [categoryCode, breadcrumb]
  );

  useEffect(() => {
    if (!form.category || !transport.brand) {
      setBrands([]);
      return;
    }
    referenceApi
      .getBrandsByCategory(form.category.code)
      .then((list) => setBrands(Array.isArray(list) ? (list as BrandDto[]) : []))
      .catch(() => setBrands([]));
  }, [form.category, transport.brand]);

  const selectedRegion = regions.find((r) => r.code === form.region);
  const regionLabel = selectedRegion
    ? localizedName(selectedRegion, language, form.region)
    : t('categories.region', 'Hudud');
  const regionItems: LookupItem[] = useMemo(
    () => regions.map((r) => ({ value: r.code, label: localizedName(r, language, r.code) })),
    [regions, language]
  );
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
  const brandItems: LookupItem[] = useMemo(
    () => brands.map((b) => ({ value: b.id, label: localizedName(b, language, b.id) })),
    [brands, language]
  );

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Ruxsat kerak', "Galereyaga kirishga ruxsat bering");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 6,
    });
    if (result.canceled) return;
    const uris = result.assets.map((a) => a.uri).slice(0, 6);
    patch({ localImages: [...form.localImages, ...uris].slice(0, 6) });
  };

  const onCategorySelect = async (cat: CategoryDto) => {
    patch(resetCategoryFields({ category: cat }));
    try {
      const list = await referenceApi.getCategoryBreadcrumb(cat.code);
      setBreadcrumb(Array.isArray(list) ? (list as CategoryDto[]) : []);
    } catch {
      setBreadcrumb([]);
    }
  };

  const submit = async () => {
    setError('');
    const validation = validateCreateAd(form, breadcrumb);
    if (validation) {
      setError(validation);
      return;
    }
    setSubmitting(true);
    try {
      const urls: string[] = [...existingImageUrls];
      for (let i = 0; i < form.localImages.length; i++) {
        const uri = form.localImages[i];
        const url = await adsApi.upload(uri);
        urls.push(url);
      }
      const body = buildCreateAdPayload(form, urls, breadcrumb);
      if (isEdit && editId) {
        await adsApi.update(editId, body);
        router.replace(`/ads/${editId}`);
      } else {
        const created = (await adsApi.create(body)) as { id?: string };
        if (created?.id) router.replace(`/ads/${created.id}`);
        else router.replace('/(tabs)/sell');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: isEdit ? t('edit.title') : t('create.title') }} />
        <View style={{ padding: 24, gap: 12 }}>
          <Text style={styles.label}>{t('common.loginRequired')}</Text>
          <Pressable
            style={styles.submit}
            onPress={() =>
              requireAuth(() =>
                router.replace(isEdit && editId ? `/ads/create?editId=${editId}` : '/ads/create')
              )
            }
          >
            <Text style={styles.submitText}>{t('common.login')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: t('edit.title') }} />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const editSections = buildEditAdSummary(form, {
    existingImageCount: existingImageUrls.length,
    regionLabel: selectedRegion ? localizedName(selectedRegion, language, '') : '',
    language,
    t,
  });

  const sheets = (
    <>
      <CategoryTreeSheet
        visible={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        onSelect={onCategorySelect}
      />

      <LookupSheet
        visible={lookup === 'region'}
        title={t('create.region')}
        items={regionItems}
        value={form.region}
        onClose={() => setLookup(null)}
        onSelect={(region) => patch({ region, district: '' })}
        clearLabel={t('categories.allRegions')}
      />
      <LookupSheet
        visible={lookup === 'district'}
        title={t('create.district')}
        items={districtItems}
        value={form.district}
        onClose={() => setLookup(null)}
        onSelect={(district) => patch({ district })}
      />
      <LookupSheet
        visible={lookup === 'brand'}
        title={t('create.brand')}
        items={brandItems}
        value={form.brandId}
        allowClear={false}
        onClose={() => setLookup(null)}
        onSelect={(brandId) => {
          const b = brands.find((x) => x.id === brandId);
          patch({
            brandId,
            brandLabel: b ? localizedName(b, language, brandId) : brandId,
            modelId: '',
            modelCustom: '',
          });
        }}
      />
    </>
  );

  if (isEdit) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: t('edit.title') }} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <EditAdSummary
            sections={editSections}
            form={form}
            existingImageUrls={existingImageUrls}
            showDeliverToggle={flags.canDeliver}
            onEdit={setEditSection}
            onToggleDeliver={(canDeliver) => patch({ canDeliver })}
          />
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.submit, submitting && styles.submitDisabled]}
            onPress={() => void submit()}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitText}>{t('edit.publish')}</Text>
            )}
          </Pressable>
        </View>

        <EditAdSectionSheet
          section={editSection}
          form={form}
          existingImageUrls={existingImageUrls}
          transport={transport}
          realEstate={realEstate}
          flags={flags}
          regionLabel={regionLabel}
          hasDistricts={districtItems.length > 0}
          onClose={() => setEditSection(null)}
          patch={patch}
          setExistingImageUrls={setExistingImageUrls}
          onOpenCategory={() => setCategoryOpen(true)}
          onOpenRegion={() => setLookup('region')}
          onOpenDistrict={() => setLookup('district')}
          onOpenBrand={() => setLookup('brand')}
          onPickImages={() => void pickImages()}
        />
        {sheets}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('create.title') }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.label}>{t('create.photos')}</Text>
          <View style={styles.photos}>
            {existingImageUrls.map((uri) => (
              <View key={uri} style={styles.photoWrap}>
                <Image source={{ uri: imageUrl(uri) }} style={styles.photo} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => setExistingImageUrls((prev) => prev.filter((u) => u !== uri))}
                >
                  <Ionicons name="close" size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
            {form.localImages.map((uri) => (
              <View key={uri} style={styles.photoWrap}>
                <Image source={{ uri }} style={styles.photo} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => patch({ localImages: form.localImages.filter((u) => u !== uri) })}
                >
                  <Ionicons name="close" size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
            {existingImageUrls.length + form.localImages.length < 6 ? (
              <Pressable style={styles.photoAdd} onPress={pickImages}>
                <Ionicons name="camera-outline" size={22} color={colors.muted} />
                <Text style={styles.photoAddText}>{t('common.add')}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View>
          <Text style={styles.label}>{t('create.category')}</Text>
          <Pressable style={styles.selectBtn} onPress={() => setCategoryOpen(true)}>
            <Ionicons name="grid-outline" size={18} color={colors.primary} />
            <Text
              style={[styles.selectText, !form.category && styles.selectPlaceholder]}
              numberOfLines={1}
            >
              {form.category ? localizedName(form.category, language) : t('categories.select')}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.muted} />
          </Pressable>
        </View>

        <View>
          <Text style={styles.label}>{t('create.adTitle')}</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(title) => patch({ title })}
            placeholder={t('create.titlePlaceholder')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View>
          <Text style={styles.label}>{t('create.description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(description) => patch({ description })}
            placeholder={t('create.descPlaceholder')}
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>

        <View>
          <Text style={styles.label}>{t('create.price')}</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex]}
              value={form.price}
              onChangeText={(price) => patch({ price })}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.muted}
              editable={!form.giveAway}
            />
            <View style={styles.chipRow}>
              {(['UZS', 'USD'] as const).map((c) => (
                <Pressable
                  key={c}
                  style={[styles.chip, form.currency === c && styles.chipOn]}
                  onPress={() => patch({ currency: c })}
                >
                  <Text style={[styles.chipText, form.currency === c && styles.chipTextOn]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <CreateAdTransportSection
          flags={transport}
          form={form}
          patch={patch}
          onOpenBrand={() => setLookup('brand')}
        />
        <CreateAdRealEstateSection flags={realEstate} form={form} patch={patch} />
        <CreateAdExtrasSection flags={flags} form={form} patch={patch} />

        <CreateAdLocationSection
          form={form}
          patch={patch}
          regionLabel={regionLabel}
          onOpenRegion={() => setLookup('region')}
          onOpenDistrict={() => setLookup('district')}
          hasDistricts={districtItems.length > 0}
        />

        <View>
          <Text style={styles.label}>{t('create.phone')}</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(phone) => patch({ phone })}
            keyboardType="phone-pad"
            placeholder="+998..."
            placeholderTextColor={colors.muted}
          />
        </View>

        <View>
          <Text style={styles.label}>{t('create.telegram')}</Text>
          <TextInput
            style={styles.input}
            value={form.telegramUsername}
            onChangeText={(telegramUsername) => patch({ telegramUsername })}
            placeholder="@username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submit, submitting && styles.submitDisabled]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitText}>{t('create.submit')}</Text>
          )}
        </Pressable>
      </View>

      {sheets}
    </SafeAreaView>
  );
}
