import { CategoryTreeSheet } from '@/components/CategoryTreeSheet/CategoryTreeSheet';
import { LookupSheet, type LookupItem } from '@/components/LookupSheet/LookupSheet';
import type { BrandDto, LookupKind, ModelDto } from '@/hooks/useCreateAdScreen';
import type { AppLanguage } from '@/i18n/types';
import type { CategoryDto } from '@/types/api';
import type { CreateAdFormState } from '@/utils/createAdForm';
import { localizedName } from '@/utils/localizedName';

type Props = {
  categoryOpen: boolean;
  onCloseCategory: () => void;
  onCategorySelect: (cat: CategoryDto, path: CategoryDto[]) => void;
  lookup: LookupKind;
  onCloseLookup: () => void;
  regionItems: LookupItem[];
  districtItems: LookupItem[];
  brandItems: LookupItem[];
  modelItems: LookupItem[];
  form: CreateAdFormState;
  brands: BrandDto[];
  models: ModelDto[];
  language: AppLanguage;
  patch: (partial: Partial<CreateAdFormState>) => void;
  t: (key: string, fallback?: string) => string;
};

export function CreateAdLookupSheets({
  categoryOpen,
  onCloseCategory,
  onCategorySelect,
  lookup,
  onCloseLookup,
  regionItems,
  districtItems,
  brandItems,
  modelItems,
  form,
  brands,
  models,
  language,
  patch,
  t,
}: Props) {
  return (
    <>
      <CategoryTreeSheet
        visible={categoryOpen}
        onClose={onCloseCategory}
        onSelect={onCategorySelect}
      />
      <LookupSheet
        visible={lookup === 'region'}
        title={t('create.region')}
        items={regionItems}
        value={form.region}
        onClose={onCloseLookup}
        onSelect={(region) => patch({ region, district: '' })}
        clearLabel={t('categories.allRegions')}
      />
      <LookupSheet
        visible={lookup === 'district'}
        title={t('create.district')}
        items={districtItems}
        value={form.district}
        onClose={onCloseLookup}
        onSelect={(district) => patch({ district })}
      />
      <LookupSheet
        visible={lookup === 'brand'}
        title={t('create.brand')}
        items={brandItems}
        value={form.brandId}
        allowClear={false}
        onClose={onCloseLookup}
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
      <LookupSheet
        visible={lookup === 'model'}
        title={t('create.model')}
        items={modelItems}
        value={form.modelId}
        allowClear={false}
        onClose={onCloseLookup}
        onSelect={(modelId) => {
          const m = models.find((x) => x.id === modelId);
          patch({
            modelId,
            modelCustom: m ? localizedName(m, language, m.name || modelId) : modelId,
          });
        }}
      />
    </>
  );
}
