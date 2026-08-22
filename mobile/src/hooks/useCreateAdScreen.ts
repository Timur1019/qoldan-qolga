import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { adsApi, referenceApi } from '@/api/client';
import type { LookupItem } from '@/components/LookupSheet/LookupSheet';
import {
  categoryFilterFlags,
  realEstateFieldFlags,
  transportFieldFlags,
} from '@/constants/categoryFilters';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import type { AdDetailDto, CategoryDto } from '@/types/api';
import {
  EMPTY_CREATE_AD,
  buildCreateAdPayload,
  resetCategoryFields,
  validateCreateAd,
  type CreateAdFormState,
} from '@/utils/createAdForm';
import { localizedName } from '@/utils/localizedName';
import { mapAdDetailToCreateForm } from '@/utils/mapAdDetailToCreateForm';
import { detectDeviceLocation } from '@/location/detectDeviceLocation';

export type RegionDto = {
  code: string;
  nameUz?: string;
  nameRu?: string;
  districts?: { id: number | string; nameUz?: string; nameRu?: string }[];
};

export type BrandDto = { id: string; nameUz?: string; nameRu?: string };
export type ModelDto = { id: string; nameUz?: string; nameRu?: string; name?: string };

export type LookupKind = 'region' | 'district' | 'brand' | 'model' | null;

export function useCreateAdScreen(editId?: string) {
  const isEdit = Boolean(editId);
  const { isAuthenticated, user } = useAuth();
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
  const [models, setModels] = useState<ModelDto[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [lookup, setLookup] = useState<LookupKind>(null);
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
        if (alive) setError("E'lonni yuklab bo'lmadi");
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
    if (!form.category) {
      setBrands([]);
      return;
    }
    referenceApi
      .getBrandsByCategory(form.category.code)
      .then((list) => setBrands(Array.isArray(list) ? (list as BrandDto[]) : []))
      .catch(() => setBrands([]));
  }, [form.category]);

  useEffect(() => {
    if (!form.brandId) {
      setModels([]);
      return;
    }
    referenceApi
      .getModelsByBrand(form.brandId)
      .then((list) => setModels(Array.isArray(list) ? (list as ModelDto[]) : []))
      .catch(() => setModels([]));
  }, [form.brandId]);

  useEffect(() => {
    if (isEdit || !isAuthenticated || !regions.length || form.region) return;
    let alive = true;
    void detectDeviceLocation(regions)
      .then((loc) => {
        if (!alive || !loc) return;
        setForm((prev) => {
          if (prev.region) return prev;
          return {
            ...prev,
            region: loc.regionCode || prev.region,
            district: loc.district || prev.district,
            address: loc.address || prev.address,
            locationLat: loc.lat,
            locationLng: loc.lng,
          };
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isEdit, isAuthenticated, regions, form.region]);

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
  const modelItems: LookupItem[] = useMemo(
    () =>
      models.map((m) => ({
        value: m.id,
        label: localizedName(m, language, m.name || m.id),
      })),
    [models, language]
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

  const onCategorySelect = async (cat: CategoryDto, path: CategoryDto[] = []) => {
    patch(resetCategoryFields({ category: cat }));
    if (path.length) setBreadcrumb(path);
    try {
      const list = await referenceApi.getCategoryBreadcrumb(cat.code);
      if (Array.isArray(list) && list.length) setBreadcrumb(list as CategoryDto[]);
    } catch {
      if (!path.length) setBreadcrumb([]);
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

  return {
    isEdit,
    isAuthenticated,
    language,
    t,
    form,
    patch,
    existingImageUrls,
    setExistingImageUrls,
    loadingEdit,
    breadcrumb,
    brands,
    models,
    transport,
    realEstate,
    flags,
    categoryOpen,
    setCategoryOpen,
    lookup,
    setLookup,
    submitting,
    error,
    regions,
    selectedRegion,
    regionLabel,
    regionItems,
    districtItems,
    brandItems,
    modelItems,
    pickImages,
    onCategorySelect,
    submit,
  };
}
